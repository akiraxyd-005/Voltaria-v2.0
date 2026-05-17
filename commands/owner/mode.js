const fs = require('fs');
const settingsPath = './database/owner.json';

module.exports = {
    name: 'mode',
    category: 'owner',
    description: 'Set bot mode to public or private',
    usage: '§mode public/private',
    isOwner: true,
    async execute(sock, msg, args, extra) {
        const mode = args[0]?.toLowerCase();
        
        if (!mode || (mode !== 'public' && mode !== 'private')) {
            return extra.reply('❌ Usage: §mode public/private\n\n*Public:* Anyone can use commands\n*Private:* Only owner can use commands');
        }
        
        let settings = {};
        if (fs.existsSync(settingsPath)) settings = JSON.parse(fs.readFileSync(settingsPath));
        
        settings.mode = mode;
        fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
        
        await extra.reply(`✅ *Mode set to: ${mode.toUpperCase()}*\n\n${mode === 'public' ? 'Anyone can use commands' : 'Only owner can use commands'}`);
    }
};