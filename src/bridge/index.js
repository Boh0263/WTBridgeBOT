const { whatsappClient } = require('../clients/whatsapp');
const { telegramClient } = require('../clients/telegram');
const { processMessage } = require('../handlers/message');
const { downloadMedia } = require('../handlers/media');
const { MessageQueue } = require('./queue');
const { MessageMedia } = require('whatsapp-web.js');
const logger = require('../utils/logger');
const config = require('../config');
const LocalizationManager = require('../utils/localization');
const storage = require('../storage');

const whatsappQueue = new MessageQueue();
const telegramQueue = new MessageQueue();

// Pending WhatsApp link confirmations
const waUserStates = new Map(); // key: waId, value: { shortname, tgData }

async function handleWAPrivate(msg) {
  const text = msg.body || '';
  const waId = msg.from; // Full ID like 1234567890@c.us
  const waPhone = waId.split('@')[0];

  console.log('WA private text:', text, 'from ID:', waId, 'phone:', waPhone);

  // Check for confirmation
   if (text.toLowerCase() === 'yes') {
     const state = waUserStates.get(waId);
     if (state && (Date.now() - state.timestamp < 30000)) {
       const { shortname, tgId, participantId } = state;

      console.log('Confirming link for WA participant ID:', participantId, 'to TG ID:', tgId);

       try {
         await msg.reply(LocalizationManager.getInstance().t('iam.confirm_received'));
       } catch (error) {
         logger.error('Failed to send confirmation received reply:', error);
       }

       // Link WA to TG
       const user = storage.getUser(tgId);
       if (user) {
         user.whatsapp = user.whatsapp || {};
         user.whatsapp.wa_id = participantId;
         user.whatsapp.group_chat_id = state.groupChatId;
         user.linking.status = 'linked';
         storage.setUser(tgId, user);
       }

      waUserStates.delete(waId);

      console.log('Link successful');
       try {
         await msg.reply(LocalizationManager.getInstance().t('iam.success', { shortname }));
       } catch (error) {
         logger.error('Failed to send success reply:', error);
       }
    } else if (state) {
      // Expired
      waUserStates.delete(waId);
       try {
         await msg.reply(LocalizationManager.getInstance().t('iam.expired'));
       } catch (error) {
         logger.error('Failed to send expired reply:', error);
       }
    } else {
       try {
         await msg.reply(LocalizationManager.getInstance().t('iam.no_pending'));
       } catch (error) {
         logger.error('Failed to send no pending reply:', error);
       }
    }
  } else {
     try {
       await msg.reply(LocalizationManager.getInstance().t('iam.unknown'));
     } catch (error) {
       logger.error('Failed to send unknown reply:', error);
     }
  }
}

// Function to escape HTML entities
function escapeHtml(text) {
  return text.replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[char]));
}

async function initializeBridge() {
  storage.loadData();

  await whatsappClient.initialize();
  await telegramClient.initialize();

    // WhatsApp to Telegram
    whatsappClient.onMessage(async (msg) => {
      try {
        console.log('WA message from:', msg.from, 'body:', msg.body);

        // Check for !iam command
        const text = msg.body || '';
        if (text.startsWith('!iam ')) {
          console.log('Handling !iam command');
          await handleIAMCommand(msg);
          return;
        }

        logger.info('Received WhatsApp message:', msg.body);
        whatsappQueue.enqueue({ msg, platform: 'whatsapp' });
      } catch (error) {
        logger.error('Error enqueuing WhatsApp message:', error);
      }
    });

    // WhatsApp private messages
    whatsappClient.onPrivateMessage(handleWAPrivate);

    // Telegram to WhatsApp
    telegramClient.onMessage(async (msg) => {
      try {
        logger.info('Received Telegram message:', msg.text || msg.caption);
        telegramQueue.enqueue({ msg, platform: 'telegram' });
      } catch (error) {
        logger.error('Error enqueuing Telegram message:', error);
      }
    });

  // Start processing queues
  setInterval(() => processQueue(whatsappQueue, 'telegram'), 1000); // Process every second
  setInterval(() => processQueue(telegramQueue, 'whatsapp'), 1000);
}

async function processQueue(queue, targetPlatform) {
  while (!queue.isEmpty()) {
    const item = queue.dequeue();
    try {
      const processed = await processMessage(item.msg, item.platform);
      if (processed) {
        // Store user info
        if (processed.userInfo) {
          const userKey = processed.userInfo.platform === 'telegram' ? processed.userInfo.id : null;
          if (userKey) {
            let user = storage.getUser(userKey) || {
              telegram_id: userKey.toString(),
              linking: { status: 'unlinked' },
              metadata: { created_at: Date.now() }
            };
            user.telegram = user.telegram || {};
            user.telegram.name = processed.userInfo.name;
            user.telegram.shortname = processed.userInfo.shortname;
            storage.setUser(userKey, user);
          }
        }

        let replyId = null;
        if (processed.replyTo) {
          const key = `${item.platform}:${processed.replyTo}`;
          const mapping = storage.getMessageMapping(key);
          if (mapping) {
            replyId = targetPlatform === 'telegram' ? (mapping.telegram || null) : (mapping.whatsapp || null);
          }
        }

        // Replace mentions
        const { newText, mentionedIds } = replaceMentions(processed.text, processed.mentions, targetPlatform);
        processed.text = newText;

        const forwardedId = targetPlatform === 'telegram' ?
          await forwardToTelegram(processed, replyId) :
          await forwardToWhatsApp(processed, replyId, mentionedIds);

        // Store mapping
        const originalKey = `${item.platform}:${processed.originalId}`;
        let mapping = storage.getMessageMapping(originalKey) || { timestamp: Date.now() };
        if (targetPlatform === 'telegram') {
          mapping.telegram = forwardedId.id;
        } else {
          mapping.whatsapp = forwardedId.id;
        }
        storage.setMessageMapping(originalKey, mapping);
      }
      } catch (error) {
        logger.error(`Error processing message from ${item.platform}:`, error);
      }
  }
}

