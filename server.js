require('dotenv').config();
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
const whatsappAuthDir = './.wwebjs_auth';
console.log('Checking WhatsApp auth at:', whatsappAuthDir);

if (!fs.existsSync(whatsappAuthDir)) {
  console.error('WhatsApp authentication not found. Run "npm run setup" to authenticate first.');
  process.exit(1);
}

async function startServer() {
  try {
    await initializeBridge();
    logger.info('Bridge initialized successfully');

    app.get('/', (req, res) => {
      res.send('BridgeBOT is running');
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