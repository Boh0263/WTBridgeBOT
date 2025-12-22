# Docker Setup Tutorial for BridgeBOT

This guide walks you through setting up and running BridgeBOT in a Docker container for production use. The setup ensures data persistence, security, and easy deployment.

## Prerequisites

- Docker and Docker Compose installed on your system
- Node.js 18+ (for local setup steps)
- A Telegram bot token (from [@BotFather](https://t.me/botfather))
- WhatsApp account for authentication

## Step 1: Clone and Prepare the Repository

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd BridgeBOT
   ```

2. Create environment file:
   ```bash
   cp .env.example .env
   ```

3. Edit `.env` with your values:
   ```env
   WHATSAPP_GROUP_ID=your-whatsapp-group-id@g.us
   TELEGRAM_BOT_TOKEN=your-telegram-bot-token
   TELEGRAM_GROUP_ID=your-telegram-group-id
   LANGUAGE=en  # or 'it' for Italian
   PORT=3000
   LOG_LEVEL=info
   ```

## Step 2: WhatsApp Authentication (Host Setup)

WhatsApp authentication requires QR code scanning, so we do this on the host machine first:

1. Install dependencies (if not using Docker for setup):
   ```bash
   npm install
   ```

2. Run setup with custom auth directory:
   ```bash
   WA_AUTH_DIR=./sessions npm run setup
   ```

3. Scan the QR code with WhatsApp on your phone.

4. Wait for "Setup completed" message. Auth data is saved to `./sessions/`.

## Step 3: Prepare Data Directories

Create directories for persistent data:

```bash
mkdir -p data/bridge data/locales logs sessions
chmod -R 775 data logs sessions
```

**Important**: The `775` permissions allow the container user to write to these directories. If you encounter permission issues, ensure your user owns these directories or adjust as needed for your system.

Copy existing data if migrating from local setup:
```bash
cp src/bridge/*.json data/bridge/ 2>/dev/null || true
cp src/locales/*.json data/locales/ 2>/dev/null || true
cp -r .wwebjs_auth/* sessions/ 2>/dev/null || true
```

## Step 4: Build and Run with Docker Compose

1. Build and start the container:
   ```bash
   docker-compose up --build -d
   ```

2. Check if it's running:
   ```bash
   docker-compose ps
   ```

3. View logs:
   ```bash
   docker-compose logs -f bridgebot
   ```

4. Check health:
   ```bash
   curl http://localhost:3000/health
   ```

## Step 5: Verify Functionality

1. Send a message in your WhatsApp group - it should appear in Telegram.
2. Send a message in Telegram - it should appear in WhatsApp.
3. Test media sharing (images, documents).
4. Test mentions if users are linked.

## Docker Commands Reference

- **Start**: `docker-compose up -d`
- **Stop**: `docker-compose down`
- **Rebuild**: `docker-compose up --build -d`
- **View logs**: `docker-compose logs -f`
- **Enter container**: `docker-compose exec bridgebot sh`
- **Update**: `git pull && docker-compose up --build -d`

## Troubleshooting

### Container Won't Start
- Check logs: `docker-compose logs`
- Ensure `.env` is correct
- Verify WhatsApp auth in `./sessions/`
- **Permission Issues**: If "permission denied" errors for logs, run `sudo chown -R $USER:$USER data logs sessions` and `chmod -R 775 data logs sessions`

### Messages Not Forwarding
- Check group IDs in `.env`
- Ensure bot is added to both groups
- Verify permissions (admin in Telegram)

### Data Not Persisting
- Check `./data/bridge/userMappings.json` exists and updates
- Ensure directories have correct permissions

### WhatsApp Re-Authentication Needed
- Delete `./sessions/` and re-run setup
- Then rebuild: `docker-compose down && docker-compose up --build -d`

### Permission Issues
- On Linux: `sudo chown -R $USER:$USER data logs sessions`
- Ensure Docker has access to these directories

### High Resource Usage
- Puppeteer uses ~1GB RAM; limit with `docker-compose.yml` adjustments
- Monitor with `docker stats`

## Production Deployment

For production servers:

1. Use a reverse proxy (Nginx) for SSL:
   ```nginx
   server {
       listen 443 ssl;
       server_name your-domain.com;
       location / {
           proxy_pass http://localhost:3000;
           proxy_set_header Host $host;
       }
   }
   ```

2. Set up monitoring (PM2 logs are in `./logs/`).

3. Use Docker secrets for sensitive env vars.

4. Schedule backups of `./data/`.

## Updating the Application

1. Pull latest changes: `git pull`
2. Rebuild: `docker-compose up --build -d`
3. Check logs for errors.

## Architecture Overview

- **Container**: Node.js app with Chromium for WhatsApp Web.js
- **Volumes**: Persistent data mounted from host
- **PM2**: Process manager inside container
- **Health Checks**: `/health` endpoint for monitoring
- **User**: Non-root (1001) for security

## Support

If you encounter issues:
1. Check logs: `docker-compose logs -f`
2. Verify `.env` configuration
3. Ensure WhatsApp is authenticated
4. Report issues with full error logs

The setup is now production-ready with proper isolation and persistence!