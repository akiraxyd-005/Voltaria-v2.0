const fs = require('fs');
const warnsPath = './database/warns.json';

module.exports = {
    name: 'warn',
    category: 'admin',
    description: 'Warn a user (3 warns = kick)',
    usage: '§warn @user <reason>',
    isGroup: true,
    isAdmin: true,
    async execute(sock, msg, args, extra) {
        const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;
        
        if (!mentioned || mentioned.length === 0) {
            return extra.reply(`❌ *𝑈𝑠𝑎𝑔𝑒:* §𝑤𝑎𝑟𝑛 @𝑢𝑠𝑒𝑟 <𝑟𝑒𝑎𝑠𝑜𝑛>\n\n𝐸𝑥𝑎𝑚𝑝𝑙𝑒: §𝑤𝑎𝑟𝑛 @𝐽𝑜ℎ𝑛 𝑆𝑝𝑎𝑚𝑚𝑖𝑛𝑔`);
        }
        
        const target = mentioned[0];
        const reason = args.slice(1).join(' ') || '𝑁𝑜 𝑟𝑒𝑎𝑠𝑜𝑛 𝑝𝑟𝑜𝑣𝑖𝑑𝑒𝑑';
        
        let warns = {};
        if (fs.existsSync(warnsPath)) warns = JSON.parse(fs.readFileSync(warnsPath));
        
        if (!warns[extra.from]) warns[extra.from] = {};
        if (!warns[extra.from][target]) warns[extra.from][target] = [];
        
        warns[extra.from][target].push({
            reason: reason,
            date: new Date().toISOString(),
            warnedBy: extra.sender
        });
        
        const warnCount = warns[extra.from][target].length;
        fs.writeFileSync(warnsPath, JSON.stringify(warns, null, 2));
        
        await sock.sendMessage(extra.from, {
            text: `⚠️ *𝑊𝐴𝑅𝑁𝐼𝑁𝐺* ⚠️\n\n@${target.split('@')[0]} ℎ𝑎𝑠 𝑏𝑒𝑒𝑛 𝑤𝑎𝑟𝑛𝑒𝑑\n📝 *𝑅𝑒𝑎𝑠𝑜𝑛:* ${reason}\n⚠️ *𝑊𝑎𝑟𝑛𝑖𝑛𝑔𝑠:* ${warnCount}/3`,
            mentions: [target]
        }, { quoted: msg });
        
        // Auto-kick at 3 warnings
        if (warnCount >= 3) {
            await sock.groupParticipantsUpdate(extra.from, [target], 'remove');
            await sock.sendMessage(extra.from, {
                text: `👢 *𝑈𝑆𝐸𝑅 𝐾𝐼𝐶𝐾𝐸𝐷* 👢\n\n@${target.split('@')[0]} ℎ𝑎𝑠 𝑏𝑒𝑒𝑛 𝑘𝑖𝑐𝑘𝑒𝑑 𝑓𝑜𝑟 𝑟𝑒𝑎𝑐ℎ𝑖𝑛𝑔 3 𝑤𝑎𝑟𝑛𝑖𝑛𝑔𝑠.`,
                mentions: [target]
            }, { quoted: msg });
        }
    }
};