const os = require('os');

module.exports = {
    name: 'status',
    aliases: ['sysinfo', 'system'],
    category: 'debug',
    description: 'Show bot system status',
    usage: '§status',
    isOwner: true,
    async execute(sock, msg, args, extra) {
        const totalMem = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2);
        const freeMem = (os.freemem() / 1024 / 1024 / 1024).toFixed(2);
        const usedMem = (totalMem - freeMem).toFixed(2);
        
        const statusMessage = `┏━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  📊 *SYSTEM STATUS* 📊
┗━━━━━━━━━━━━━━━━━━━━━━━━┛

💻 *Platform:* ${os.platform()}
🔧 *Arch:* ${os.arch()}
🧠 *CPU Cores:* ${os.cpus().length}
💾 *RAM:* ${usedMem}GB / ${totalMem}GB
🕐 *Load Avg:* ${os.loadavg().map(l => l.toFixed(2)).join(', ')}

━━━━━━━━━━━━━━━━━━━━━━━━━━
> ©𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 𝙽£𝚇𝚄$`;
        
        await extra.reply(statusMessage);
    }
};