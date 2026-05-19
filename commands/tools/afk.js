const fs = require('fs');
const afkPath = './database/afk.json';

module.exports = {
    name: 'afk',
    aliases: ['away', 'brb'],
    category: 'tools',
    description: 'Set yourself as AFK (Away From Keyboard)',
    usage: '§afk <reason>',
    async execute(sock, msg, args, extra) {
        const sender = extra.sender;
        const senderName = msg.pushName || sender.split('@')[0];
        const reason = args.join(' ') || 'AFK';
        
        let afkData = {};
        if (fs.existsSync(afkPath)) afkData = JSON.parse(fs.readFileSync(afkPath));
        
        afkData[sender] = {
            reason: reason,
            time: Date.now(),
            name: senderName
        };
        
        fs.writeFileSync(afkPath, JSON.stringify(afkData, null, 2));
        
        await extra.reply(`💤 *${senderName} is now AFK*\n📝 Reason: ${reason}\n\n> ©POWERED BY NEXUS`);
    }
};