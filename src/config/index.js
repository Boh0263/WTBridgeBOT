require('dotenv').config();

const config = {
  whatsapp: {
    session: process.env.WHATSAPP_SESSION || './sessions/whatsapp',
    groupId: process.env.WHATSAPP_GROUP_ID,
  },
  telegram: {
    botToken: process.env.TELEGRAM_BOT_TOKEN,
    groupId: process.env.TELEGRAM_GROUP_ID,
  },
  server: {
    port: process.env.PORT || 3000,
  },
  logging: {
    level: process.env.LOG_LEVEL || 'info',
  },
};

function validateConfig() {
  const required = [
    'WHATSAPP_LISTEN_SESSION',
    'WHATSAPP_WRITE_SESSION',
    'WHATSAPP_GROUP_ID',
    'TELEGRAM_LISTEN_BOT_TOKEN',
    'TELEGRAM_WRITE_BOT_TOKEN',
    'TELEGRAM_GROUP_ID',
  ];
  for (const key of required) {
    if (!process.env[key]) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
  }
}

validateConfig();

module.exports = config;