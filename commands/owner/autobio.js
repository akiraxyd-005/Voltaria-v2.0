const fs = require('fs');
const settingsPath = './database/owner.json';

module.exports = {
    name: 'autobio',
    category: 'owner',
    description: 'Toggle automatic bio updates (time or quote)',
    usage: '§autobio on/off',
    isOwner: true,
    async execute(sock, msg, args, extra) {
        const action = args[0]?.toLowerCase();
        let settings = {};
        if (fs.existsSync(settingsPath)) settings = JSON.parse(fs.readFileSync(settingsPath));
        
        if (action === 'on') {
            settings.autobio = true;
            fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
            await extra.reply('✅ *AutoBio ENABLED*\nBot will update bio every hour with time/stats.');
            
            // Start interval
            setInterval(async () => {
                if (settings.autobio) {
                    const now = new Date();
                    const time = now.toLocaleTimeString();
                    await sock.updateProfileStatus(`Voltaria | ${time}`);
                }
            }, 3600000);
        } else if (action === 'off') {
            settings.autobio = false;
            fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
            await extra.reply('❌ *AutoBio DISABLED*');
        } else {
            const status = settings.autobio ? '✅ ENABLED' : '❌ DISABLED';
            await extra.reply(`📝 *AutoBio Status*\n\nStatus: ${status}\n\n§autobio on - Enable\n§autobio off - Disable`);
        }
    }
};