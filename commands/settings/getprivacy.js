module.exports = {
    name: 'getprivacy',
    category: 'settings',
    description: 'View the current WhatsApp privacy settings of the bot number',
    usage: '§getprivacy',
    isOwner: true,
    async execute(sock, msg, args, extra) {
        try {
            // Get privacy settings from WhatsApp
            const privacySettings = await sock.fetchPrivacySettings();
            
            const settingsInfo = `┏━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  🔒 *PRIVACY SETTINGS*
┗━━━━━━━━━━━━━━━━━━━━━━━━┛

👤 *Last Seen:* ${privacySettings.lastseen || 'Everyone'}
📸 *Profile Photo:* ${privacySettings.profilepicture || 'Everyone'}
📝 *About:* ${privacySettings.about || 'Everyone'}
📞 *Status:* ${privacySettings.status || 'Everyone'}
📱 *Read Receipts:* ${privacySettings.readreceipts ? 'On' : 'Off'}
👥 *Groups:* ${privacySettings.groups || 'Everyone'}

━━━━━━━━━━━━━━━━━━━━━━━━━━
> ©𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 𝙽£𝚇𝚄$`;
            
            await extra.reply(settingsInfo);
        } catch (error) {
            await extra.reply('❌ Failed to fetch privacy settings.');
        }
    }
};