const fs = require('fs');
const mutedPath = './database/mutedusers.json';

module.exports = {
    name: 'unmuteuser',
    aliases: ['unmute', 'speak'],
    category: 'group',
    description: 'Unmute a previously muted user',
    isGroup: true,
    isAdmin: true,
    async execute(sock, msg, args, extra) {
        const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;
        const target = mentioned?.[0];
        
        if (!target) {
            return extra.reply('❌ Please mention the user to unmute.\n\nExample: §unmute @user');
        }
        
        let muted = {};
        if (fs.existsSync(mutedPath)) muted = JSON.parse(fs.readFileSync(mutedPath));
        
        if (!muted[extra.from]?.[target]) {
            return extra.reply(`⚠️ @${target.split('@')[0]} is not muted.`, { mentions: [target] });
        }
        
        delete muted[extra.from][target];
        fs.writeFileSync(mutedPath, JSON.stringify(muted, null, 2));
        
        await sock.sendMessage(extra.from, {
            text: `🔊 @${target.split('@')[0]} has been unmuted and can now send messages again.`,
            mentions: [target]
        }, { quoted: msg });
    }
};