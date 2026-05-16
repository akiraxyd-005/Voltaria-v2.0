const fs = require('fs');
const warnsPath = './database/warns.json';

module.exports = {
    name: 'warn',
    aliases: ['givewarn'],
    category: 'group',
    description: 'Warn a member',
    isGroup: true,
    isAdmin: true,
    async execute(sock, msg, args, extra) {
        const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;
        
        if (!mentioned || mentioned.length === 0) {
            return extra.reply('❌ Please mention the user to warn.\n\nExample: §warn @user spamming');
        }
        
        const target = mentioned[0];
        const reason = args.slice(1).join(' ') || 'No reason provided';
        
        let warns = {};
        if (fs.existsSync(warnsPath)) warns = JSON.parse(fs.readFileSync(warnsPath));
        
        if (!warns[extra.from]) warns[extra.from] = {};
        if (!warns[extra.from][target]) warns[extra.from][target] = [];
        
        warns[extra.from][target].push({
            reason: reason,
            date: new Date().toLocaleString(),
            by: extra.sender
        });
        
        fs.writeFileSync(warnsPath, JSON.stringify(warns, null, 2));
        
        const warnCount = warns[extra.from][target].length;
        const maxWarns = 3;
        
        await extra.reply(`⚠️ *WARNING ISSUED*\n\nUser: @${target.split('@')[0]}\nReason: ${reason}\nWarnings: ${warnCount}/${maxWarns}\n\n⚠️ ${maxWarns} warnings will result in a kick.`, { mentions: [target] });
        
        // Auto-kick at max warnings
        if (warnCount >= maxWarns) {
            await sock.groupParticipantsUpdate(extra.from, [target], 'remove');
            await extra.reply(`🚫 @${target.split('@')[0]} has been kicked due to ${maxWarns} warnings.`, { mentions: [target] });
        }
    }
};