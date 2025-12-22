const { whatsappClient } = require('../clients/whatsapp');
const { telegramClient } = require('../clients/telegram');
const { processMessage } = require('../handlers/message');
const { downloadMedia } = require('../handlers/media');
const { MessageQueue } = require('./queue');
const { MessageMedia } = require('whatsapp-web.js');
const logger = require('../utils/logger');
const config = require('../config');
const fs = require('fs');
const path = require('path');

const whatsappQueue = new MessageQueue();
const telegramQueue = new MessageQueue();

// Mapping of message IDs between platforms
const messageIdMap = new Map(); // key: 'platform:id', value: { waId, tgId, timestamp }

// Mapping of users: key tgId, value { phoneNumber, waId?, shortname, name, groupChatId? }
const userMap = new Map();

// Reverse mapping: waId -> tgId
const waIdToTgId = new Map();

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
      const { shortname, tgData, tgId, participantId } = state;

      console.log('Confirming link for WA participant ID:', participantId, 'to TG ID:', tgId);

      try {
        await msg.reply('Confirmation received. Linking your accounts...');
      } catch (error) {
        logger.error('Failed to send confirmation received reply:', error);
      }

      // Link WA to TG
      const user = userMap.get(tgId);
      user.waId = participantId;
      user.groupChatId = state.groupChatId;

      // Add reverse mapping
      waIdToTgId.set(participantId, tgId);

      waUserStates.delete(waId);

      console.log('Link successful');
      try {
        await msg.reply(`Linked successfully! Your shortname is ${shortname}.`);
      } catch (error) {
        logger.error('Failed to send success reply:', error);
      }
    } else if (state) {
      // Expired
      waUserStates.delete(waId);
      try {
        await msg.reply('Confirmation expired. Please try !iam again.');
      } catch (error) {
        logger.error('Failed to send expired reply:', error);
      }
    } else {
      try {
        await msg.reply('No pending confirmation found.');
      } catch (error) {
        logger.error('Failed to send no pending reply:', error);
      }
    }
  } else {
    try {
      await msg.reply('Unknown command. Reply "yes" to confirm linking.');
    } catch (error) {
      logger.error('Failed to send unknown reply:', error);
    }
  }
}

const MAPPING_FILE = path.join(__dirname, 'messageMappings.json');
const USER_FILE = path.join(__dirname, 'userMappings.json');
const WA_FILE = path.join(__dirname, 'waIdMappings.json');

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

// Load mappings on start
function loadMappings() {
  try {
    if (fs.existsSync(MAPPING_FILE)) {
      const data = JSON.parse(fs.readFileSync(MAPPING_FILE, 'utf8'));
      for (const [key, value] of Object.entries(data)) {
        messageIdMap.set(key, value);
      }
    }
    if (fs.existsSync(USER_FILE)) {
      const data = JSON.parse(fs.readFileSync(USER_FILE, 'utf8'));
      for (const [key, value] of Object.entries(data)) {
        userMap.set(key, value);
      }
    }
    if (fs.existsSync(WA_FILE)) {
      const data = JSON.parse(fs.readFileSync(WA_FILE, 'utf8'));
      for (const [key, value] of Object.entries(data)) {
        waIdToTgId.set(key, value);
      }
    }
  } catch (error) {
    logger.error('Error loading mappings:', error);
  }
}

// Save mappings periodically
function saveMappings() {
  try {
    const data = {};
    for (const [key, value] of messageIdMap) {
      data[key] = value;
    }
    fs.writeFileSync(MAPPING_FILE, JSON.stringify(data, null, 2));

    const userData = {};
    for (const [key, value] of userMap) {
      userData[key] = value;
    }
    fs.writeFileSync(USER_FILE, JSON.stringify(userData, null, 2));

    const waIdData = {};
    for (const [key, value] of waIdToTgId) {
      waIdData[key] = value;
    }
    fs.writeFileSync(WA_FILE, JSON.stringify(waIdData, null, 2));
  } catch (error) {
    logger.error('Error saving mappings:', error);
  }
}

// Cleanup old mappings (older than 7 days)
function cleanupMappings() {
  const now = Date.now();
  const cutoff = 7 * 24 * 60 * 60 * 1000; // 7 days
  for (const [key, value] of messageIdMap) {
    if (now - value.timestamp > cutoff) {
      messageIdMap.delete(key);
    }
  }
}

async function initializeBridge() {
  loadMappings();

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

  // Save mappings every minute
  setInterval(saveMappings, 60 * 1000);

  // Cleanup old mappings every hour
  setInterval(cleanupMappings, 60 * 60 * 1000);
}

async function processQueue(queue, targetPlatform) {
  while (!queue.isEmpty()) {
    const item = queue.dequeue();
    try {
      const processed = await processMessage(item.msg, item.platform);
      if (processed) {
        // Store user info
        if (processed.userInfo) {
          const userKey = `${processed.userInfo.platform}:${processed.userInfo.id}`;
          userMap.set(userKey, processed.userInfo);
        }

        let replyId = null;
        if (processed.replyTo) {
          const key = `${item.platform}:${processed.replyTo}`;
          const mapping = messageIdMap.get(key);
          if (mapping) {
            replyId = targetPlatform === 'telegram' ? mapping.tgId : mapping.waId;
          }
        }

        // Replace mentions
        processed.text = replaceMentions(processed.text, processed.mentions, targetPlatform);

        const forwardedId = targetPlatform === 'telegram' ?
          await forwardToTelegram(processed, replyId) :
          await forwardToWhatsApp(processed, replyId);

        // Store mapping
        const originalKey = `${item.platform}:${processed.originalId}`;
        if (!messageIdMap.has(originalKey)) {
          messageIdMap.set(originalKey, { timestamp: Date.now() });
        }
        const mapping = messageIdMap.get(originalKey);
        if (targetPlatform === 'telegram') {
          mapping.tgId = forwardedId.id;
        } else {
          mapping.waId = forwardedId.id;
        }
      }
      } catch (error) {
        logger.error(`Error processing message from ${item.platform}:`, error);
      }
  }
}

