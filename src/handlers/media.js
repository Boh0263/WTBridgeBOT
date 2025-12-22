const { listenClient: waListen } = require('../clients/whatsapp');
const { telegramClient: tgListen } = require('../clients/telegram');

async function downloadMedia(msg, platform) {
  if (platform === 'whatsapp') {
    return await waListen.downloadMedia(msg);
  } else if (platform === 'telegram') {
    if (msg.photo) {
      const photo = msg.photo[msg.photo.length - 1];
      if (photo.file_size > 20 * 1024 * 1024) return null;
      const fileStream = tgListen.bot.getFileStream(photo.file_id);
      const buffer = await streamToBuffer(fileStream);
      return { type: 'image', data: buffer };
    } else if (msg.document) {
      if (msg.document.file_size > 20 * 1024 * 1024) return null; // Telegram bot limit
      const fileStream = tgListen.bot.getFileStream(msg.document.file_id);
      const buffer = await streamToBuffer(fileStream);
      const mimeType = msg.document.mime_type;
      let type = 'document';
      if (mimeType && mimeType.startsWith('image/')) type = 'image';
      else if (mimeType && mimeType.startsWith('video/')) type = 'video';
      else if (mimeType && mimeType.startsWith('audio/')) type = 'audio';
      return { type, data: buffer, fileName: msg.document.file_name, mimeType };
    } else if (msg.video) {
      if (msg.video.file_size > 20 * 1024 * 1024) return null;
      const fileStream = tgListen.bot.getFileStream(msg.video.file_id);
      const buffer = await streamToBuffer(fileStream);
      return { type: 'video', data: buffer, mimeType: msg.video.mime_type };
    } else if (msg.voice) {
      if (msg.voice.file_size > 20 * 1024 * 1024) return null;
      const fileStream = tgListen.bot.getFileStream(msg.voice.file_id);
      const buffer = await streamToBuffer(fileStream);
      return { type: 'audio', data: buffer, mimeType: 'audio/ogg' };
    } else if (msg.audio) {
      if (msg.audio.file_size > 20 * 1024 * 1024) return null;
      const fileStream = tgListen.bot.getFileStream(msg.audio.file_id);
      const buffer = await streamToBuffer(fileStream);
      return { type: 'audio', data: buffer, fileName: msg.audio.title || msg.audio.file_name, mimeType: msg.audio.mime_type };
    } else if (msg.sticker) {
      if (msg.sticker.file_size > 20 * 1024 * 1024) return null;
      const fileStream = tgListen.bot.getFileStream(msg.sticker.file_id);
      const buffer = await streamToBuffer(fileStream);
      return { type: 'image', data: buffer, mimeType: 'image/webp' };
    } else if (msg.animation) {
      if (msg.animation.file_size > 20 * 1024 * 1024) return null;
      const fileStream = tgListen.bot.getFileStream(msg.animation.file_id);
      const buffer = await streamToBuffer(fileStream);
      return { type: 'video', data: buffer, mimeType: msg.animation.mime_type };
    }
  }
  return null;
}

function streamToBuffer(stream) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stream.on('data', chunk => chunks.push(chunk));
    stream.on('end', () => resolve(Buffer.concat(chunks)));
    stream.on('error', reject);
  });
}

module.exports = { downloadMedia };