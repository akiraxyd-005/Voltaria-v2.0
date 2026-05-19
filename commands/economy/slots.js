const fs = require('fs');
const path = './database/economy.json';
const cooldowns = new Map();
const currencySymbol = '𝑵̶';

const slotIcons = ['🍒', '🍊', '🍋', '🍇', '7️⃣', '💎', '🔔', '🍀'];
const payouts = {
    '💎💎💎': 10,
    '777': 5,
    '🍒🍒🍒': 3,
    '🍊🍊🍊': 2.5,
    '🍋🍋🍋': 2,
    '🍇🍇🍇': 2,
    '🔔🔔🔔': 2.5,
    '🍀🍀🍀': 2
};

module.exports = {
    name: 'slots',
    aliases: ['slot'],
    category: 'economy',
    description: 'Spin the slot machine',
    usage: '§slots <amount>',
    async execute(sock, msg, args, extra) {
        const sender = extra.sender;
        const amount = parseInt(args[0]);
        
        if (cooldowns.has(sender) && Date.now() - cooldowns.get(sender) < 60000) {
            const remaining = Math.ceil((60000 - (Date.now() - cooldowns.get(sender))) / 1000);
            return extra.reply(`⏳ Slow down! Next spin in ${remaining}s`);
        }
        
        if (!amount || isNaN(amount) || amount < 10) {
            return extra.reply(`❌ Enter a valid amount (minimum 10 ${currencySymbol})\n\nUsage: §slots 100`);
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
        
        const reel1 = slotIcons[Math.floor(Math.random() * slotIcons.length)];
        const reel2 = slotIcons[Math.floor(Math.random() * slotIcons.length)];
        const reel3 = slotIcons[Math.floor(Math.random() * slotIcons.length)];
        
        const combination = reel1 + reel2 + reel3;
        const multiplier = payouts[combination] || 0;
        const isJackpot = reel1 === '💎' && reel2 === '💎' && reel3 === '💎';
        
        let winAmount = 0;
        let message = '';
        
        const slotDisplay = `
╔═══════════╗
║ ${reel1} │ ${reel2} │ ${reel3} ║ ◄
║ ${slotIcons[Math.floor(Math.random() * slotIcons.length)]} │ ${slotIcons[Math.floor(Math.random() * slotIcons.length)]} │ ${slotIcons[Math.floor(Math.random() * slotIcons.length)]} ║
║ ${slotIcons[Math.floor(Math.random() * slotIcons.length)]} │ ${slotIcons[Math.floor(Math.random() * slotIcons.length)]} │ ${slotIcons[Math.floor(Math.random() * slotIcons.length)]} ║
╚═══════════╝`;
        
        if (isJackpot) {
            winAmount = amount * 10;
            economy[sender].balance += winAmount;
            message = `🎰 *SLOT MACHINE*${slotDisplay}\n\n🌟 DIAMOND JACKPOT! 🌟\n💰 Won: ${winAmount.toLocaleString()} ${currencySymbol} (10x)`;
        } else if (multiplier > 0) {
            winAmount = Math.floor(amount * multiplier);
            economy[sender].balance += winAmount;
            let winText = multiplier >= 5 ? '🎉 BIG WIN! 🎉' : (multiplier >= 3 ? '🎯 NICE! 🎯' : '✅ You win!');
            message = `🎰 *SLOT MACHINE*${slotDisplay}\n\n${winText}\n💰 Won: ${winAmount.toLocaleString()} ${currencySymbol} (${multiplier}x)`;
        } else {
            economy[sender].balance -= amount;
            if (reel1 === reel2 || reel2 === reel3 || reel1 === reel3) {
                message = `🎰 *SLOT MACHINE*${slotDisplay}\n\n😫 SO CLOSE! Two matching!\n💸 Lost: ${amount.toLocaleString()} ${currencySymbol}`;
            } else if (reel1 === '7️⃣' || reel2 === '7️⃣' || reel3 === '7️⃣') {
                message = `🎰 *SLOT MACHINE*${slotDisplay}\n\n😭 Almost had a 7!\n💸 Lost: ${amount.toLocaleString()} ${currencySymbol}`;
            } else {
                message = `🎰 *SLOT MACHINE*${slotDisplay}\n\n💀 Nothing matches. RNG hates you.\n💸 Lost: ${amount.toLocaleString()} ${currencySymbol}`;
            }
        }
        
        fs.writeFileSync(path, JSON.stringify(economy, null, 2));
        cooldowns.set(sender, Date.now());
        
        message += `\n\n💰 Balance: ${economy[sender].balance.toLocaleString()} ${currencySymbol}\n\n> ©POWERED BY NEXUS`;
        await extra.reply(message);
    }
};