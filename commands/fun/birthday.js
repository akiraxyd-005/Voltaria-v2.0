const fs = require('fs');
const birthdaysPath = './database/birthdays.json';

module.exports = {
    name: 'birthday',
    category: 'fun',
    description: 'Set or check birthday',
    usage: '§birthday set DD/MM | §birthday check @user',
    async execute(sock, msg, args, extra) {
        const action = args[0]?.toLowerCase();
        
        if (action === 'set') {
            const date = args[1];
            if (!date || !/^\d{2}\/\d{2}$/.test(date)) {
                return extra.reply('❌ Invalid date. Use DD/MM format. Example: §birthday set 15/08');
            }
            
            let birthdays = {};
            if (fs.existsSync(birthdaysPath)) birthdays = JSON.parse(fs.readFileSync(birthdaysPath));
            birthdays[extra.sender] = date;
            fs.writeFileSync(birthdaysPath, JSON.stringify(birthdays, null, 2));
            
            await extra.reply(`🎂 Birthday set to ${date}! You'll be celebrated on that day.`);
        } 
        else if (action === 'check') {
            const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;
            const target = mentioned ? mentioned[0] : extra.sender;
            
            let birthdays = {};
            if (fs.existsSync(birthdaysPath)) birthdays = JSON.parse(fs.readFileSync(birthdaysPath));
            const birthday = birthdays[target];
            
            if (birthday) {
                await extra.reply(`🎂 @${target.split('@')[0]}'s birthday is on ${birthday}`, { mentions: [target] });
            } else {
                await extra.reply(`📝 @${target.split('@')[0]} hasn't set a birthday yet.`, { mentions: [target] });
            }
        }
        else {
            await extra.reply(`📝 *Birthday System*\n\n§birthday set DD/MM - Set your birthday\n§birthday check @user - Check someone's birthday`);
        }
    }
};