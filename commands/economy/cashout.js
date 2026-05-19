const fs = require('fs');
const path = './database/economy.json';
const activeGames = new Map();
const currencySymbol = '𝑵̶';

module.exports = {
    name: 'cashout',
    category: 'economy',
    description: 'Cash out your current crash game',
    usage: '§cashout',
    async execute(sock, msg, args, extra) {
        const sender = extra.sender;
        
        const game = activeGames.get(sender);
        if (!game || game.cashedOut) {
            return extra.reply(`❌ You don't have an active crash game! Start one with §crash <amount>`);
        }
        
        let economy = {};
        if (fs.existsSync(path)) economy = JSON.parse(fs.readFileSync(path));
        
        if (!economy[sender]) {
            economy[sender] = { balance: 1000, bank: 0 };
            fs.writeFileSync(path, JSON.stringify(economy, null, 2));
        }
        
        const elapsed = (Date.now() - game.startTime) / 1000;
        let multiplier = Math.min(1 + elapsed * 0.1, game.crashPoint - 0.01);
        multiplier = Math.max(1.0, parseFloat(multiplier.toFixed(2)));
        
        const winAmount = Math.floor(game.bet * multiplier);
        economy[sender].balance += winAmount;
        
        game.cashedOut = true;
        activeGames.delete(sender);
        
        fs.writeFileSync(path, JSON.stringify(economy, null, 2));
        
        let message = '';
        if (multiplier >= 2.5) {
            message = `🚀 *CRASH*\n\n📈 You cashed out at ${multiplier}x!\n🎉 NICE TIMING!\n💰 Won: ${winAmount.toLocaleString()} ${currencySymbol}`;
        } else {
            message = `🚀 *CRASH*\n\n📈 You cashed out at ${multiplier}x\n💰 Won: ${winAmount.toLocaleString()} ${currencySymbol}`;
        }
        
        message += `\n\n💰 Balance: ${economy[sender].balance.toLocaleString()} ${currencySymbol}\n\n> ©POWERED BY NEXUS`;
        await extra.reply(message);
    }
};