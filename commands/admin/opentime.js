const fs = require('fs');
const schedulePath = './database/schedules.json';

module.exports = {
    name: 'opentime',
    category: 'admin',
    description: 'Auto-open group after a duration',
    usage: '§opentime <duration>',
    isGroup: true,
    isAdmin: true,
    botAdmin: true,
    async execute(sock, msg, args, extra) {
        const durationArg = args[0];
        
        if (!durationArg) {
            return extra.reply(`❌ *𝑈𝑠𝑎𝑔𝑒:* §𝑜𝑝𝑒𝑛𝑡𝑖𝑚𝑒 <𝑑𝑢𝑟𝑎𝑡𝑖𝑜𝑛>\n\n𝐸𝑥𝑎𝑚𝑝𝑙𝑒𝑠:\n§𝑜𝑝𝑒𝑛𝑡𝑖𝑚𝑒 30𝑠\n§𝑜𝑝𝑒𝑛𝑡𝑖𝑚𝑒 5𝑚\n§𝑜𝑝𝑒𝑛𝑡𝑖𝑚𝑒 2ℎ\n§𝑜𝑝𝑒𝑛𝑡𝑖𝑚𝑒 1𝑑`);
        }
        
        const value = parseInt(durationArg);
        const unit = durationArg.slice(-1).toLowerCase();
        let durationMs = 0;
        
        switch(unit) {
            case 's': durationMs = value * 1000; break;
            case 'm': durationMs = value * 60 * 1000; break;
            case 'h': durationMs = value * 60 * 60 * 1000; break;
            case 'd': durationMs = value * 24 * 60 * 60 * 1000; break;
            default: return extra.reply('❌ 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑑𝑢𝑟𝑎𝑡𝑖𝑜𝑛. 𝑈𝑠𝑒 𝑠 (𝑠𝑒𝑐𝑜𝑛𝑑𝑠), 𝑚 (𝑚𝑖𝑛𝑢𝑡𝑒𝑠), ℎ (ℎ𝑜𝑢𝑟𝑠), 𝑜𝑟 𝑑 (𝑑𝑎𝑦𝑠).');
        }
        
        let schedules = {};
        if (fs.existsSync(schedulePath)) schedules = JSON.parse(fs.readFileSync(schedulePath));
        
        const openTime = Date.now() + durationMs;
        schedules[extra.from] = { openAt: openTime, action: 'open' };
        fs.writeFileSync(schedulePath, JSON.stringify(schedules, null, 2));
        
        const durationText = formatDuration(durationMs);
        
        await extra.reply(`⏰ *𝐺𝑟𝑜𝑢𝑝 𝑤𝑖𝑙𝑙 𝑜𝑝𝑒𝑛 𝑖𝑛 ${durationText}*\n\n𝐴𝑙𝑙 𝑚𝑒𝑚𝑏𝑒𝑟𝑠 𝑤𝑖𝑙𝑙 𝑏𝑒 𝑎𝑏𝑙𝑒 𝑡𝑜 𝑠𝑒𝑛𝑑 𝑚𝑒𝑠𝑠𝑎𝑔𝑒𝑠 𝑎𝑓𝑡𝑒𝑟 𝑡ℎ𝑖𝑠 𝑡𝑖𝑚𝑒.`);
        
        setTimeout(async () => {
            try {
                const currentMetadata = await sock.groupMetadata(extra.from);
                if (currentMetadata.announce) {
                    await sock.groupSettingUpdate(extra.from, 'not_announcement');
                    await sock.sendMessage(extra.from, { text: '🔓 *𝐺𝑟𝑜𝑢𝑝 𝐴𝑢𝑡𝑜-𝑂𝑝𝑒𝑛𝑒𝑑*\n\n𝑇ℎ𝑖𝑠 𝑔𝑟𝑜𝑢𝑝 ℎ𝑎𝑠 𝑏𝑒𝑒𝑛 𝑎𝑢𝑡𝑜𝑚𝑎𝑡𝑖𝑐𝑎𝑙𝑙𝑦 𝑜𝑝𝑒𝑛𝑒𝑑 𝑎𝑠 𝑠𝑐ℎ𝑒𝑑𝑢𝑙𝑒𝑑.' });
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
    
    if (days > 0) return `${days} 𝑑𝑎𝑦${days > 1 ? '𝑠' : ''}`;
    if (hours > 0) return `${hours} ℎ𝑜𝑢𝑟${hours > 1 ? '𝑠' : ''}`;
    if (minutes > 0) return `${minutes} 𝑚𝑖𝑛𝑢𝑡𝑒${minutes > 1 ? '𝑠' : ''}`;
    return `${seconds} 𝑠𝑒𝑐𝑜𝑛𝑑${seconds !== 1 ? '𝑠' : ''}`;
}