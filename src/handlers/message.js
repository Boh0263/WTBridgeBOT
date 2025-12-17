async function processMessage(msg, platform) {
  let text = '';
  let media = null;
  let replyTo = null;
  let timestamp = null;
  let sender = null;
  let mentions = [];
  let userInfo = null;

  if (platform === 'whatsapp') {
    text = msg.body || '';
    if (msg.hasMedia) {
      media = { type: 'whatsapp', msg };
    }
    if (msg.hasQuotedMsg) {
      const quotedMsg = await msg.getQuotedMessage();
      replyTo = quotedMsg.id;
    }
    timestamp = msg.timestamp;
    sender = msg.author || msg.from;
    userInfo = { id: sender, name: msg.pushname || 'Unknown', platform: 'whatsapp' };
    // Extract mentions: WhatsApp mentions are @number in text
    const mentionRegex = /@(\d+)/g;
    let match;
    while ((match = mentionRegex.exec(text)) !== null) {
      mentions.push({ id: match[1], platform: 'whatsapp' });
    }
  } else if (platform === 'telegram') {
    text = msg.text || msg.caption || '';
    if (msg.photo && msg.photo.length > 0) {
      const fileId = msg.photo[msg.photo.length - 1].file_id;
      media = { type: 'image', fileId };
    } else if (msg.document) {
      media = { type: 'document', fileId: msg.document.file_id, fileName: msg.document.file_name };
    } else if (msg.video) {
      media = { type: 'video', fileId: msg.video.file_id };
    }
    if (msg.reply_to_message) {
      replyTo = msg.reply_to_message.message_id;
    }
    timestamp = msg.date;
    sender = msg.from.username || msg.from.first_name;
    userInfo = { id: msg.from.id, username: msg.from.username, name: msg.from.first_name + ' ' + (msg.from.last_name || ''), platform: 'telegram' };
    // Extract mentions from entities
    if (msg.entities) {
      msg.entities.forEach(entity => {
        if (entity.type === 'mention') {
          const mentionText = text.substr(entity.offset, entity.length);
          mentions.push({ username: mentionText.substr(1), platform: 'telegram' }); // remove @
        }
      });
    }
  }

  // Skip if no content
  if (!text && !media) return null;

  return { text, media, replyTo, timestamp, sender, mentions, userInfo, from: platform, originalId: msg.id || msg.message_id, originalMsg: msg };
}

module.exports = { processMessage };