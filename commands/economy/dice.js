const fs = require('fs');
const path = './database/economy.json';
const cooldowns = new Map();
const currencySymbol = '𝑵̶';

module.exports = {
    name: 'dice',
    aliases: ['roll'],
    category: 'economy',
    description: 'Roll dice and bet on number or high/low',
    usage: '§dice <1-6/high/low> <amount>',
    async execute(sock, msg, args, extra) {
        const sender = extra.sender;
        const betType = args[0]?.toLowerCase();
        const amount = parseInt(args[1]);
        
        if (cooldowns.has(sender) && Date.now() - cooldowns.get(sender) < 45000) {
            const remaining = Math.ceil((45000 - (Date.now() - cooldowns.get(sender))) / 1000);
            return extra.reply(`⏳ Slow down! Next dice roll in ${remaining}s`);
        }
        
        if (!betType || !amount) {
            return extra.reply(`❌ *Usage:* §dice <1-6/high/low> <amount>\n\nExamples:\n§dice 3 100\n§dice high 100`);
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
        
        const roll = Math.floor(Math.random() * 6) + 1;
        let winAmount = 0;
        let message = '';
        
        if (betType === '1' || betType === '2' || betType === '3' || betType === '4' || betType === '5' || betType === '6') {
            const guess = parseInt(betType);
            if (roll === guess) {
                winAmount = amount * 5;
                economy[sender].balance += winAmount;
                message = `🎲 *DICE*

⚅ Rolled: ${roll}
Your guess: ${guess}

🌟 PERFECT GUESS! 🌟
💰 Won: ${winAmount.toLocaleString()} ${currencySymbol} (5x)`;
            } else if (Math.abs(roll - guess) === 1) {
                economy[sender].balance -= amount;
                message = `🎲 *DICE*

⚅ Rolled: ${roll}
Your guess: ${guess}

😫 OFF BY ONE!
💸 Lost: ${amount.toLocaleString()} ${currencySymbol}`;
            } else {
                economy[sender].balance -= amount;
                message = `🎲 *DICE*

⚅ Rolled: ${roll}
Your guess: ${guess}

💀 Not even close!
💸 Lost: ${amount.toLocaleString()} ${currencySymbol}`;
            }
        } else if (betType === 'high' || betType === 'low') {
            const isHigh = betType === 'high';
            const win = (isHigh && roll >= 4) || (!isHigh && roll <= 3);
            
            if (win) {
                winAmount = Math.floor(amount * 1.8);
                economy[sender].balance += winAmount;
                message = `🎲 *DICE*

⚅ Rolled: ${roll}
Your guess: ${betType.toUpperCase()}

✅ You were right!
💰 Won: ${winAmount.toLocaleString()} ${currencySymbol} (1.8x)`;
            } else {
                economy[sender].balance -= amount;
                message = `🎲 *DICE*

⚅ Rolled: ${roll}
Your guess: ${betType.toUpperCase()}

💀 Wrong!
💸 Lost: ${amount.toLocaleString()} ${currencySymbol}`;
            }
        } else {
            return extra.reply(`❌ Invalid bet type. Use: 1-6, high, or low`);
        }
        
        fs.writeFileSync(path, JSON.stringify(economy, null, 2));
        cooldowns.set(sender, Date.now());
        
        message += `\n\n💰 Balance: ${economy[sender].balance.toLocaleString()} ${currencySymbol}\n\n> ©POWERED BY NEXUS`;
        await extra.reply(message);
    }
};