# BridgeBOT

A Node.js application that bridges messages between WhatsApp and Telegram groups, sharing media and maintaining functionality.

## Features
- Bidirectional message forwarding
- Media support (images, documents, videos)
- Reply and mention preservation
- Cross-platform mentions with user linking
- Queue-based processing for robustness
- Persistent mappings for continuity
- Separate setup for WhatsApp authentication
- Logging and error handling
- Multilingual support (14 languages: English, Spanish, French, German, Italian, Portuguese, Russian, Chinese, Japanese, Korean, Arabic, Hindi, Bengali, Turkish, Vietnamese)

## Setup
See `docs/SETUP.md` for detailed setup instructions, including how to create your Telegram bot with @BotFather.

## User Guides
- `docs/LINKING_GUIDE.md`: How to link accounts for cross-platform mentions.

### Setup
1. Clone repo
2. `npm install`
3. Copy `.env.example` to `.env` and fill in values
4. Set up WhatsApp: `npm run setup` (scan QR)
5. `npm start`

## Environment Variables
- `WHATSAPP_GROUP_ID`: Group ID (e.g., `120363123456789012@g.us`)
- `TELEGRAM_BOT_TOKEN`: Bot token
- `TELEGRAM_GROUP_ID`: Group ID (e.g., `-1001234567890`)
- `PORT`: Server port (default: 3000)
- `LOG_LEVEL`: Logging level (default: info)
- `LANGUAGE`: Localization language (default: 'en')

## Usage
- `npm start`: Run the bridge server
- `npm run dev`: Development mode with nodemon
- `npm run setup`: Authenticate WhatsApp client
- `npm test`: Run tests
- `npm run lint`: Lint code

## Architecture
See `docs/REPORT.md` for detailed analysis, features, issues, and recommendations.

## Contributing
Report issues or suggest features via GitHub.