const fs = require('fs');
const path = './database/economy.json';
const cooldowns = new Map();
const currencySymbol = '𝑵̶';

const fishList = [
    { name: '🐟 Common Fish', min: 10, max: 50, transport: 60, successRate: 0.9 },
    { name: '🐠 Tropical Fish', min: 50, max: 150, transport: 60, successRate: 0.7 },
    { name: '🐡 Pufferfish', min: 100, max: 200, transport: 60, successRate: 0.6 },
    { name: '🦈 Shark', min: 500, max: 1000, transport: 60, successRate: 0.4 },
    { name: '🐙 Octopus', min: 200, max: 400, transport: 60, successRate: 0.55 },
    { name: '🦀 Crab', min: 80, max: 180, transport: 60, successRate: 0.75 },
    { name: '👑 Golden Fish', min: 2000, max: 5000, transport: 60, successRate: 0.15 },
    { name: '🪙 Treasure Chest', min: 1000, max: 3000, transport: 60, successRate: 0.2 }
];

module.exports = {
    name: 'fish',
    category: 'economy',
    description: 'Go fishing to earn money',
    usage: '§fish',
    async execute(sock, msg, args, extra) {
        const sender = extra.sender;
        const now = Date.now();
        const cooldownTime = 45 * 60 * 1000; // 45 minutes
        
        if (cooldowns.has(sender) && (now - cooldowns.get(sender)) < cooldownTime) {
            const remaining = Math.ceil((cooldownTime - (now - cooldowns.get(sender))) / 60000);
            return extra.reply(`⏰ *Fishing on cooldown!*

You can fish again in ${remaining} minutes.

> ©POWERED BY NEXUS`);
        }
        
        let economy = {};
        if (fs.existsSync(path)) economy = JSON.parse(fs.readFileSync(path));
        
        if (!economy[sender]) {
            economy[sender] = { balance: 1000, bank: 0 };
        }
        
        // Check transport fee
        if (economy[sender].balance < 60) {
            return extra.reply(`⛽ *NO FUEL!*

You need ${currencySymbol} 60 for boat fuel!

💰 Balance: ${economy[sender].balance.toLocaleString()} ${currencySymbol}`);
        }
        
        const fish = fishList[Math.floor(Math.random() * fishList.length)];
        const success = Math.random() < fish.successRate;
        
        if (success) {
            const value = Math.floor(Math.random() * (fish.max - fish.min + 1) + fish.min);
            const net = value - fish.transport;
            economy[sender].balance += net;
            
            await extra.reply(`🎣 *FISHING* 🎣

🪙 You caught a ${fish.name}!
💰 Sold: ${value.toLocaleString()} ${currencySymbol}
⛽ Boat Fuel: -${fish.transport} ${currencySymbol}
💵 Net: ${net.toLocaleString()} ${currencySymbol}

💰 Balance: ${economy[sender].balance.toLocaleString()} ${currencySymbol}

> ©POWERED BY NEXUS`);
        } else {
            economy[sender].balance -= fish.transport;
            await extra.reply(`🎣 *FISHING* 🎣

You caught an old boot. The fish are pointing. 🐟☝️

💸 Lost: ${fish.transport} ${currencySymbol}

💰 Balance: ${economy[sender].balance.toLocaleString()} ${currencySymbol}

> ©POWERED BY NEXUS`);
        }
        
        cooldowns.set(sender, now);
        fs.writeFileSync(path, JSON.stringify(economy, null, 2));
    }
};