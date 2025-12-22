const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const config = require('./src/config');

const fs = require('fs');

async function setupWhatsApp() {
  const client = new Client({
    authStrategy: new LocalAuth({
      clientId: 'whatsapp-session',
      dataPath: process.env.WA_AUTH_DIR || '.wwebjs_auth'
    }),
    puppeteer: {
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    },
  });

  client.on('qr', qr => {
    console.log('QR code for WhatsApp client:');
    qrcode.generate(qr, { small: true });
  });

  client.on('ready', () => {
    console.log('WhatsApp client is ready! Authentication completed and saved.');
    setTimeout(() => {
      client.destroy().then(() => {
        console.log('Setup completed. You can now run the server.');
        process.exit(0);
      });
    }, 2000); // Wait 2 seconds to ensure auth is saved
  });

  client.on('auth_failure', msg => {
    console.error('Authentication failed for WhatsApp:', msg);
    process.exit(1);
  });

  await client.initialize();
}

setupWhatsApp();