async function forwardToTelegram(msg, replyId) {
  const { text, media, originalMsg, userInfo } = msg;

  // Lookup sender info from userMap
  const senderKey = `${userInfo.platform}:${userInfo.id}`;
  const mappedUser = userMap.get(senderKey);
  const senderName = mappedUser?.shortname || userInfo.name || 'Unknown';

  // Build formatted text
  const content = escapeHtml(text || '');
  const timestamp = escapeHtml(new Date().toLocaleString());
  const embedText = `<b>${escapeHtml(senderName)}:</b>\n${content}\n<i>${timestamp}</i>`;

  const options = replyId ? { reply_to_message_id: replyId, parse_mode: 'HTML' } : { parse_mode: 'HTML' };

  if (media) {
    const mediaData = await downloadMedia(originalMsg, 'telegram');
    if (mediaData.type === 'image') {
      return await telegramClient.sendPhoto(mediaData.data, embedText, options);
    } else if (mediaData.type === 'document') {
      return await telegramClient.sendDocument(mediaData.data, embedText, options);
    } else if (mediaData.type === 'video') {
      return await telegramClient.sendVideo(mediaData.data, embedText, options);
    }
  } else {
    return await telegramClient.sendMessage(embedText, options);
  }
}

async function forwardToWhatsApp(msg, replyId) {
  const { text, media, originalMsg, userInfo } = msg;

  // Lookup sender info from userMap
  const senderKey = `${userInfo.platform}:${userInfo.id}`;
  const mappedUser = userMap.get(senderKey);
  const senderName = mappedUser?.shortname || userInfo.name || 'Unknown';

  // Build formatted text
  const content = text || '';
  const formattedText = `*${senderName}:*\n${content}\n_${new Date().toLocaleString()}_`;

  const options = replyId ? { quotedMessageId: replyId } : {};
  if (media) {
    let mediaData;
    if (originalMsg.platform === 'whatsapp') {
      mediaData = await downloadMedia(originalMsg, 'whatsapp');
    } else {
      const downloaded = await downloadMedia(originalMsg, 'telegram');
      if (downloaded.type === 'image') {
        mediaData = MessageMedia.fromBuffer(downloaded.data, 'image/jpeg');
      } else if (downloaded.type === 'document') {
        mediaData = MessageMedia.fromBuffer(downloaded.data, 'application/octet-stream');
      } else if (downloaded.type === 'video') {
        mediaData = MessageMedia.fromBuffer(downloaded.data, 'video/mp4');
      }
    }
    return await whatsappClient.sendMessage(config.whatsapp.groupId, formattedText, mediaData, options);
  } else {
    return await whatsappClient.sendMessage(config.whatsapp.groupId, formattedText, null, options);
  }
}



function replaceMentions(text, mentions, targetPlatform) {
  let newText = text;
  mentions.forEach(mention => {
    const key = `${mention.platform}:${mention.id || mention.username}`;
    const user = userMap.get(key);
    if (user) {
      const currentMention = mention.platform === 'whatsapp' ? `@${mention.id}` : `@${mention.username}`;
      const replacement = targetPlatform === 'telegram' ? (user.username ? `@${user.username}` : user.name) : `@${user.name}`;
      newText = newText.replace(new RegExp(currentMention, 'g'), replacement);
    }
  });
  return newText;
}

async function handleIAMCommand(msg) {
  const text = msg.body || '';
  const waId = msg.author || msg.from; // Group participant ID
  const parts = text.trim().split(/\s+/);
  if (parts.length !== 2) {
    try {
      await whatsappClient.sendMessage(waId + '@c.us', 'Usage: !iam <shortname>');
    } catch (error) {
      logger.error('Failed to send usage message:', error);
    }
    return;
  }
  const shortname = parts[1].trim().toLowerCase();

  // Validate shortname
  if (shortname.length > 9 || shortname.length < 1 || !/^[a-zA-Z0-9]+$/.test(shortname)) {
    try {
      await whatsappClient.sendMessage(waId + '@c.us', 'Invalid shortname. Use 1-9 alphanumeric characters.');
    } catch (error) {
      logger.error('Failed to send invalid message:', error);
    }
    return;
  }

  console.log('IAM command from WA participant ID:', waId, 'shortname:', shortname);

  // Find matching TG user by shortname
  let tgId = null;
  let tgData = null;
  for (const [key, value] of userMap) {
    if (value.shortname === shortname) {
      tgId = key;
      tgData = value;
      break;
    }
  }

  if (!tgId) {
    try {
      await whatsappClient.sendMessage(waId + '@c.us', 'No matching Telegram user found with that shortname.');
    } catch (error) {
      logger.error('Failed to send no match message:', error);
    }
    return;
  }

  // Set state for confirmation
  waUserStates.set(tgData.phoneNumber + '@c.us', { shortname, tgData, tgId, groupChatId: msg.from, participantId: waId, timestamp: Date.now() });

  try {
    await whatsappClient.sendMessage(tgData.phoneNumber + '@c.us', `Is this you (${tgData.name})? Reply 'yes' within 30 seconds to confirm linking.`);
  } catch (error) {
    logger.error('Failed to send confirmation message:', error);
  }
}

module.exports = { initializeBridge, userMap, waIdToTgId, saveMappings };