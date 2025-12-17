require('dotenv').config();

const path = require('path');

const config = {
  whatsapp: {
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
    'WHATSAPP_GROUP_ID',
    'TELEGRAM_BOT_TOKEN',
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