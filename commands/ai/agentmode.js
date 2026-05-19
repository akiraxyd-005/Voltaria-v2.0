const axios = require('axios');
const fs = require('fs');

module.exports = {
    name: 'agentmode',
    aliases: ['agent'],
    category: 'ai',
    description: 'Toggle Voltaria Agent — context-aware AI that knows commands, searches web, and claps back',
    usage: '§agentmode on/off',
    isGroup: true,
    isAdmin: true,
    async execute(sock, msg, args, extra) {
        const action = args[0]?.toLowerCase();
        const groupId = extra.from;
        const agentPath = './database/agentmode.json';
        
        let agentData = {};
        if (fs.existsSync(agentPath)) agentData = JSON.parse(fs.readFileSync(agentPath));
        
        if (action === 'on') {
            agentData[groupId] = { enabled: true };
            fs.writeFileSync(agentPath, JSON.stringify(agentData, null, 2));
            await extra.reply(`🤖 *Voltaria Agent Mode ENABLED*\n\nI will respond to @mentions with context-aware AI.\n\n> ©POWERED BY NEXUS`);
        } else if (action === 'off') {
            delete agentData[groupId];
            fs.writeFileSync(agentPath, JSON.stringify(agentData, null, 2));
            await extra.reply(`🤖 *Voltaria Agent Mode DISABLED*\n\n> ©POWERED BY NEXUS`);
        } else {
            const status = agentData[groupId]?.enabled ? '✅ ENABLED' : '❌ DISABLED';
            await extra.reply(`🤖 *Voltaria Agent Mode*\n\nStatus: ${status}\n\n§agentmode on - Enable\n§agentmode off - Disable\n\n> ©POWERED BY NEXUS`);
        }
    }
};