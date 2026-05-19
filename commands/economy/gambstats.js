const fs = require('fs');
const path = './database/gambling.json';
const currencySymbol = '𝑵̶';

module.exports = {
    name: 'gambstats',
    aliases: ['gamblingstats'],
    category: 'economy',
    description: 'View your gambling statistics',
    usage: '§gambstats',
    async execute(sock, msg, args, extra) {
        const sender = extra.sender;
        
        let stats = {};
        if (fs.existsSync(path)) stats = JSON.parse(fs.readFileSync(path));
        
        if (!stats[sender]) {
            stats[sender] = { totalBet: 0, totalWon: 0, totalLost: 0, biggestWin: 0 };
        }
        
        const userStats = stats[sender];
        const netProfit = userStats.totalWon - userStats.totalLost;
        
        const statsDisplay = `🎰 *GAMBLING STATS*

💰 Total Bet: ${userStats.totalBet.toLocaleString()} ${currencySymbol}
✅ Total Won: ${userStats.totalWon.toLocaleString()} ${currencySymbol}
❌ Total Lost: ${userStats.totalLost.toLocaleString()} ${currencySymbol}
📊 Net Profit: ${netProfit.toLocaleString()} ${currencySymbol}
🏆 Biggest Win: ${userStats.biggestWin.toLocaleString()} ${currencySymbol}

> ©POWERED BY NEXUS`;
        
        await extra.reply(statsDisplay);
    }
};