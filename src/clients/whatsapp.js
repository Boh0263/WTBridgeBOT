const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const config = require('../config');

class WhatsAppClient {
  constructor() {
    this.client = new Client({
      authStrategy: new LocalAuth({
        clientId: 'whatsapp-session'
      }),
      puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      },
    });

    this.client.on('qr', qr => {
      console.log('QR code for WhatsApp client:');
      qrcode.generate(qr, { small: true });
    });

    this.client.on('ready', () => {
      console.log('WhatsApp client is ready!');
    });

    this.client.on('message', async msg => {
      if (msg.fromMe) return; // Ignore own messages to prevent loops
      if (msg.from === config.whatsapp.groupId) {
        if (this.messageCallback) this.messageCallback(msg);
      } else {
        if (this.privateCallback) this.privateCallback(msg);
      }
    });
  }

  async initialize() {
    await this.client.initialize();
  }

  async sendMessage(chatId, text, media = null, options = {}) {
    const chat = await this.client.getChatById(chatId);
    const msgOptions = {};
    if (options.quotedMessageId) {
      msgOptions.quotedMessageId = options.quotedMessageId;
    }
    let sent;
    if (media) {
      sent = await chat.sendMessage(media, { caption: text, ...msgOptions });
    } else {
      sent = await chat.sendMessage(text, msgOptions);
    }
    return { id: sent.id };
  }

   onMessage(callback) {
     this.messageCallback = callback;
   }

   onPrivateMessage(callback) {
     this.privateCallback = callback;
   }

  async downloadMedia(msg) {
    if (!msg.hasMedia) return null;
    const media = await msg.downloadMedia();
    return media;
  }
}

const whatsappClient = new WhatsAppClient();

module.exports = { whatsappClient };