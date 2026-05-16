const fs = require('fs');
const warnsPath = './database/warns.json';

module.exports = {
    name: 'resetwarn',
    aliases: ['clearwarn', 'unwarn'],
    category: 'group',
    description: 'Clear all warnings for a member',
    isGroup: true,
    isAdmin: true,
    async execute(sock, msg, args, extra) {
        const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;
        
        if (!mentioned || mentioned.length === 0) {
            return extra.reply('❌ Please mention the user to clear warnings.\n\nExample: §resetwarn @user');
        }
        
        const target = mentioned[0];
        
        let warns = {};
        if (fs.existsSync(warnsPath)) warns = JSON.parse(fs.readFileSync(warnsPath));
        
        if (warns[extra.from] && warns[extra.from][target]) {
            delete warns[extra.from][target];
            fs.writeFileSync(warnsPath, JSON.stringify(warns, null, 2));
            await extra.reply(`✅ Warnings cleared for @${target.split('@')[0]}.`, { mentions: [target] });
        } else {
            await extra.reply(`⚠️ @${target.split('@')[0]} has no warnings.`, { mentions: [target] });
        }
    }
};