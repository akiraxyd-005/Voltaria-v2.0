module.exports = {
    name: 'uptime',
    aliases: ['runtime', 'alivetime'],
    category: 'debug',
    description: 'Show bot uptime',
    usage: '§uptime',
    async execute(sock, msg, args, extra) {
        const uptime = process.uptime();
        const days = Math.floor(uptime / 86400);
        const hours = Math.floor((uptime % 86400) / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        const seconds = Math.floor(uptime % 60);
        
        const uptimeMessage = `┏━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  ⏱️ *UPTIME* ⏱️
┗━━━━━━━━━━━━━━━━━━━━━━━━┛

📅 *Days:* ${days}
🕐 *Hours:* ${hours}
⏰ *Minutes:* ${minutes}
⏱️ *Seconds:* ${seconds}

━━━━━━━━━━━━━━━━━━━━━━━━━━
> ©𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 𝙽£𝚇𝚄$`;
        
        await extra.reply(uptimeMessage);
    }
};