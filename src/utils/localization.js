const fs = require('fs');
const path = require('path');

class LocalizationManager {
  constructor() {
    if (LocalizationManager.instance) {
      return LocalizationManager.instance;
    }
    this.translations = {};
    LocalizationManager.instance = this;
  }

  static getInstance() {
    if (!LocalizationManager.instance) {
      LocalizationManager.instance = new LocalizationManager();
    }
    return LocalizationManager.instance;
  }

  load(language) {
    const filePath = path.join(__dirname, '..', 'locales', `${language}.json`);
    try {
      if (fs.existsSync(filePath)) {
        this.translations = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      } else {
        // Fallback to English
        const enPath = path.join(__dirname, '..', 'locales', 'en.json');
        this.translations = JSON.parse(fs.readFileSync(enPath, 'utf8'));
      }
    } catch (error) {
      console.error('Error loading translations:', error);
      this.translations = {};
    }
  }

  t(key, vars = {}) {
    let text = this.translations[key] || `Missing translation: ${key}`;
    // Interpolate variables
    for (const [k, v] of Object.entries(vars)) {
      text = text.replace(new RegExp(`{{${k}}}`, 'g'), v);
    }
    return text;
  }
}

module.exports = LocalizationManager;