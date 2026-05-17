const fs = require('fs');
const bansPath = './database/bans.json';

module.exports = {
    name: 'ban',
    category: 'owner',
    description: 'Ban a user from using the bot',
    usage: '§ban @user',
    isOwner: true,
    async execute(sock, msg, args, extra) {
        const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;
        
        if (!mentioned || mentioned.length === 0) {
            return extra.reply('❌ Mention a user to ban.\nUsage: §ban @user');
        }
        
        const target = mentioned[0];
        const targetName = target.split('@')[0];
        
        let bans = {};
        if (fs.existsSync(bansPath)) bans = JSON.parse(fs.readFileSync(bansPath));
        
        if (bans[target]) {
            return extra.reply(`⚠️ @${targetName} is already banned.`);
        }
        
        bans[target] = {
            bannedAt: new Date().toISOString(),
            bannedBy: extra.sender
        };
        
        fs.writeFileSync(bansPath, JSON.stringify(bans, null, 2));
        
        await sock.sendMessage(extra.from, {
            text: `🔨 *User Banned*\n\n@${targetName} has been banned from using the bot.`,
            mentions: [target]
        }, { quoted: msg });
    }
};