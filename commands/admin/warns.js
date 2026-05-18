const fs = require('fs');
const warnsPath = './database/warns.json';

module.exports = {
    name: 'warns',
    aliases: ['checkwarns', 'warnings'],
    category: 'admin',
    description: 'Check user warn count',
    usage: '§warns @user',
    isGroup: true,
    isAdmin: true,
    async execute(sock, msg, args, extra) {
        const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;
        
        if (!mentioned || mentioned.length === 0) {
            return extra.reply(`❌ *𝑈𝑠𝑎𝑔𝑒:* §𝑤𝑎𝑟𝑛𝑠 @𝑢𝑠𝑒𝑟`);
        }
        
        const target = mentioned[0];
        let warns = {};
        if (fs.existsSync(warnsPath)) warns = JSON.parse(fs.readFileSync(warnsPath));
        
        const userWarns = warns[extra.from]?.[target] || [];
        
        if (userWarns.length === 0) {
            await extra.reply(`✅ *@${target.split('@')[0]} ℎ𝑎𝑠 𝑛𝑜 𝑤𝑎𝑟𝑛𝑖𝑛𝑔𝑠.*`, { mentions: [target] });
        } else {
            const warnList = userWarns.map((w, i) => `${i+1}. ${w.reason} (${w.date?.split('T')[0] || new Date(w.date).toLocaleDateString()})`).join('\n');
            await extra.reply(`⚠️ *𝑊𝑎𝑟𝑛𝑖𝑛𝑔𝑠 𝑓𝑜𝑟 @${target.split('@')[0]}*\n\n${warnList}\n\n𝑇𝑜𝑡𝑎𝑙: ${userWarns.length}/3`, { mentions: [target] });
        }
    }
};