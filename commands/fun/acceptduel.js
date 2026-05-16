const fs = require('fs');
const duelsPath = './database/duels.json';

module.exports = {
    name: 'acceptduel',
    category: 'fun',
    description: 'Accept a duel',
    usage: '§acceptduel',
    async execute(sock, msg, args, extra) {
        let duels = {};
        if (fs.existsSync(duelsPath)) duels = JSON.parse(fs.readFileSync(duelsPath));
        
        let pendingDuel = null;
        for (const [id, duel] of Object.entries(duels)) {
            if (duel.to === extra.sender && duel.status === 'pending' && duel.expires > Date.now()) {
                pendingDuel = { id, ...duel };
                break;
            }
        }
        
        if (!pendingDuel) {
            return extra.reply('❌ You have no pending duel challenges.');
        }
        
        // Simulate duel outcome
        const winner = Math.random() < 0.5 ? pendingDuel.from : pendingDuel.to;
        const loser = winner === pendingDuel.from ? pendingDuel.to : pendingDuel.from;
        
        delete duels[pendingDuel.id];
        fs.writeFileSync(duelsPath, JSON.stringify(duels, null, 2));
        
        await sock.sendMessage(extra.from, {
            text: `⚔️ *DUEL RESULT* ⚔️\n\n@${winner.split('@')[0]} defeated @${loser.split('@')[0]}!\n\n🏆 *${pendingDuel.amount} XYLO* goes to @${winner.split('@')[0]}!\n\nGG! 👏`,
            mentions: [pendingDuel.from, pendingDuel.to]
        }, { quoted: msg });
        
        // Award XYLO to winner (would integrate with economy system)
    }
};