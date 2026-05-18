const fs = require('fs');
const settingsPath = './database/owner.json';

module.exports = {
    name: 'autotyping',
    category: 'owner',
    description: 'Toggle auto typing status',
    usage: '§autotyping on/off',
    isOwner: true,
    async execute(sock, msg, args, extra) {
        const action = args[0]?.toLowerCase();
        let settings = {};
        if (fs.existsSync(settingsPath)) settings = JSON.parse(fs.readFileSync(settingsPath));
        
        if (action === 'on') {
            settings.autotyping = true;
            fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
            await extra.reply('✅ *AutoTyping ENABLED*\nBot will show typing indicator before responding.');
        } else if (action === 'off') {
            settings.autotyping = false;
            fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
            await extra.reply('❌ *AutoTyping DISABLED*');
        } else {
            const status = settings.autotyping ? '✅ ENABLED' : '❌ DISABLED';
            await extra.reply(`📝 *AutoTyping Status*\n\nStatus: ${status}\n\n§autotyping on - Enable\n§autotyping off - Disable`);
        }
    }
};