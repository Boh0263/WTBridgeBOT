const { whatsappClient } = require('../clients/whatsapp');
const { telegramClient } = require('../clients/telegram');
const { processMessage } = require('../handlers/message');
const { downloadMedia } = require('../handlers/media');
const { MessageQueue } = require('./queue');

const whatsappQueue = new MessageQueue();
const telegramQueue = new MessageQueue();

async function initializeBridge() {
  loadMappings();

  await whatsappClient.initialize();

  // WhatsApp to Telegram
  whatsappClient.onMessage(async (msg) => {
    try {
      whatsappQueue.enqueue({ msg, platform: 'whatsapp' });
    } catch (error) {
      console.error('Error enqueuing WhatsApp message:', error);
    }
  });

  // Telegram to WhatsApp
  telegramClient.onMessage(async (msg) => {
    try {
      telegramQueue.enqueue({ msg, platform: 'telegram' });
    } catch (error) {
      console.error('Error enqueuing Telegram message:', error);
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
    }
    if (fs.existsSync(USER_FILE)) {
      const data = JSON.parse(fs.readFileSync(USER_FILE, 'utf8'));
      for (const [key, value] of Object.entries(data)) {
        userMap.set(key, value);
      }
    }
  } catch (error) {
    console.error('Error loading mappings:', error);
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
  } catch (error) {
    console.error('Error saving mappings:', error);
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

  await waListen.initialize();
  await waWrite.initialize();

  // WhatsApp to Telegram
  waListen.onMessage(async (msg) => {
    try {
      whatsappQueue.enqueue({ msg, platform: 'whatsapp' });
    } catch (error) {
      console.error('Error enqueuing WhatsApp message:', error);
    }
  });

  // Telegram to WhatsApp
  tgListen.onMessage(async (msg) => {
    try {
      telegramQueue.enqueue({ msg, platform: 'telegram' });
    } catch (error) {
      console.error('Error enqueuing Telegram message:', error);
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
      console.error(`Error processing message from ${item.platform}:`, error);
    }
  }
}

async function forwardToTelegram(msg, replyId) {
  const { text, media } = msg;
  const options = replyId ? { reply_to_message_id: replyId } : {};
  if (media) {
    const mediaData = await downloadForTelegram(media);
    if (media.type === 'image') {
      return await telegramClient.sendPhoto(mediaData, text, options);
    } else if (media.type === 'document') {
      return await telegramClient.sendDocument(mediaData, text, options);
    } else if (media.type === 'video') {
      return await telegramClient.sendVideo(mediaData, text, options);
    }
  } else {
    return await telegramClient.sendMessage(text, options);
  }
}

async function forwardToWhatsApp(msg, replyId) {
  const { text, media } = msg;
  const options = replyId ? { quotedMessageId: replyId } : {};
  if (media) {
    const mediaData = await downloadForWhatsApp(media);
    return await whatsappClient.sendMessage(text, mediaData, options);
  } else {
    return await whatsappClient.sendMessage(text, null, options);
  }
}
  } else {
    return await tgWrite.sendMessage(fullText, options);
  }
}

async function forwardToWhatsApp(msg, replyId) {
  const { text, media, sender, timestamp } = msg;
  const senderInfo = sender ? `[${sender} - ${new Date(timestamp * 1000).toISOString()}] ` : '';
  const fullText = senderInfo + text;
  const options = replyId ? { quotedMessageId: replyId } : {};
  if (media) {
    const mediaData = await downloadForWhatsApp(media);
    return await waWrite.sendMessage(fullText, mediaData, options);
  } else {
    return await waWrite.sendMessage(fullText, null, options);
  }
}

async function downloadForTelegram(media) {
  if (media.type === 'image' || media.type === 'document' || media.type === 'video') {
    return await downloadMedia({ file_id: media.fileId }, 'telegram');
  }
  return null;
}

async function downloadForWhatsApp(media) {
  if (media.type === 'whatsapp') {
    return await whatsappClient.downloadMedia(media.msg);
  }
  return null;
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

module.exports = { initializeBridge };