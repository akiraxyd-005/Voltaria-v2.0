const fs = require('fs');
const settingsPath = './database/owner.json';

module.exports = {
    name: 'buttonmode',
    category: 'owner',
    description: 'Toggle Button Mode — wraps every reply in tap-to-run interactive buttons',
    usage: '§buttonmode on/off',
    isOwner: true,
    async execute(sock, msg, args, extra) {
        const action = args[0]?.toLowerCase();
        let settings = {};
        if (fs.existsSync(settingsPath)) settings = JSON.parse(fs.readFileSync(settingsPath));
        
        if (action === 'on') {
            settings.buttonmode = true;
            fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
            await extra.reply('✅ *Button Mode ENABLED*\nReplies will include interactive buttons.');
        } else if (action === 'off') {
            settings.buttonmode = false;
            fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
            await extra.reply('❌ *Button Mode DISABLED*');
        } else {
            const status = settings.buttonmode ? '✅ ENABLED' : '❌ DISABLED';
            await extra.reply(`📝 *Button Mode Status*\n\nStatus: ${status}\n\n§buttonmode on - Enable\n§buttonmode off - Disable`);
        }
    }
};