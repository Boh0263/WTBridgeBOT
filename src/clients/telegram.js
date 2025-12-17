const TelegramBot = require('node-telegram-bot-api');
const config = require('../config');

class TelegramClient {
  constructor() {
    this.bot = new TelegramBot(config.telegram.botToken, { polling: true });

    this.bot.on('message', (msg) => {
      if (msg.chat.id.toString() !== config.telegram.groupId) return;
      if (msg.from.id === this.bot.options.username) return; // Ignore own messages (though bots don't receive their own)
      this.onMessage(msg);
    });
  }

  async sendMessage(text, options = {}) {
    const sent = await this.bot.sendMessage(config.telegram.groupId, text, options);
    return { id: sent.message_id };
  }

  async sendPhoto(photo, caption = '', options = {}) {
    const sent = await this.bot.sendPhoto(config.telegram.groupId, photo, { caption, ...options });
    return { id: sent.message_id };
  }

  async sendDocument(doc, caption = '', options = {}) {
    const sent = await this.bot.sendDocument(config.telegram.groupId, doc, { caption, ...options });
    return { id: sent.message_id };
  }

  async sendVideo(video, caption = '', options = {}) {
    const sent = await this.bot.sendVideo(config.telegram.groupId, video, { caption, ...options });
    return { id: sent.message_id };
  }

  onMessage(callback) {
    this.messageCallback = callback;
  }
}

const telegramClient = new TelegramClient();

module.exports = { telegramClient };