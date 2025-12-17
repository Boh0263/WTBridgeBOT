# Easy Setup Guide for BridgeBOT

Follow these simple steps to get your WhatsApp-Telegram bridge running. No coding experience needed!

## Step 1: Get Your Computer Ready
- Download and install [Node.js](https://nodejs.org/) (version 16 or higher).
- Open a terminal/command prompt.

## Step 2: Download the Project
- Clone or download the BridgeBOT code to your computer.
- Open the project folder in terminal: `cd path/to/BridgeBOT`

## Step 3: Install Stuff
- Run: `npm install`
- Wait for it to finish (may take a few minutes).

## Step 4: Set Up Your Secrets
- Copy the example file: `cp .env.example .env`
- Open `.env` in a text editor.
- Fill in:
  - `WHATSAPP_GROUP_ID`: Your WhatsApp group ID (ask admin or find online).
  - `TELEGRAM_BOT_TOKEN`: Get from @BotFather on Telegram (type `/newbot`, follow steps).
  - `TELEGRAM_GROUP_ID`: Your Telegram group ID (add bot to group, check bot logs or use @userinfobot).
- Leave other lines as is (they have defaults).

## Step 5: Set Up WhatsApp
- Run: `npm run setup`
- A QR code will appear in the terminal.
- Open WhatsApp on your phone, go to Settings > Linked Devices > Link a Device.
- Scan the QR code with your phone's camera.
- Wait for "WhatsApp client is ready! Session saved." message.
- Close the setup.

## Step 6: Start the Bridge
- Run: `npm start`
- If it says session not found, repeat Step 5.
- The bridge is now running! Messages in one group will appear in the other.

## Step 7: Test It
- Send a message in WhatsApp group.
- Check if it shows in Telegram group.
- Send a reply or media to test.

## Troubleshooting
- **QR not scanning?** Make sure phone and computer are on same network.
- **Bot not responding?** Check group IDs and bot permissions.
- **Errors?** Check `.env` for typos. Run `npm run lint` for code issues.
- **Still stuck?** Check logs in terminal or `logs/` folder.

## Stop the Bridge
- Press Ctrl+C in terminal.

That's it! Your groups are now connected. 🎉