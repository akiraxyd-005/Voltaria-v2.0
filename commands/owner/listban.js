const fs = require('fs');
const bansPath = './database/bans.json';

module.exports = {
    name: 'listban',
    aliases: ['bannedlist', 'banlist'],
    category: 'owner',
    description: 'List all banned users',
    usage: '§listban',
    isOwner: true,
    async execute(sock, msg, args, extra) {
        let bans = {};
        if (fs.existsSync(bansPath)) bans = JSON.parse(fs.readFileSync(bansPath));
        
        const bannedUsers = Object.keys(bans);
        
        if (bannedUsers.length === 0) {
            return extra.reply('📝 *No banned users*');
        }
        
        let list = '🔨 *Banned Users*\n\n';
        for (let i = 0; i < bannedUsers.length; i++) {
            const user = bannedUsers[i];
            const data = bans[user];
            list += `${i+1}. @${user.split('@')[0]} - Banned: ${data.bannedAt.split('T')[0]}\n`;
        }
        
        await sock.sendMessage(extra.from, {
            text: list,
            mentions: bannedUsers
        }, { quoted: msg });
    }
};