async function forwardToTelegram(msg, replyId) {
   const { text, media, originalMsg, userInfo, from: platform } = msg;

   // Lookup sender info
   let senderName;
   if (platform === 'whatsapp') {
     const found = storage.findUserByWaId(userInfo.id);
     if (found) {
       senderName = found.user.telegram?.shortname || found.user.telegram?.name || userInfo.name || 'Unknown';
     } else {
       senderName = userInfo.name || 'Unknown';
     }
   } else {
     // telegram
     const mappedUser = storage.getUser(userInfo.id);
     senderName = (mappedUser?.telegram?.shortname || mappedUser?.telegram?.name) || userInfo.name || 'Unknown';
   }

  // Build formatted text
  const content = escapeHtml(text || '');
  const embedText = `<b>${escapeHtml(senderName)}:</b>\n${content}`;

  const options = replyId ? { reply_to_message_id: replyId, parse_mode: 'HTML' } : { parse_mode: 'HTML' };

  if (media) {
    if (platform === 'whatsapp') {
      const mediaData = await downloadMedia(originalMsg, 'whatsapp');
      if (!mediaData) {
        // Handle failed media download
        logger.error('Failed to download media from WhatsApp');
        return await telegramClient.sendMessage(embedText, options);
      }
      const buffer = Buffer.from(mediaData.data, 'base64');
      const mimeType = mediaData.mimetype || 'application/octet-stream';
      const filename = mediaData.filename || 'file';
      if (mimeType.startsWith('image/')) {
        return await telegramClient.sendPhoto(buffer, embedText, options);
      } else if (mimeType.startsWith('video/')) {
        return await telegramClient.sendVideo(buffer, embedText, options);
      } else if (mimeType.startsWith('audio/')) {
        return await telegramClient.sendAudio(buffer, embedText, options);
      } else {
        return await telegramClient.sendDocument(buffer, embedText, { ...options, filename });
      }
    } else {
      const mediaData = await downloadMedia(originalMsg, 'telegram');
      if (!mediaData) {
        // Handle failed media download
        logger.error('Failed to download media from Telegram');
        return await telegramClient.sendMessage(embedText, options);
      }
      if (mediaData.type === 'image') {
        return await telegramClient.sendPhoto(mediaData.data, embedText, options);
      } else if (mediaData.type === 'document') {
        return await telegramClient.sendDocument(mediaData.data, embedText, options);
      } else if (mediaData.type === 'video') {
        return await telegramClient.sendVideo(mediaData.data, embedText, options);
      } else if (mediaData.type === 'audio') {
        return await telegramClient.sendDocument(mediaData.data, embedText, options);
      }
    }
  } else {
    return await telegramClient.sendMessage(embedText, options);
  }
}

async function forwardToWhatsApp(msg, replyId, mentionedIds = []) {
   const { text, media, originalMsg, userInfo, from: platform } = msg;

   // Lookup sender info
   let senderName;
   if (platform === 'whatsapp') {
     const found = storage.findUserByWaId(userInfo.id);
     if (found) {
       senderName = found.user.telegram?.shortname || found.user.telegram?.name || userInfo.name || 'Unknown';
     } else {
       senderName = userInfo.name || 'Unknown';
     }
   } else {
     // telegram
     const mappedUser = storage.getUser(userInfo.id);
     senderName = (mappedUser?.telegram?.shortname || mappedUser?.telegram?.name) || userInfo.name || 'Unknown';
   }

  // Build formatted text
  const content = text || '';
  const formattedText = `*${senderName}:*\n${content}`;

  const options = replyId ? { quotedMessageId: replyId } : {};
  if (mentionedIds.length > 0) {
    options.mentions = mentionedIds;
  }
  if (media) {
    let mediaData;
    if (platform === 'whatsapp') {
      mediaData = await downloadMedia(originalMsg, 'whatsapp');
      if (!mediaData) {
        // Handle failed media download
        logger.error('Failed to download media from WhatsApp');
        return await whatsappClient.sendMessage(config.whatsapp.groupId, formattedText, null, options);
      }
    } else {
      const downloaded = await downloadMedia(originalMsg, 'telegram');
      if (!downloaded) {
        // Handle failed media download
        logger.error('Failed to download media from Telegram');
        return await whatsappClient.sendMessage(config.whatsapp.groupId, formattedText, null, options);
      }
      if (downloaded.type === 'image') {
        mediaData = new MessageMedia(downloaded.mimeType || 'image/jpeg', downloaded.data.toString('base64'));
      } else if (downloaded.type === 'document') {
        mediaData = new MessageMedia(downloaded.mimeType || 'application/octet-stream', downloaded.data.toString('base64'), downloaded.fileName);
      } else if (downloaded.type === 'video') {
        mediaData = new MessageMedia(downloaded.mimeType || 'video/mp4', downloaded.data.toString('base64'));
      } else if (downloaded.type === 'audio') {
        mediaData = new MessageMedia(downloaded.mimeType || 'audio/ogg', downloaded.data.toString('base64'), downloaded.fileName);
      }
    }
    return await whatsappClient.sendMessage(config.whatsapp.groupId, formattedText, mediaData, options);
  } else {
    return await whatsappClient.sendMessage(config.whatsapp.groupId, formattedText, null, options);
  }
}



