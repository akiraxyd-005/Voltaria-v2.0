const fs = require('fs');
const economyPath = './database/economy.json';
const currencySymbol = '𝑵̶';

module.exports = {
    name: 'lb',
    category: 'games',
    description: 'Global leaderboard',
    usage: '§lb',
    async execute(sock, msg, args, extra) {
        let economy = {};
        if (fs.existsSync(economyPath)) economy = JSON.parse(fs.readFileSync(economyPath));
        
        const sorted = Object.entries(economy)
            .sort((a, b) => (b[1].balance + b[1].bank) - (a[1].balance + a[1].bank))
            .slice(0, 15);
        
        let leaderboard = `╔══════════════════════════╗
    🏆  *𝗚𝗟𝗢𝗕𝗔𝗟 𝗟𝗘𝗔𝗗𝗘𝗥𝗕𝗢𝗔𝗥𝗗*
╚══════════════════════════╝\n\n`;
        
        const medals = ['🥇', '🥈', '🥉'];
        
        for (let i = 0; i < sorted.length; i++) {
            const [userId, data] = sorted[i];
            const total = (data.balance || 0) + (data.bank || 0);
            const medal = medals[i] || `*#${i+1}*`;
            leaderboard += `${medal} @${userId.split('@')[0]}\n   ⭐ Lv.${data.level || 1} │ ${currencySymbol} ${total.toLocaleString()} Nex │ ✨ ${(data.xp || 0).toLocaleString()} XP\n\n`;
        }
        
        leaderboard += `━━━━━━━━━━━━━━━━━━━━━━━━━━
_§lb games — Game rankings_
_§richest — Wealth rankings_`;
        
        await sock.sendMessage(extra.from, {
            text: leaderboard,
            mentions: sorted.map(s => s[0]).slice(0, 15)
        }, { quoted: msg });
    }
};