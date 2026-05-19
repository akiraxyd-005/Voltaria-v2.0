const fs = require('fs');
const path = './database/economy.json';
const cooldowns = new Map();
const currencySymbol = '𝑵̶';

const animals = [
    { name: '🐇 Rabbit', min: 30, max: 100, successRate: 0.85, transport: 100 },
    { name: '🦊 Fox', min: 100, max: 250, successRate: 0.7, transport: 100 },
    { name: '🦌 Deer', min: 200, max: 400, successRate: 0.6, transport: 100 },
    { name: '🐗 Boar', min: 250, max: 500, successRate: 0.55, transport: 100 },
    { name: '🐺 Wolf', min: 300, max: 600, successRate: 0.5, transport: 100 },
    { name: '🐻 Bear', min: 500, max: 1000, successRate: 0.4, transport: 100 },
    { name: '🦁 Lion', min: 800, max: 1500, successRate: 0.3, transport: 100 }
];

module.exports = {
    name: 'hunt',
    category: 'economy',
    description: 'Go hunting to earn money',
    usage: '§hunt',
    async execute(sock, msg, args, extra) {
        const sender = extra.sender;
        const now = Date.now();
        const cooldownTime = 60 * 60 * 1000; // 1 hour
        
        if (cooldowns.has(sender) && (now - cooldowns.get(sender)) < cooldownTime) {
            const remaining = Math.ceil((cooldownTime - (now - cooldowns.get(sender))) / 60000);
            return extra.reply(`⏰ *Hunting on cooldown!*

You can hunt again in ${remaining} minutes.

> ©POWERED BY NEXUS`);
        }
        
        let economy = {};
        if (fs.existsSync(path)) economy = JSON.parse(fs.readFileSync(path));
        
        if (!economy[sender]) {
            economy[sender] = { balance: 1000, bank: 0 };
        }
        
        // Check transport fee
        if (economy[sender].balance < 100) {
            return extra.reply(`⛽ *NO FUEL!*

You need ${currencySymbol} 100 for hunting supplies!

💰 Balance: ${economy[sender].balance.toLocaleString()} ${currencySymbol}`);
        }
        
        const animal = animals[Math.floor(Math.random() * animals.length)];
        const success = Math.random() < animal.successRate;
        
        if (success) {
            const value = Math.floor(Math.random() * (animal.max - animal.min + 1) + animal.min);
            const net = value - animal.transport;
            economy[sender].balance += net;
            
            await extra.reply(`🏹 *HUNTING* 🏹

🐗 You caught a ${animal.name}!
💰 Sold: ${value.toLocaleString()} ${currencySymbol}
⛽ Supplies: -${animal.transport} ${currencySymbol}
💵 Net: ${net.toLocaleString()} ${currencySymbol}

💰 Balance: ${economy[sender].balance.toLocaleString()} ${currencySymbol}

> ©POWERED BY NEXUS`);
        } else {
            economy[sender].balance -= animal.transport;
            await extra.reply(`🏹 *HUNTING* 🏹

You tried to hunt a deer... it hunted your dignity instead. 🦌

💸 Lost: ${animal.transport} ${currencySymbol}

💰 Balance: ${economy[sender].balance.toLocaleString()} ${currencySymbol}

> ©POWERED BY NEXUS`);
        }
        
        cooldowns.set(sender, now);
        fs.writeFileSync(path, JSON.stringify(economy, null, 2));
    }
};