const fs = require('fs');
const settingsPath = './database/owner.json';

module.exports = {
    name: 'autolike',
    category: 'owner',
    description: 'Toggle or check auto react (like) to statuses',
    usage: '§autolike on/off',
    isOwner: true,
    async execute(sock, msg, args, extra) {
        const action = args[0]?.toLowerCase();
        let settings = {};
        if (fs.existsSync(settingsPath)) settings = JSON.parse(fs.readFileSync(settingsPath));
        
        if (action === 'on') {
            settings.autolike = true;
            fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
            await extra.reply('✅ *AutoLike ENABLED*\nBot will like status updates automatically.');
        } else if (action === 'off') {
            settings.autolike = false;
            fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
            await extra.reply('❌ *AutoLike DISABLED*');
        } else {
            const status = settings.autolike ? '✅ ENABLED' : '❌ DISABLED';
            await extra.reply(`📝 *AutoLike Status*\n\nStatus: ${status}\n\n§autolike on - Enable\n§autolike off - Disable`);
        }
    }
};