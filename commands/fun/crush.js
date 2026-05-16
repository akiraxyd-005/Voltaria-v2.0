const fs = require('fs');
const crushesPath = './database/crushes.json';

module.exports = {
    name: 'crush',
    category: 'fun',
    description: 'Secretly admire someone (they won\'t be notified)',
    usage: '§crush @user',
    async execute(sock, msg, args, extra) {
        const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;
        
        if (!mentioned || mentioned.length === 0) {
            return extra.reply('❌ Mention someone to have a crush on.\nUsage: *§crush @user*');
        }
        
        const target = mentioned[0];
        
        let crushes = {};
        if (fs.existsSync(crushesPath)) crushes = JSON.parse(fs.readFileSync(crushesPath));
        
        crushes[extra.sender] = {
            crush: target,
            since: Date.now()
        };
        
        fs.writeFileSync(crushesPath, JSON.stringify(crushes, null, 2));
        
        await extra.reply(`💕 *Secret Crush* 💕\n\nYou've secretly admired @${target.split('@')[0]}.\n\nYour secret is safe with me! 🤫`);
    }
};