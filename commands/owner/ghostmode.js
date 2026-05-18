const fs = require('fs');
const settingsPath = './database/owner.json';

module.exports = {
    name: 'ghostmode',
    category: 'owner',
    description: 'Toggle ghost mode (hide online status / show last seen)',
    usage: '§ghostmode on/off',
    isOwner: true,
    async execute(sock, msg, args, extra) {
        const action = args[0]?.toLowerCase();
        let settings = {};
        if (fs.existsSync(settingsPath)) settings = JSON.parse(fs.readFileSync(settingsPath));
        
        if (action === 'on') {
            settings.ghostmode = true;
            fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
            await sock.updatePresence('unavailable');
            await extra.reply('👻 *Ghost Mode ENABLED*\nOnline status hidden. Last seen will be shown.');
        } else if (action === 'off') {
            settings.ghostmode = false;
            fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
            await sock.updatePresence('available');
            await extra.reply('👁️ *Ghost Mode DISABLED*\nOnline status visible.');
        } else {
            const status = settings.ghostmode ? '✅ ENABLED' : '❌ DISABLED';
            await extra.reply(`📝 *Ghost Mode*\n\nStatus: ${status}\n\n§ghostmode on - Hide online status\n§ghostmode off - Show online status`);
        }
    }
};