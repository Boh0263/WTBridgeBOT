const { listenClient: waListen } = require('../clients/whatsapp');
const { listenBot: tgListen } = require('../clients/telegram');

async function downloadMedia(msg, platform) {
  if (platform === 'whatsapp') {
    return await waListen.downloadMedia(msg);
  } else if (platform === 'telegram') {
    if (msg.photo) {
      const fileId = msg.photo[msg.photo.length - 1].file_id;
      const fileStream = tgListen.bot.getFileStream(fileId);
      const buffer = await streamToBuffer(fileStream);
      return { type: 'image', data: buffer };
    } else if (msg.document) {
      const fileStream = tgListen.bot.getFileStream(msg.document.file_id);
      const buffer = await streamToBuffer(fileStream);
      return { type: 'document', data: buffer, fileName: msg.document.file_name };
    } else if (msg.video) {
      const fileStream = tgListen.bot.getFileStream(msg.video.file_id);
      const buffer = await streamToBuffer(fileStream);
      return { type: 'video', data: buffer };
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