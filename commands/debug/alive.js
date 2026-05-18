module.exports = {
    name: 'alive',
    aliases: ['ping', 'health'],
    category: 'debug',
    description: 'Check if bot is alive and responding',
    usage: '§alive',
    async execute(sock, msg, args, extra) {
        const senderName = msg.pushName || extra.sender.split('@')[0];
        const uptime = process.uptime();
        const hours = Math.floor(uptime / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        
        const aliveMessage = `┏━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  ✅ *I'M ALIVE!* ✅
┗━━━━━━━━━━━━━━━━━━━━━━━━┛

🌸 Hello *${senderName}-san*! 🌸

🕐 *Uptime:* ${hours}h ${minutes}m
⚡ *Prefix:* §
🤖 *Status:* Online & Ready

━━━━━━━━━━━━━━━━━━━━━━━━━━
> ©𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 𝙽£𝚇𝚄$`;
        
        await extra.reply(aliveMessage);
    }
};