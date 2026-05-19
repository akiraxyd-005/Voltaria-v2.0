const fs = require('fs');
const path = './database/economy.json';
const cooldowns = new Map();
const currencySymbol = '𝑵̶';

module.exports = {
    name: 'coinflip',
    aliases: ['cf'],
    category: 'economy',
    description: 'Flip a coin and bet on heads or tails',
    usage: '§coinflip <heads/tails> <amount>',
    async execute(sock, msg, args, extra) {
        const sender = extra.sender;
        const choice = args[0]?.toLowerCase();
        const amount = parseInt(args[1]);
        
        if (cooldowns.has(sender) && Date.now() - cooldowns.get(sender) < 30000) {
            const remaining = Math.ceil((30000 - (Date.now() - cooldowns.get(sender))) / 1000);
            return extra.reply(`⏳ Slow down! Next coinflip in ${remaining}s`);
        }
        
        if (!choice || (choice !== 'heads' && choice !== 'tails')) {
            return extra.reply(`❌ *Usage:* §coinflip <heads/tails> <amount>\n\nExample: §coinflip heads 100`);
        }
        
        if (!amount || isNaN(amount) || amount < 10) {
            return extra.reply(`❌ Enter a valid amount (minimum 10 ${currencySymbol})`);
        }
        
        let economy = {};
        if (fs.existsSync(path)) economy = JSON.parse(fs.readFileSync(path));
        
        if (!economy[sender]) {
            economy[sender] = { balance: 1000, bank: 0 };
            fs.writeFileSync(path, JSON.stringify(economy, null, 2));
        }
        
        if (economy[sender].balance < amount) {
            return extra.reply(`❌ You don't have enough ${currencySymbol}!\n💰 Balance: ${economy[sender].balance.toLocaleString()} ${currencySymbol}`);
        }
        
        const result = Math.random() < 0.5 ? 'heads' : 'tails';
        const isJackpot = Math.random() < 0.005;
        
        let winAmount = 0;
        let message = '';
        
        if (isJackpot) {
            winAmount = amount * 5;
            economy[sender].balance += winAmount;
            message = `🪙 *COINFLIP*

🎉 JACKPOT! 🎉
The coin landed on its edge!

💰 Won: ${winAmount.toLocaleString()} ${currencySymbol} (5x)`;
        } else if (choice === result) {
            winAmount = Math.floor(amount * 1.8);
            economy[sender].balance += winAmount;
            message = `🪙 *COINFLIP*

✅ You called ${choice.toUpperCase()}. It's ${result.toUpperCase()}!

💰 Won: ${winAmount.toLocaleString()} ${currencySymbol} (1.8x)`;
        } else {
            economy[sender].balance -= amount;
            message = `🪙 *COINFLIP*

😞 You called ${choice.toUpperCase()}. It's ${result.toUpperCase()}.

💸 Lost: ${amount.toLocaleString()} ${currencySymbol}`;
        }
        
        fs.writeFileSync(path, JSON.stringify(economy, null, 2));
        cooldowns.set(sender, Date.now());
        
        message += `\n\n💰 Balance: ${economy[sender].balance.toLocaleString()} ${currencySymbol}\n\n> ©POWERED BY NEXUS`;
        await extra.reply(message);
    }
};