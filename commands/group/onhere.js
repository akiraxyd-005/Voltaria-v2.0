const fs = require('fs');
const disabledPath = './database/disabledgroups.json';

module.exports = {
    name: 'onhere',
    category: 'group',
    description: 'Re-enable bot commands in this group',
    usage: '§onhere',
    isGroup: true,
    isAdmin: true,
    async execute(sock, msg, args, extra) {
        let disabled = {};
        if (fs.existsSync(disabledPath)) disabled = JSON.parse(fs.readFileSync(disabledPath));
        
        if (disabled[extra.from]) {
            delete disabled[extra.from];
            fs.writeFileSync(disabledPath, JSON.stringify(disabled, null, 2));
            await extra.reply(`🔊 *Bot commands ENABLED in this group*

━━━━━━━━━━━━━━━━━━━━━━━━━━
> ©𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 𝙽£𝚇𝚄$`);
        } else {
            await extra.reply(`ℹ️ Bot commands were already enabled in this group.

━━━━━━━━━━━━━━━━━━━━━━━━━━
> ©𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 𝙽£𝚇𝚄$`);
        }
    }
};