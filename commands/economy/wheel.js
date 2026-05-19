const fs = require('fs');
const path = './database/economy.json';
const cooldowns = new Map();
const currencySymbol = '𝑵̶';

const wheelSectors = [
    { name: '💀 LOSE ALL', multiplier: 0, chance: 0.15 },
    { name: '😢', multiplier: 0.3, chance: 0.15 },
    { name: '🙂', multiplier: 0.7, chance: 0.15 },
    { name: '😊', multiplier: 1.2, chance: 0.15 },
    { name: '😄', multiplier: 1.5, chance: 0.15 },
    { name: '🤩', multiplier: 2, chance: 0.1 },
    { name: '🔥', multiplier: 3, chance: 0.08 },
    { name: '🌟', multiplier: 5, chance: 0.05 },
    { name: '🍀', multiplier: 10, chance: 0.02 }
];

module.exports = {
    name: 'wheel',
    category: 'economy',
    description: 'Spin the fortune wheel',
    usage: '§wheel <amount>',
    async execute(sock, msg, args, extra) {
        const sender = extra.sender;
        const amount = parseInt(args[0]);
        
        if (cooldowns.has(sender) && Date.now() - cooldowns.get(sender) < 120000) {
            const remaining = Math.ceil((120000 - (Date.now() - cooldowns.get(sender))) / 1000);
            return extra.reply(`⏳ Slow down! Next spin in ${remaining}s`);
        }
        
        if (!amount || isNaN(amount) || amount < 10) {
            return extra.reply(`❌ Enter a valid amount (minimum 10 ${currencySymbol})\n\nUsage: §wheel 100`);
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
        
        let random = Math.random();
        let cumulative = 0;
        let selected = wheelSectors[0];
        
        for (const sector of wheelSectors) {
            cumulative += sector.chance;
            if (random < cumulative) {
                selected = sector;
                break;
            }
        }
        
        let winAmount = 0;
        let message = '';
        
        const wheelDisplay = `
  💀 LOSE ALL
  😢 x0.3
  🙂 x0.7
  😊 x1.2
  😄 x1.5
  🤩 x2
  🔥 x3
  🌟 x5
▶️ *${selected.name} x${selected.multiplier}* ◀️`;
        
        if (selected.multiplier === 0) {
            economy[sender].balance -= amount;
            message = `🎡 *FORTUNE WHEEL*${wheelDisplay}\n\n🎯 Landed on: ${selected.name} x${selected.multiplier}\n\n💀 YOU LOSE EVERYTHING!\n💸 Lost: ${amount.toLocaleString()} ${currencySymbol}`;
        } else {
            winAmount = Math.floor(amount * selected.multiplier);
            economy[sender].balance += winAmount;
            let winText = selected.multiplier >= 5 ? '🌟 JACKPOT! 🌟' : (selected.multiplier >= 3 ? '🎉 BIG WIN! 🎉' : '✅ You win!');
            message = `🎡 *FORTUNE WHEEL*${wheelDisplay}\n\n🎯 Landed on: ${selected.name} x${selected.multiplier}\n\n${winText}\n💰 Won: ${winAmount.toLocaleString()} ${currencySymbol} (${selected.multiplier}x)`;
        }
        
        fs.writeFileSync(path, JSON.stringify(economy, null, 2));
        cooldowns.set(sender, Date.now());
        
        message += `\n\n💰 Balance: ${economy[sender].balance.toLocaleString()} ${currencySymbol}\n\n> ©POWERED BY NEXUS`;
        await extra.reply(message);
    }
};