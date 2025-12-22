# How to Link Your WhatsApp and Telegram Accounts

This guide explains how to link your WhatsApp and Telegram accounts so that mentions (@tags) work across both platforms. Once linked, tagging someone in one platform will notify them in the other!

## Prerequisites

- BridgeBOT is running and bridging your WhatsApp and Telegram groups.
- You have accounts in both groups.
- Your shortname is set (see below).

## Step 1: Set Your Shortname in Telegram

First, choose a unique shortname (1-9 alphanumeric characters, no spaces).

1. Go to your Telegram group.
2. Send: `/link <your-phone-number> <shortname>`
   - Example: `/link 1234567890 john`
   - Phone number: Include country code, no + or spaces.
3. The bot will reply with confirmation or errors.

Your shortname is now linked to your Telegram account.

## Step 2: Link from WhatsApp

1. In your WhatsApp group, send: `!iam <shortname>`
   - Use the same shortname from Step 1.
   - Example: `!iam john`

2. The bot will send a private message to your Telegram account asking for confirmation.

3. In Telegram (private chat with the bot), reply: `yes`
   - This must be done within 30 seconds.

4. You'll receive confirmation messages in both apps.

## Step 3: Test the Linking

- Send a message in WhatsApp tagging someone: `@their-shortname`
- It should appear in Telegram with a proper @mention.
- Send a message in Telegram tagging someone: `@their-username`
- It should appear in WhatsApp with their name.

## Troubleshooting

### "No matching Telegram user found"
- Ensure your shortname is correct and unique.
- Check that the Telegram user has set their shortname with `/link`.

### "Confirmation expired"
- The 30-second window passed. Try `!iam <shortname>` again.

### "Phone number already linked"
- Someone else used that number. Use `/unlink` first if needed.

### Mentions not working
- Ensure both users are linked.
- Check bot logs for errors.
- Restart the bot if mappings aren't loading.

### Commands Not Working
- Make sure you're sending commands in the correct places:
  - `/link` and `yes`: In Telegram private chat with bot.
  - `!iam`: In WhatsApp group.

## Managing Your Link

- **Check status**: No direct command, but test with mentions.
- **Unlink**: Send `/unlink` in Telegram private chat, then reply `yes` to confirm.
- **Change shortname**: Unlink first, then link with new shortname.

## Tips

- **Shortname rules**: 1-9 characters, letters and numbers only.
- **Phone format**: 10-15 digits, no symbols (e.g., 1234567890 for US).
- **Privacy**: Linking is required for cross-platform mentions to work.
- **Group admins**: Ensure the bot has permissions to read messages.

## Support

If you encounter issues:
1. Double-check all steps.
2. Verify bot is online: Check if messages are forwarding.
3. Contact group admins or check bot logs.

Now you can seamlessly mention friends across platforms! 🎉