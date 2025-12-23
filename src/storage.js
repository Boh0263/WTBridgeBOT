const fs = require('fs');
const path = require('path');
const logger = require('./utils/logger');

const DATA_DIR = path.join(__dirname, '..', 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const MAPPINGS_FILE = path.join(DATA_DIR, 'message_mappings.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// In-memory data structures
let users = {}; // key: telegram_id (string), value: user object
let messageMappings = {}; // key: 'platform:id', value: { otherPlatform: 'id', timestamp }

function loadData() {
  try {
    if (fs.existsSync(USERS_FILE)) {
      const data = fs.readFileSync(USERS_FILE, 'utf8');
      users = JSON.parse(data);
    } else {
      users = {};
    }

    if (fs.existsSync(MAPPINGS_FILE)) {
      const data = fs.readFileSync(MAPPINGS_FILE, 'utf8');
      messageMappings = JSON.parse(data);
    } else {
      messageMappings = {};
    }
  } catch (error) {
    logger.error('Error loading data:', error);
    // Initialize empty if load fails
    users = {};
    messageMappings = {};
  }
}

function saveData() {
  try {
    // Atomic write for users
    const usersTemp = path.join(DATA_DIR, 'users.tmp.json');
    fs.writeFileSync(usersTemp, JSON.stringify(users, null, 2));
    fs.renameSync(usersTemp, USERS_FILE);

    // Atomic write for mappings
    const mappingsTemp = path.join(DATA_DIR, 'message_mappings.tmp.json');
    fs.writeFileSync(mappingsTemp, JSON.stringify(messageMappings, null, 2));
    fs.renameSync(mappingsTemp, MAPPINGS_FILE);
  } catch (error) {
    logger.error('Error saving data:', error);
    throw error; // Re-throw to handle in caller
  }
}

// User operations
function getUser(telegramId) {
  return users[telegramId.toString()];
}

function setUser(telegramId, userData) {
  const id = telegramId.toString();
  userData.metadata = userData.metadata || {};
  userData.metadata.updated_at = Date.now();
  users[id] = userData;
}

function deleteUser(telegramId) {
  const id = telegramId.toString();
  delete users[id];
}

function findUserByShortname(shortname) {
  for (const [id, user] of Object.entries(users)) {
    if (user.telegram && user.telegram.shortname === shortname) {
      return { id, user };
    }
  }
  return null;
}

function findUserByPhone(phone) {
  for (const [id, user] of Object.entries(users)) {
    if (user.whatsapp && user.whatsapp.phone_number === phone) {
      return { id, user };
    }
  }
  return null;
}

function findUserByUsername(username) {
  for (const [id, user] of Object.entries(users)) {
    if (user.telegram && user.telegram.username === username) {
      return { id, user };
    }
  }
  return null;
}

function findUserByWaId(waId) {
  for (const [id, user] of Object.entries(users)) {
    if (user.whatsapp && user.whatsapp.wa_id === waId) {
      return { id, user };
    }
  }
  return null;
}

// Message mapping operations
function getMessageMapping(key) {
  return messageMappings[key];
}

function setMessageMapping(key, mapping) {
  messageMappings[key] = mapping;
}

function deleteMessageMapping(key) {
  delete messageMappings[key];
}

function cleanupOldMappings() {
  const now = Date.now();
  const cutoff = 7 * 24 * 60 * 60 * 1000; // 7 days
  for (const [key, mapping] of Object.entries(messageMappings)) {
    if (now - mapping.timestamp > cutoff) {
      delete messageMappings[key];
    }
  }
}

// Initialize
loadData();

// Periodic save and cleanup
setInterval(() => {
  saveData();
  cleanupOldMappings();
}, 60 * 1000); // Every minute

setInterval(cleanupOldMappings, 60 * 60 * 1000); // Every hour

module.exports = {
  loadData,
  saveData,
  getUser,
  setUser,
  deleteUser,
  findUserByShortname,
  findUserByPhone,
  findUserByWaId,
  findUserByUsername,
  getMessageMapping,
  setMessageMapping,
  deleteMessageMapping,
  cleanupOldMappings
};