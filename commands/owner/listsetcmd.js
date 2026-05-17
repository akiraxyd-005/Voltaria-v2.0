const fs = require('fs');
const customPath = './database/customcmds.json';

module.exports = {
    name: 'listsetcmd',
    aliases: ['listcmd', 'customcmds'],
    category: 'owner',
    description: 'List all custom command triggers',
    usage: '§listsetcmd',
    isOwner: true,
    async execute(sock, msg, args, extra) {
        let custom = {};
        if (fs.existsSync(customPath)) custom = JSON.parse(fs.readFileSync(customPath));
        
        const triggers = Object.keys(custom);
        
        if (triggers.length === 0) {
            return extra.reply('📝 *No custom commands set*');
        }
        
        let list = '📋 *Custom Commands*\n\n';
        for (const [trigger, response] of Object.entries(custom)) {
            list += `🔹 *${trigger}* → ${response.substring(0, 30)}${response.length > 30 ? '...' : ''}\n`;
        }
        
        await extra.reply(list);
    }
};