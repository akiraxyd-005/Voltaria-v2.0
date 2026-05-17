const fs = require('fs');
const settingsPath = './database/owner.json';

module.exports = {
    name: 'slowmode',
    category: 'owner',
    description: 'Toggle slowmode on/off - adds 5s delay between commands',
    usage: '§slowmode on/off',
    isOwner: true,
    async execute(sock, msg, args, extra) {
        const action = args[0]?.toLowerCase();
        let settings = {};
        if (fs.existsSync(settingsPath)) settings = JSON.parse(fs.readFileSync(settingsPath));
        
        if (action === 'on') {
            settings.slowmode = true;
            fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
            await extra.reply('✅ *Slowmode ENABLED*\n5 second delay added between commands.');
        } else if (action === 'off') {
            settings.slowmode = false;
            fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
            await extra.reply('❌ *Slowmode DISABLED*');
        } else {
            const status = settings.slowmode ? '✅ ENABLED' : '❌ DISABLED';
            await extra.reply(`📝 *Slowmode Status*\n\nStatus: ${status}\n\n§slowmode on - Enable\n§slowmode off - Disable`);
        }
    }
};