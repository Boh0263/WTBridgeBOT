const TelegramBot = require('node-telegram-bot-api');
const config = require('../config');
const logger = require('../utils/logger');

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
          await this.bot.sendMessage(tgId, 'Unlinked successfully.');
        } catch (e) {
          console.error('Send error for unlink success:', e);
        }
      } else {
        try {
          await this.bot.sendMessage(tgId, 'No pending unlink confirmation or expired.');
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
          await this.bot.sendMessage(tgId, 'You are not linked.');
        } catch (e) {
          console.error('Send error for not linked:', e);
        }
        return;
      }
      // Set state
      this.unlinkStates.set(tgId, { timestamp: Date.now() });
      try {
        await this.bot.sendMessage(tgId, 'Are you sure you want to unlink? Reply "yes" to confirm within 30 seconds.');
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
          await this.bot.sendMessage(tgId, 'Usage: /link <phone> <shortname>\nExample: /link 1234567890 myname');
        } catch (e) {
          console.error('Send error for usage:', e);
        }
      }
      return;
    }

    try {
      await this.bot.sendMessage(tgId, 'Unknown command. Use /link <phone> <shortname> to link or /unlink to unlink.');
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
        await this.bot.sendMessage(tgId, 'Invalid phone number. Use digits only, 10-15 characters.');
      } catch (e) {
        console.error('Send error for invalid phone:', e);
      }
      return;
    }

    // Validate shortname
    if (shortname.length > 9 || shortname.length < 1 || !/^[a-zA-Z0-9]+$/.test(shortname)) {
      console.log('Invalid shortname');
      try {
        await this.bot.sendMessage(tgId, 'Invalid shortname. Use 1-9 alphanumeric characters.');
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
          await this.bot.sendMessage(tgId, 'Phone number already linked. Use /unlink to unlink first.');
        } catch (e) {
          console.error('Send error for duplicate phone:', e);
        }
        return;
      }
      if (value.shortname === shortname) {
        try {
          await this.bot.sendMessage(tgId, 'Shortname already in use. Choose a different one or use /unlink to unlink.');
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
      await this.bot.sendMessage(tgId, `Linked! Your shortname: ${shortname}`);
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
        this.bot.sendMessage(tgId, 'Invalid shortname. Use 1-9 alphanumeric chars, or reply "skip".');
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
    this.bot.sendMessage(tgId, `Linked! Your shortname: ${finalShortname}`);
  }
}

const telegramClient = new TelegramClient();

module.exports = { telegramClient };