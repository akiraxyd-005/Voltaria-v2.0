const fs = require('fs');
const path = './database/economy.json';
const cooldowns = new Map();
const currencySymbol = '𝑵̶';

const redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
const blackNumbers = [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35];

module.exports = {
    name: 'roulette',
    aliases: ['roul'],
    category: 'economy',
    description: 'Play Roulette - bet on red/black/odd/even/number',
    usage: '§roulette <red/black/odd/even/number> <amount>',
    async execute(sock, msg, args, extra) {
        const sender = extra.sender;
        const betType = args[0]?.toLowerCase();
        const amount = parseInt(args[1]);
        
        if (cooldowns.has(sender) && Date.now() - cooldowns.get(sender) < 30000) {
            const remaining = Math.ceil((30000 - (Date.now() - cooldowns.get(sender))) / 1000);
            return extra.reply(`⏳ Slow down! Next spin in ${remaining}s`);
        }
        
        if (!betType || !amount) {
            return extra.reply(`❌ *Usage:* §roulette <red/black/odd/even/number> <amount>\n\nExamples:\n§roulette red 100\n§roulette 7 100`);
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
        
        const spin = Math.floor(Math.random() * 37);
        const isRed = redNumbers.includes(spin);
        const isBlack = blackNumbers.includes(spin);
        const isEven = spin !== 0 && spin % 2 === 0;
        const isOdd = spin !== 0 && spin % 2 !== 0;
        
        let winAmount = 0;
        let message = '';
        let colorIcon = spin === 0 ? '🟢' : (isRed ? '🔴' : '⚫');
        
        if (!isNaN(betType)) {
            const number = parseInt(betType);
            if (number < 0 || number > 36) return extra.reply(`❌ Invalid number. Pick 0-36`);
            
            if (spin === number) {
                winAmount = amount * 8;
                economy[sender].balance += winAmount;
                message = `🎡 *ROULETTE*\n\n${colorIcon} Ball landed on: ${spin} ${colorIcon}\nYour bet: ${number}\n\n🌟 EXACT NUMBER! 🌟\n💰 Won: ${winAmount.toLocaleString()} ${currencySymbol} (8x)`;
            } else {
                economy[sender].balance -= amount;
                message = `🎡 *ROULETTE*\n\n${colorIcon} Ball landed on: ${spin} ${colorIcon}\nYour bet: ${number}\n\n💀 Wrong number!\n💸 Lost: ${amount.toLocaleString()} ${currencySymbol}`;
            }
        } else if (betType === 'red') {
            if (spin === 0) {
                economy[sender].balance -= amount;
                message = `🎡 *ROULETTE*\n\n🟢 Ball landed on: 0 🟢\nYour bet: RED\n\n💀 GREEN ZERO! House wins!\n💸 Lost: ${amount.toLocaleString()} ${currencySymbol}`;
            } else if (isRed) {
                winAmount = Math.floor(amount * 1.8);
                economy[sender].balance += winAmount;
                message = `🎡 *ROULETTE*\n\n🔴 Ball landed on: ${spin} 🔴\nYour bet: RED\n\n✅ You win!\n💰 Won: ${winAmount.toLocaleString()} ${currencySymbol} (1.8x)`;
            } else {
                economy[sender].balance -= amount;
                message = `🎡 *ROULETTE*\n\n⚫ Ball landed on: ${spin} ⚫\nYour bet: RED\n\n😫 Wrong color!\n💸 Lost: ${amount.toLocaleString()} ${currencySymbol}`;
            }
        } else if (betType === 'black') {
            if (spin === 0) {
                economy[sender].balance -= amount;
                message = `🎡 *ROULETTE*\n\n🟢 Ball landed on: 0 🟢\nYour bet: BLACK\n\n💀 GREEN ZERO!\n💸 Lost: ${amount.toLocaleString()} ${currencySymbol}`;
            } else if (isBlack) {
                winAmount = Math.floor(amount * 1.8);
                economy[sender].balance += winAmount;
                message = `🎡 *ROULETTE*\n\n⚫ Ball landed on: ${spin} ⚫\nYour bet: BLACK\n\n✅ You win!\n💰 Won: ${winAmount.toLocaleString()} ${currencySymbol} (1.8x)`;
            } else {
                economy[sender].balance -= amount;
                message = `🎡 *ROULETTE*\n\n🔴 Ball landed on: ${spin} 🔴\nYour bet: BLACK\n\n😫 Wrong color!\n💸 Lost: ${amount.toLocaleString()} ${currencySymbol}`;
            }
        } else if (betType === 'odd') {
            if (spin === 0) {
                economy[sender].balance -= amount;
                message = `🎡 *ROULETTE*\n\n🟢 Ball landed on: 0 🟢\nYour bet: ODD\n\n💀 GREEN ZERO!\n💸 Lost: ${amount.toLocaleString()} ${currencySymbol}`;
            } else if (isOdd) {
                winAmount = Math.floor(amount * 1.8);
                economy[sender].balance += winAmount;
                message = `🎡 *ROULETTE*\n\n${colorIcon} Ball landed on: ${spin} ${colorIcon}\nYour bet: ODD\n\n✅ You win!\n💰 Won: ${winAmount.toLocaleString()} ${currencySymbol} (1.8x)`;
            } else {
                economy[sender].balance -= amount;
                message = `🎡 *ROULETTE*\n\n${colorIcon} Ball landed on: ${spin} ${colorIcon}\nYour bet: ODD\n\n💀 Wrong!\n💸 Lost: ${amount.toLocaleString()} ${currencySymbol}`;
            }
        } else if (betType === 'even') {
            if (spin === 0) {
                economy[sender].balance -= amount;
                message = `🎡 *ROULETTE*\n\n🟢 Ball landed on: 0 🟢\nYour bet: EVEN\n\n💀 GREEN ZERO!\n💸 Lost: ${amount.toLocaleString()} ${currencySymbol}`;
            } else if (isEven) {
                winAmount = Math.floor(amount * 1.8);
                economy[sender].balance += winAmount;
                message = `🎡 *ROULETTE*\n\n${colorIcon} Ball landed on: ${spin} ${colorIcon}\nYour bet: EVEN\n\n✅ You win!\n💰 Won: ${winAmount.toLocaleString()} ${currencySymbol} (1.8x)`;
            } else {
                economy[sender].balance -= amount;
                message = `🎡 *ROULETTE*\n\n${colorIcon} Ball landed on: ${spin} ${colorIcon}\nYour bet: EVEN\n\n💀 Wrong!\n💸 Lost: ${amount.toLocaleString()} ${currencySymbol}`;
            }
        } else {
            return extra.reply(`❌ Invalid bet. Use: red, black, odd, even, or a number (0-36)`);
        }
        
        fs.writeFileSync(path, JSON.stringify(economy, null, 2));
        cooldowns.set(sender, Date.now());
        
        message += `\n\n💰 Balance: ${economy[sender].balance.toLocaleString()} ${currencySymbol}\n\n> ©POWERED BY NEXUS`;
        await extra.reply(message);
    }
};