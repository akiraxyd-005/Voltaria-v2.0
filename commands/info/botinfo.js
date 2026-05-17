const fs = require('fs');
const pkg = require('../../package.json');

module.exports = {
    name: 'botinfo',
    aliases: ['about', 'stats'],
    category: 'info',
    description: 'Get info about the bot',
    usage: '§botinfo',
    async execute(sock, msg, args, extra) {
        const uptime = process.uptime();
        const days = Math.floor(uptime / 86400);
        const hours = Math.floor((uptime % 86400) / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        
        let totalCommands = 0;
        const commandsPath = './commands';
        if (fs.existsSync(commandsPath)) {
            const categories = fs.readdirSync(commandsPath);
            for (const cat of categories) {
                const catPath = `${commandsPath}/${cat}`;
                if (fs.statSync(catPath).isDirectory()) {
                    totalCommands += fs.readdirSync(catPath).filter(f => f.endsWith('.js')).length;
                }
            }
        }
        
        const botInfo = `┏━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  🤖  *BOT INFO*  🤖
┗━━━━━━━━━━━━━━━━━━━━━━━━┛

📛 *Name:* Voltaria
🔖 *Version:* ${pkg.version || '3.3.0'}
⚡ *Prefix:* §
📦 *Commands:* ${totalCommands}+
👑 *Owner:* Arashi

⏱️ *Uptime:* ${days}d ${hours}h ${minutes}m

━━━━━━━━━━━━━━━━━━━━━━━━━━
> ©𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 𝙽£𝚇𝚄$`;
        
        await extra.reply(botInfo);
    }
};