function replaceMentions(text, mentions, targetPlatform) {
  let newText = text;
  let mentionedIds = [];
  mentions.forEach(mention => {
    let mentionedUser = null;
    if (mention.platform === 'telegram') {
      mentionedUser = storage.findUserByUsername(mention.username);
    } else {
      mentionedUser = storage.findUserByWaId(mention.id);
    }
    if (mentionedUser) {
      const isLinked = (targetPlatform === 'telegram' && mentionedUser.telegram) ||
                       (targetPlatform === 'whatsapp' && mentionedUser.whatsapp);
      if (targetPlatform === 'telegram') {
        if (mention.platform === 'telegram') {
          if (isLinked) {
            // Same platform linked: replace @username with @counterpart_username
            const currentMention = `@${mention.username}`;
            const replacement = mentionedUser.telegram.username ? `@${mentionedUser.telegram.username}` : `@${mentionedUser.telegram.name}`;
            newText = newText.replace(new RegExp(currentMention, 'g'), replacement);
          }
          // Unlinked: leave @username as-is (harmless invalid mention)
        }
        // Cross-platform from WhatsApp: no text replacement (leave @name)
      } else if (targetPlatform === 'whatsapp') {
        if (mention.platform === 'telegram') {
          if (isLinked) {
            // Cross-platform: replace @username with @name and add to mentionedIds
            const currentMention = `@${mention.username}`;
            const replacement = `@${mentionedUser.telegram?.name || 'Unknown'}`;
            newText = newText.replace(new RegExp(currentMention, 'g'), replacement);
            mentionedIds.push(mentionedUser.whatsapp.wa_id);
          }
          // Unlinked: leave @username, no mentionedIds
        } else if (mention.platform === 'whatsapp') {
          if (isLinked) {
            // Same platform: add to mentionedIds, no text replacement
            mentionedIds.push(mentionedUser.whatsapp.wa_id);
          }
          // Unlinked: no change
        }
      }
    }
  });
  return { newText, mentionedIds };
}

async function handleIAMCommand(msg) {
  const text = msg.body || '';
  const waId = msg.author || msg.from; // Group participant ID
  const parts = text.trim().split(/\s+/);
  if (parts.length !== 2) {
     try {
       await whatsappClient.sendMessage(waId + '@c.us', LocalizationManager.getInstance().t('iam.usage'));
     } catch (error) {
       logger.error('Failed to send usage message:', error);
     }
    return;
  }
  const shortname = parts[1].trim().toLowerCase();

  // Validate shortname
  if (shortname.length > 9 || shortname.length < 1 || !/^[a-zA-Z0-9]+$/.test(shortname)) {
     try {
       await whatsappClient.sendMessage(waId + '@c.us', LocalizationManager.getInstance().t('iam.invalid_shortname'));
     } catch (error) {
       logger.error('Failed to send invalid message:', error);
     }
    return;
  }

  console.log('IAM command from WA participant ID:', waId, 'shortname:', shortname);

  // Find matching TG user by shortname
  const found = storage.findUserByShortname(shortname);
  let tgId = null;
  let tgData = null;
  if (found) {
    tgId = found.id;
    tgData = found.user;
  }

  if (!tgId) {
     try {
       await whatsappClient.sendMessage(waId + '@c.us', LocalizationManager.getInstance().t('iam.no_match'));
     } catch (error) {
       logger.error('Failed to send no match message:', error);
     }
    return;
  }

  // Set state for confirmation
  waUserStates.set(tgData.whatsapp.phone_number + '@c.us', { shortname, tgData, tgId, groupChatId: msg.from, participantId: waId, timestamp: Date.now() });

    try {
      await whatsappClient.sendMessage(tgData.whatsapp.phone_number + '@c.us', LocalizationManager.getInstance().t('iam.confirm', { name: tgData.telegram?.name || 'Unknown' }));
    } catch (error) {
      logger.error('Failed to send confirmation message:', error);
    }
}

module.exports = { initializeBridge };