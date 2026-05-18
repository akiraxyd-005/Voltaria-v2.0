const fs = require('fs');
const settingsPath = './database/owner.json';

module.exports = {
    name: 'autorecording',
    category: 'owner',
    description: 'Toggle auto recording status',
    usage: '§autorecording on/off',
    isOwner: true,
    async execute(sock, msg, args, extra) {
        const action = args[0]?.toLowerCase();
        let settings = {};
        if (fs.existsSync(settingsPath)) settings = JSON.parse(fs.readFileSync(settingsPath));
        
        if (action === 'on') {
            settings.autorecording = true;
            fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
            await extra.reply('✅ *AutoRecording ENABLED*\nBot will show recording indicator before sending audio.');
        } else if (action === 'off') {
            settings.autorecording = false;
            fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
            await extra.reply('❌ *AutoRecording DISABLED*');
        } else {
            const status = settings.autorecording ? '✅ ENABLED' : '❌ DISABLED';
            await extra.reply(`📝 *AutoRecording Status*\n\nStatus: ${status}\n\n§autorecording on - Enable\n§autorecording off - Disable`);
        }
    }
};