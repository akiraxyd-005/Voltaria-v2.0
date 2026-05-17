const fs = require('fs');
const settingsPath = './database/owner.json';

module.exports = {
    name: 'autoreact',
    category: 'owner',
    description: 'Toggle automatic reactions or set custom emojis',
    usage: '§autoreact on/off | §autoreact set 👍,❤️,😂',
    isOwner: true,
    async execute(sock, msg, args, extra) {
        const action = args[0]?.toLowerCase();
        let settings = {};
        if (fs.existsSync(settingsPath)) settings = JSON.parse(fs.readFileSync(settingsPath));
        
        if (action === 'on') {
            settings.autoreact = true;
            fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
            await extra.reply('✅ *AutoReact ENABLED*\nBot will react to messages randomly.');
        } else if (action === 'off') {
            settings.autoreact = false;
            fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
            await extra.reply('❌ *AutoReact DISABLED*');
        } else if (action === 'set') {
            const emojis = args.slice(1).join('').split(',');
            settings.reactEmojis = emojis;
            fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
            await extra.reply(`✅ *Custom emojis set:* ${emojis.join(', ')}`);
        } else {
            const status = settings.autoreact ? '✅ ENABLED' : '❌ DISABLED';
            await extra.reply(`📝 *AutoReact Status*\n\nStatus: ${status}\nEmojis: ${settings.reactEmojis?.join(', ') || '👍,❤️,😂'}\n\n§autoreact on/off - Toggle\n§autoreact set 👍,❤️ - Set emojis`);
        }
    }
};