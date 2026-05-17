const fs = require('fs');
const customPath = './database/customcmds.json';

module.exports = {
    name: 'setcmd',
    category: 'owner',
    description: 'Set a custom command trigger',
    usage: '§setcmd <trigger> <response>',
    isOwner: true,
    async execute(sock, msg, args, extra) {
        const trigger = args[0]?.toLowerCase();
        const response = args.slice(1).join(' ');
        
        if (!trigger || !response) {
            return extra.reply('❌ Usage: §setcmd <trigger> <response>\n\nExample: §setcmd hello Hello there!');
        }
        
        let custom = {};
        if (fs.existsSync(customPath)) custom = JSON.parse(fs.readFileSync(customPath));
        
        custom[trigger] = response;
        fs.writeFileSync(customPath, JSON.stringify(custom, null, 2));
        
        await extra.reply(`✅ Custom command set: *${trigger}* → ${response}`);
    }
};