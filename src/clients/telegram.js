const TelegramBot = require('node-telegram-bot-api');
const config = require('../config');
const logger = require('../utils/logger');
const LocalizationManager = require('../utils/localization');

class TelegramClient {
  constructor() {
    this.bot = new TelegramBot(config.telegram.botToken, { polling: true });
    this.userStates = new Map(); // tgId -> { step, data }
    this.unlinkStates = new Map(); // tgId -> { timestamp }

    this.bot.on('message', (msg) => {
      logger.info('Telegram message received from chat:', msg.chat.id, 'text:', msg.text || msg.caption);

      // Handle private linking
      if (msg.chat.type === 'private') {
        this.handlePrivateMessage(msg);
        return;
      }

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

  async sendAudio(audio, caption = '', options = {}) {
    const sent = await this.bot.sendAudio(config.telegram.groupId, audio, { caption, ...options });
    return { id: sent.message_id };
  }

  async initialize() {
    // Polling starts automatically in constructor
  }

  onMessage(callback) {
    this.messageCallback = callback;
  }

  async handlePrivateMessage(msg) {
    const tgId = msg.from.id;
    const text = msg.text || '';
    const userMap = require('../bridge/index').userMap;

    // Check for unlink confirmation
    if (text.toLowerCase() === 'yes') {
      const state = this.unlinkStates.get(tgId);
      if (state && (Date.now() - state.timestamp < 30000)) {
        // Delete mappings
        const { waIdToTgId } = require('../bridge/index');
        const user = userMap.get(tgId);
        if (user) {
          const waId = user.waId;
          userMap.delete(tgId);
          if (waId) {
            waIdToTgId.delete(waId);
          }
        }
        require('../bridge/index').saveMappings(); // Force save to disk
        this.unlinkStates.delete(tgId);
        try {
          await this.bot.sendMessage(tgId, LocalizationManager.getInstance().t('unlink.success'));
        } catch (e) {
          console.error('Send error for unlink success:', e);
        }
      } else {
        try {
          await this.bot.sendMessage(tgId, LocalizationManager.getInstance().t('unlink.no_pending'));
        } catch (e) {
          console.error('Send error for no pending:', e);
        }
      }
      return;
    }

    if (text.startsWith('/unlink')) {
      const user = userMap.get(tgId);
      if (!user) {
        try {
          await this.bot.sendMessage(tgId, LocalizationManager.getInstance().t('unlink.not_linked'));
        } catch (e) {
          console.error('Send error for not linked:', e);
        }
        return;
      }
      // Set state
      this.unlinkStates.set(tgId, { timestamp: Date.now() });
      try {
        await this.bot.sendMessage(tgId, LocalizationManager.getInstance().t('unlink.confirm'));
      } catch (e) {
        console.error('Send error for unlink confirm:', e);
      }
      return;
    }

    if (text.startsWith('/link')) {
      const parts = text.trim().split(/\s+/);
      if (parts.length === 3) {
        const [, phone, shortname] = parts;
        await this.handleLink(tgId, msg, phone, shortname);
      } else {
        try {
          await this.bot.sendMessage(tgId, LocalizationManager.getInstance().t('link.usage'));
        } catch (e) {
          console.error('Send error for usage:', e);
        }
      }
      return;
    }

    try {
      await this.bot.sendMessage(tgId, LocalizationManager.getInstance().t('unknown_command'));
    } catch (e) {
      console.error('Send error for unknown:', e);
    }
  }

   async handleLink(tgId, msg, phone, shortname) {
    shortname = shortname.trim().toLowerCase();
    const name = msg.from.first_name + (msg.from.last_name ? ' ' + msg.from.last_name : '');
    const tgUsername = msg.from.username;

    // Normalize phone: strip non-digits
    phone = phone.replace(/\D/g, '');

    console.log('Link attempt:', tgId, phone, shortname);

    // Validate phone
    if (!/^\d{10,15}$/.test(phone)) {
      console.log('Invalid phone');
      try {
        await this.bot.sendMessage(tgId, LocalizationManager.getInstance().t('link.invalid_phone'));
      } catch (e) {
        console.error('Send error for invalid phone:', e);
      }
      return;
    }

    // Validate shortname
    if (shortname.length > 9 || shortname.length < 1 || !/^[a-zA-Z0-9]+$/.test(shortname)) {
      console.log('Invalid shortname');
      try {
        await this.bot.sendMessage(tgId, LocalizationManager.getInstance().t('link.invalid_shortname'));
      } catch (e) {
        console.error('Send error for invalid shortname:', e);
      }
      return;
    }

    console.log('Validation passed');

    // Check uniqueness
    const userMap = require('../bridge/index').userMap;
    for (const [key, value] of userMap) {
      if (value.phoneNumber === phone) {
        try {
          await this.bot.sendMessage(tgId, LocalizationManager.getInstance().t('link.phone_taken'));
        } catch (e) {
          console.error('Send error for duplicate phone:', e);
        }
        return;
      }
      if (value.shortname === shortname) {
        try {
          await this.bot.sendMessage(tgId, LocalizationManager.getInstance().t('link.shortname_taken'));
        } catch (e) {
          console.error('Send error for duplicate shortname:', e);
        }
        return;
      }
    }

    // Store mappings
    userMap.set(tgId, {
      phoneNumber: phone,
      waId: null,
      name,
      shortname
    });

    console.log('Mappings stored');

    try {
      await this.bot.sendMessage(tgId, LocalizationManager.getInstance().t('link.success', { shortname }));
      console.log('Response sent');
    } catch (e) {
      console.error('Send error for success:', e);
    }
  }
  handleShortname(tgId, shortname) {
    const state = this.userStates.get(tgId);
    let finalShortname = null;
    if (shortname && shortname.toLowerCase() !== 'skip') {
      if (shortname.length > 9 || !/^[a-zA-Z0-9]+$/.test(shortname)) {
        this.bot.sendMessage(tgId, LocalizationManager.getInstance().t('link.invalid_shortname_retry'));
        return;
      }
      finalShortname = shortname;
    } else {
      // Fallback: crop name to 10 chars
      finalShortname = state.name.substring(0, 10);
    }

    // Store mappings
    const userMap = require('../bridge/index').userMap; // Access the map
    userMap.set(`whatsapp:${state.phone}`, {
      tgId,
      tgUsername: state.tgUsername || null,
      name: state.name,
      shortname: finalShortname
    });
    userMap.set(`telegram:${tgId}`, {
      waId: state.phone,
      name: state.name,
      shortname: finalShortname
    });

    this.userStates.delete(tgId);
    this.bot.sendMessage(tgId, LocalizationManager.getInstance().t('link.success', { shortname: finalShortname }));
  }
}

const telegramClient = new TelegramClient();

module.exports = { telegramClient };