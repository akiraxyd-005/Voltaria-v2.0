const fs = require('fs');
const warnsPath = './database/warns.json';

module.exports = {
    name: 'resetwarn',
    aliases: ['clearwarn', 'unwarn'],
    category: 'admin',
    description: 'Reset warnings for a user',
    usage: '§resetwarn @user',
    isGroup: true,
    isAdmin: true,
    async execute(sock, msg, args, extra) {
        const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;
        
        if (!mentioned || mentioned.length === 0) {
            return extra.reply(`❌ *𝑈𝑠𝑎𝑔𝑒:* §𝑟𝑒𝑠𝑒𝑡𝑤𝑎𝑟𝑛 @𝑢𝑠𝑒𝑟`);
        }
        
        const target = mentioned[0];
        let warns = {};
        if (fs.existsSync(warnsPath)) warns = JSON.parse(fs.readFileSync(warnsPath));
        
        if (!warns[extra.from] || !warns[extra.from][target]) {
            return extra.reply(`⚠️ @${target.split('@')[0]} ℎ𝑎𝑠 𝑛𝑜 𝑤𝑎𝑟𝑛𝑖𝑛𝑔𝑠 𝑡𝑜 𝑟𝑒𝑠𝑒𝑡.`, { mentions: [target] });
        }
        
        delete warns[extra.from][target];
        fs.writeFileSync(warnsPath, JSON.stringify(warns, null, 2));
        
        await sock.sendMessage(extra.from, {
            text: `✅ *𝑊𝑎𝑟𝑛𝑖𝑛𝑔𝑠 𝑟𝑒𝑠𝑒𝑡* 𝑓𝑜𝑟 @${target.split('@')[0]}.`,
            mentions: [target]
        }, { quoted: msg });
    }
};