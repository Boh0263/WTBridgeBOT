async function processMessage(msg, platform) {
  let text = '';
  let media = null;
  let replyTo = null;
  let timestamp = null;
  let sender = null;
  let mentions = [];
  let userInfo = null;

  const { userMap } = require('../bridge/index');

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
     // Use pushname directly, fallback to Unknown
     const name = msg.pushname || 'Unknown';
    userInfo = { id: sender, name, platform: 'whatsapp' };
    // Lookup shortname from userMap
    const { waIdToTgId, userMap } = require('../bridge/index');
    const tgId = waIdToTgId.get(sender);
    if (tgId) {
      const user = userMap.get(tgId);
      if (user) {
        userInfo.shortname = user.shortname;
      }
    }
    // Extract mentions
    if (msg.mentionedIds) {
      mentions = msg.mentionedIds.map(id => ({ id, platform: 'whatsapp' }));
    }
  } else if (platform === 'telegram') {
    text = msg.text || msg.caption || '';
    // Handle media for telegram if needed
    if (msg.photo || msg.document || msg.video || msg.audio || msg.voice) {
      media = { type: 'telegram', msg };
    }
    if (msg.reply_to_message) {
      replyTo = msg.reply_to_message.message_id;
    }
    timestamp = msg.date;
    sender = msg.from.username || msg.from.first_name;
    userInfo = { id: msg.from.id, username: msg.from.username, name: msg.from.first_name + ' ' + (msg.from.last_name || ''), platform: 'telegram' };
    // Lookup shortname from userMap
    const { userMap } = require('../bridge/index');
    const user = userMap.get(msg.from.id);
    if (user) {
      userInfo.shortname = user.shortname;
    }
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