# BridgeBOT

A Node.js application that bridges messages between WhatsApp and Telegram groups, sharing media and maintaining functionality.

## Features
- Bidirectional message forwarding
- Media support (images, documents, videos)
- Reply and mention preservation
- Queue-based processing for robustness
- Persistent mappings for continuity
- Separate setup for WhatsApp authentication
- Logging and error handling

## Quick Setup
See `docs/SETUP.md` for local setup or `docs/DOCKER_SETUP.md` for Docker deployment.

### Local Setup
1. Clone repo
2. `npm install`
3. Copy `.env.example` to `.env` and fill in values
4. Set up WhatsApp: `npm run setup` (scan QR)
5. `npm start`

### Docker Setup
1. Clone repo
2. Copy `.env.example` to `.env` and fill in values
3. Authenticate WhatsApp: `WA_AUTH_DIR=./sessions npm run setup` (scan QR; saves to `./sessions/`)
4. `docker-compose up --build -d`
5. Check logs: `docker-compose logs -f`

## Environment Variables
- `WHATSAPP_GROUP_ID`: Group ID (e.g., `120363123456789012@g.us`)
- `TELEGRAM_BOT_TOKEN`: Bot token
- `TELEGRAM_GROUP_ID`: Group ID (e.g., `-1001234567890`)
- `PORT`: Server port (default: 3000)
- `LOG_LEVEL`: Logging level (default: info)
- `LANGUAGE`: Localization language (default: 'en')

## Usage
### Local
- `npm start`: Run the bridge server
- `npm run dev`: Development mode with nodemon
- `npm run setup`: Authenticate WhatsApp client
- `npm test`: Run tests
- `npm run lint`: Lint code

### Docker
- `docker-compose up --build`: Build and run the container
- `docker-compose logs -f`: View logs
- `docker-compose down`: Stop and remove container
- For setup: `WA_AUTH_DIR=./sessions npm run setup` (run on host to scan QR)

## Architecture
See `docs/REPORT.md` for detailed analysis, features, issues, and recommendations.

## Contributing
Report issues or suggest features via GitHub.