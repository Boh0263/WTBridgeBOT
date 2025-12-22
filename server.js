require('dotenv').config({ path: __dirname + '/.env', override: true });
const express = require('express');
const { initializeBridge } = require('./src/bridge');
const logger = require('./src/utils/logger');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Ensure sessions directory exists
const sessionsDir = path.resolve('./sessions');
if (!fs.existsSync(sessionsDir)) {
  fs.mkdirSync(sessionsDir, { recursive: true });
}

// Check if WhatsApp auth data exists
const config = require('./src/config');
const LocalizationManager = require('./src/utils/localization');
const whatsappAuthDir = './.wwebjs_auth';
console.log('Checking WhatsApp auth at:', whatsappAuthDir);

if (!fs.existsSync(whatsappAuthDir)) {
  console.error('WhatsApp authentication not found. Run "npm run setup" to authenticate first.');
  process.exit(1);
}

// Initialize localization
LocalizationManager.getInstance().load(config.language);
logger.info(`Language loaded: ${config.language}`);

async function startServer() {
  try {
    await initializeBridge();
    logger.info('Bridge initialized successfully');

    app.get('/', (req, res) => {
      res.send('BridgeBOT is running');
    });

    app.get('/health', (req, res) => {
      res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
    });

    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();