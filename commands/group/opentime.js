const fs = require('fs');
const schedulePath = './database/schedules.json';

module.exports = {
    name: 'opentime',
    category: 'group',
    description: 'Auto-open group after a duration (admins only)',
    isGroup: true,
    isAdmin: true,
    botAdmin: true,
    async execute(sock, msg, args, extra) {
        const durationArg = args[0];
        
        if (!durationArg) {
            return extra.reply(`❌ Please provide a duration.\n\n📝 *Examples:*\n§opentime 30s\n§opentime 5m\n§opentime 2h\n§opentime 1d`);
        }
        
        // Parse duration
        const value = parseInt(durationArg);
        const unit = durationArg.slice(-1).toLowerCase();
        let durationMs = 0;
        
        switch(unit) {
            case 's': durationMs = value * 1000; break;
            case 'm': durationMs = value * 60 * 1000; break;
            case 'h': durationMs = value * 60 * 60 * 1000; break;
            case 'd': durationMs = value * 24 * 60 * 60 * 1000; break;
            default: return extra.reply('❌ Invalid duration. Use s (seconds), m (minutes), h (hours), or d (days).');
        }
        
        let schedules = {};
        if (fs.existsSync(schedulePath)) schedules = JSON.parse(fs.readFileSync(schedulePath));
        
        const openTime = Date.now() + durationMs;
        schedules[extra.from] = { openAt: openTime, action: 'open' };
        fs.writeFileSync(schedulePath, JSON.stringify(schedules, null, 2));
        
        // Format duration text
        const durationText = formatDuration(durationMs);
        
        await extra.reply(`⏰ *Group will open in ${durationText}*\n\nAll members will be able to send messages after this time.`);
        
        setTimeout(async () => {
            try {
                const currentMetadata = await sock.groupMetadata(extra.from);
                if (currentMetadata.announce) {
                    await sock.groupSettingUpdate(extra.from, 'not_announcement');
                    await sock.sendMessage(extra.from, { text: '🔓 *Group Auto-Opened*\n\nThis group has been automatically opened as scheduled. All members can now send messages.' });
                }
                delete schedules[extra.from];
                fs.writeFileSync(schedulePath, JSON.stringify(schedules, null, 2));
            } catch (e) {}
        }, durationMs);
    }
};

function formatDuration(ms) {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days} day${days > 1 ? 's' : ''}`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''}`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''}`;
    return `${seconds} second${seconds !== 1 ? 's' : ''}`;
}