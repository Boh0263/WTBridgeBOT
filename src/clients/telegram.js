const TelegramBot = require('node-telegram-bot-api');
const config = require('../config');
const logger = require('../utils/logger');

class TelegramClient {
  constructor() {
    this.bot = new TelegramBot(config.telegram.botToken, { polling: true });

    this.bot.on('message', (msg) => {
      logger.info('Telegram message received from chat:', msg.chat.id, 'text:', msg.text || msg.caption);
      if (msg.chat.id.toString() !== config.telegram.groupId) {
        logger.warn('Telegram message from wrong chat, ignoring');
        return;
      }
      // Bots don't receive their own messages in polling mode, so no need to check
      if (this.messageCallback) this.messageCallback(msg);
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

  async initialize() {
    // Polling starts automatically in constructor
  }

  onMessage(callback) {
    this.messageCallback = callback;
  }
}

const telegramClient = new TelegramClient();

module.exports = { telegramClient };