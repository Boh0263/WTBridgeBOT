const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const config = require('./src/config');

async function setupWhatsApp() {
  const client = new Client({
    session: config.whatsapp.session,
  });

  client.on('qr', qr => {
    console.log('QR code for WhatsApp client:');
    qrcode.generate(qr, { small: true });
  });

  client.on('ready', () => {
    console.log('WhatsApp client is ready! Session saved.');
    process.exit(0);
  });

  client.on('auth_failure', msg => {
    console.error('Authentication failed for WhatsApp:', msg);
    process.exit(1);
  });

  await client.initialize();
}

setupWhatsApp();

const clientType = process.argv[2];
if (clientType === 'listen' || clientType === 'write') {
  setupWhatsApp(clientType);
} else {
  console.log('Usage: node setup.js listen  # or write');
}