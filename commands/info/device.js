const os = require('os');

module.exports = {
    name: 'device',
    category: 'info',
    description: 'Pinpoint platform via 22-character entropy analysis',
    usage: '§device',
    async execute(sock, msg, args, extra) {
        const platform = os.platform();
        const arch = os.arch();
        const hostname = os.hostname();
        const cpus = os.cpus().length;
        const totalMem = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2);
        
        const deviceInfo = `┏━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  💻  *DEVICE INFO*  💻
┗━━━━━━━━━━━━━━━━━━━━━━━━┛

🖥️ *Platform:* ${platform}
🔧 *Architecture:* ${arch}
🏷️ *Hostname:* ${hostname}
⚙️ *CPU Cores:* ${cpus}
💾 *RAM:* ${totalMem} GB
🕐 *Uptime:* ${Math.floor(process.uptime() / 3600)}h ${Math.floor((process.uptime() % 3600) / 60)}m

━━━━━━━━━━━━━━━━━━━━━━━━━━
> ©𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 𝙽£𝚇𝚄$`;
        
        await extra.reply(deviceInfo);
    }
};