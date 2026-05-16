const fs = require('fs');
const duelsPath = './database/duels.json';
const economyPath = './database/economy.json';
const currencySymbol = '𝑵̶';

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
        
        // Check if challenger still has enough money
        let economy = {};
        if (fs.existsSync(economyPath)) economy = JSON.parse(fs.readFileSync(economyPath));
        
        const challengerMoney = economy[pendingDuel.from]?.balance || 0;
        
        if (challengerMoney < pendingDuel.amount) {
            delete duels[pendingDuel.id];
            fs.writeFileSync(duelsPath, JSON.stringify(duels, null, 2));
            return extra.reply(`❌ The challenger no longer has enough ${currencySymbol} Nex to duel!\nDuel cancelled.`);
        }
        
        // Check if accepter has enough money
        const accepterMoney = economy[extra.sender]?.balance || 0;
        
        if (accepterMoney < pendingDuel.amount) {
            return extra.reply(`❌ You don't have enough ${currencySymbol} Nex to accept this duel!\nYou need: ${currencySymbol} ${pendingDuel.amount.toLocaleString()}\nYou have: ${currencySymbol} ${accepterMoney.toLocaleString()}`);
        }
        
        // Deduct both players' bets
        economy[pendingDuel.from].balance -= pendingDuel.amount;
        economy[extra.sender].balance -= pendingDuel.amount;
        
        // Simulate duel outcome
        const winner = Math.random() < 0.5 ? pendingDuel.from : pendingDuel.to;
        const loser = winner === pendingDuel.from ? pendingDuel.to : pendingDuel.from;
        
        // Award 2x the amount to winner (both bets combined)
        const prize = pendingDuel.amount * 2;
        economy[winner].balance += prize;
        
        fs.writeFileSync(economyPath, JSON.stringify(economy, null, 2));
        
        delete duels[pendingDuel.id];
        fs.writeFileSync(duelsPath, JSON.stringify(duels, null, 2));
        
        await sock.sendMessage(extra.from, {
            text: `⚔️ *DUEL RESULT* ⚔️\n\n@${winner.split('@')[0]} defeated @${loser.split('@')[0]}!\n\n🏆 *${currencySymbol} ${prize.toLocaleString()} Nex* goes to @${winner.split('@')[0]}!\n\nGG! 👏`,
            mentions: [pendingDuel.from, pendingDuel.to]
        }, { quoted: msg });
    }
};