const fs = require('fs');
const customPath = './database/customcmds.json';

module.exports = {
    name: 'removecmd',
    category: 'owner',
    description: 'Remove a custom command trigger',
    usage: '§removecmd <trigger>',
    isOwner: true,
    async execute(sock, msg, args, extra) {
        const trigger = args[0]?.toLowerCase();
        
        if (!trigger) {
            return extra.reply('❌ Usage: §removecmd <trigger>\n\nExample: §removecmd hello');
        }
        
        let custom = {};
        if (fs.existsSync(customPath)) custom = JSON.parse(fs.readFileSync(customPath));
        
        if (!custom[trigger]) {
            return extra.reply(`❌ No custom command found for: ${trigger}`);
        }
        
        delete custom[trigger];
        fs.writeFileSync(customPath, JSON.stringify(custom, null, 2));
        
        await extra.reply(`✅ Removed custom command: *${trigger}*`);
    }
};