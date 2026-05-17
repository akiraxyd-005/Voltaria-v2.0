const fs = require('fs');
const bansPath = './database/bans.json';

module.exports = {
    name: 'unban',
    category: 'owner',
    description: 'Unban a user',
    usage: '§unban @user',
    isOwner: true,
    async execute(sock, msg, args, extra) {
        const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;
        
        if (!mentioned || mentioned.length === 0) {
            return extra.reply('❌ Mention a user to unban.\nUsage: §unban @user');
        }
        
        const target = mentioned[0];
        const targetName = target.split('@')[0];
        
        let bans = {};
        if (fs.existsSync(bansPath)) bans = JSON.parse(fs.readFileSync(bansPath));
        
        if (!bans[target]) {
            return extra.reply(`⚠️ @${targetName} is not banned.`);
        }
        
        delete bans[target];
        fs.writeFileSync(bansPath, JSON.stringify(bans, null, 2));
        
        await sock.sendMessage(extra.from, {
            text: `✅ *User Unbanned*\n\n@${targetName} can now use the bot again.`,
            mentions: [target]
        }, { quoted: msg });
    }
};