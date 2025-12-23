# Easy Setup Guide for BridgeBOT

⚠️ **IMPORTANT: Before proceeding, read the [Disclaimer](../DISCLAIMER.md). You use BridgeBOT at your own risk.**

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
   - `TELEGRAM_BOT_TOKEN`: Get from @BotFather on Telegram. Follow this detailed guide:

     ### Creating Your Telegram Bot
     1. Open Telegram and search for **@BotFather** (the official bot for creating bots).
     2. Start a chat with @BotFather and send `/newbot`.
     3. Follow the prompts:
        - Enter a name for your bot (e.g., "My Bridge Bot").
        - Enter a username (must end with "bot", e.g., "mybridgebot").
     4. @BotFather will provide your **bot token** (save this securely - it's like a password).
     5. Copy the token to your `.env` file as `TELEGRAM_BOT_TOKEN`.

     ### Important Bot Settings
     After creating the bot:
     1. Send `/setprivacy` to @BotFather.
     2. Select your bot and choose **Disable** (turns off privacy mode).
        - This allows the bot to read ALL messages in groups, not just commands/mentions.
        - Required for the bridge to work properly.

     ### Optional: Register Bot Commands
     To make your bot's commands appear in Telegram's interface:
     1. Send `/setcommands` to @BotFather.
     2. Select your bot.
     3. Send the command list (one per line):
        ```
        link - Link your Telegram account with WhatsApp
        unlink - Unlink your accounts
        ```
     4. This adds a menu button in chats with your bot.

     For more details, see the official guide: https://core.telegram.org/bots#creating-a-new-bot
     And BotFather commands: https://core.telegram.org/bots/features#botfather
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
- For advanced features like cross-platform mentions, see `docs/guides/linking/` for your language.

## Troubleshooting
- **QR not scanning?** Make sure phone and computer are on same network.
- **Bot not responding?** Check group IDs and bot permissions.
- **Errors?** Check `.env` for typos. Run `npm run lint` for code issues.
- **Still stuck?** Check logs in terminal or `logs/` folder.

## Stop the Bridge
- Press Ctrl+C in terminal.

That's it! Your groups are now connected. 🎉