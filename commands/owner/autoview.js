const fs = require('fs');
const settingsPath = './database/owner.json';

module.exports = {
    name: 'autoview',
    category: 'owner',
    description: 'Toggle or check auto view status mode',
    usage: '§autoview on/off',
    isOwner: true,
    async execute(sock, msg, args, extra) {
        const action = args[0]?.toLowerCase();
        let settings = {};
        if (fs.existsSync(settingsPath)) settings = JSON.parse(fs.readFileSync(settingsPath));
        
        if (action === 'on') {
            settings.autoview = true;
            fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
            await extra.reply('✅ *AutoView ENABLED*\nBot will automatically view status updates.');
        } else if (action === 'off') {
            settings.autoview = false;
            fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
            await extra.reply('❌ *AutoView DISABLED*');
        } else {
            const status = settings.autoview ? '✅ ENABLED' : '❌ DISABLED';
            await extra.reply(`📝 *AutoView Status*\n\nStatus: ${status}\n\n§autoview on - Enable\n§autoview off - Disable`);
        }
    }
};