const fs = require('fs');
const afkPath = './database/afk.json';

module.exports = {
    name: 'unafk',
    aliases: ['back', 'afkoff'],
    category: 'tools',
    description: 'Remove your AFK status',
    usage: '§unafk',
    async execute(sock, msg, args, extra) {
        const sender = extra.sender;
        
        if (!fs.existsSync(afkPath)) {
            return extra.reply(`❌ You are not AFK.\n\n> ©POWERED BY NEXUS`);
        }
        
        let afkData = JSON.parse(fs.readFileSync(afkPath));
        
        if (!afkData[sender]) {
            return extra.reply(`❌ You are not AFK.\n\n> ©POWERED BY NEXUS`);
        }
        
        const wasAfk = afkData[sender];
        delete afkData[sender];
        fs.writeFileSync(afkPath, JSON.stringify(afkData, null, 2));
        
        const timeAway = Math.floor((Date.now() - wasAfk.time) / 60000);
        const timeText = timeAway < 1 ? 'just now' : timeAway === 1 ? '1 minute' : `${timeAway} minutes`;
        
        await extra.reply(`👋 *Welcome back!* You were AFK for ${timeText}.\n\n> ©POWERED BY NEXUS`);
    }
};