const fs = require('fs');
const disabledPath = './database/disabledgroups.json';

module.exports = {
    name: 'offhere',
    category: 'group',
    description: 'Disable bot commands in this group',
    usage: '§offhere',
    isGroup: true,
    isAdmin: true,
    async execute(sock, msg, args, extra) {
        let disabled = {};
        if (fs.existsSync(disabledPath)) disabled = JSON.parse(fs.readFileSync(disabledPath));
        
        disabled[extra.from] = {
            disabledAt: new Date().toISOString(),
            disabledBy: extra.sender
        };
        fs.writeFileSync(disabledPath, JSON.stringify(disabled, null, 2));
        
        await extra.reply(`🔇 *Bot commands DISABLED in this group*

Use §onhere to re-enable.

━━━━━━━━━━━━━━━━━━━━━━━━━━
> ©𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 𝙽£𝚇𝚄$`);
    }
};