const fs = require('fs');
const sudoPath = './database/sudo.json';

module.exports = {
    name: 'listsudo',
    aliases: ['sudolist'],
    category: 'owner',
    description: 'List all sudo users',
    usage: '§listsudo',
    isOwner: true,
    async execute(sock, msg, args, extra) {
        let sudo = {};
        if (fs.existsSync(sudoPath)) sudo = JSON.parse(fs.readFileSync(sudoPath));
        
        const sudoUsers = Object.keys(sudo);
        
        if (sudoUsers.length === 0) {
            return extra.reply('📝 *No sudo users*');
        }
        
        let list = '👑 *Sudo Users*\n\n';
        for (let i = 0; i < sudoUsers.length; i++) {
            const user = sudoUsers[i];
            const data = sudo[user];
            list += `${i+1}. @${user.split('@')[0]} - Added: ${data.addedAt.split('T')[0]}\n`;
        }
        
        await sock.sendMessage(extra.from, {
            text: list,
            mentions: sudoUsers
        }, { quoted: msg });
    }
};