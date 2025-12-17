const logger = require('./logger');

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

function handleError(error, context = '') {
  logger.error(`Error in ${context}:`, error);
  // Optionally, send notification or restart
}

module.exports = { handleError };