const os = require('os');

module.exports = {
    name: 'botinfo',
    aliases: ['about', 'stats'],
    category: 'info',
    description: 'Get info about the bot',
    usage: '§botinfo',
    async execute(sock, msg, args, extra) {
        const uptime = process.uptime();
        const hours = Math.floor(uptime / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        
        const totalMem = (os.totalmem() / 1024 / 1024).toFixed(2);
        
        const botInfo = `◆ *Bot Info*

• Name: Voltaria
• Mode: public
• Prefix: §
• Platform: ${os.platform()}
• Uptime: ${hours} hours ${minutes} minutes
• Memory: ${totalMem} MB

━━━━━━━━━━━━━━━━━━━━━━━━━━
> ©𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 𝙽£𝚇𝚄$`;
        
        await extra.reply(botInfo);
    }
};