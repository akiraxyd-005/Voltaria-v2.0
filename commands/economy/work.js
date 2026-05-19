const fs = require('fs');
const path = './database/economy.json';
const cooldowns = new Map();
const currencySymbol = '𝑵̶';

const jobs = [
    { name: '💻 Programmer', minPay: 200, maxPay: 800, transport: 150 },
    { name: '📝 Writer', minPay: 150, maxPay: 600, transport: 150 },
    { name: '🎨 Artist', minPay: 180, maxPay: 700, transport: 150 },
    { name: '🍕 Delivery Driver', minPay: 100, maxPay: 400, transport: 150 },
    { name: '📚 Teacher', minPay: 250, maxPay: 900, transport: 150 },
    { name: '🔧 Mechanic', minPay: 200, maxPay: 750, transport: 150 },
    { name: '🏪 Cashier', minPay: 120, maxPay: 450, transport: 150 },
    { name: '☕ Barista', minPay: 100, maxPay: 350, transport: 150 },
    { name: '💪 Personal Trainer', minPay: 300, maxPay: 1000, transport: 150 },
    { name: '🎵 Musician', minPay: 250, maxPay: 800, transport: 150 }
];

module.exports = {
    name: 'work',
    category: 'economy',
    description: 'Work to earn money',
    usage: '§work',
    async execute(sock, msg, args, extra) {
        const sender = extra.sender;
        const now = Date.now();
        const cooldownTime = 60 * 60 * 1000; // 1 hour
        
        if (cooldowns.has(sender) && (now - cooldowns.get(sender)) < cooldownTime) {
            const remaining = Math.ceil((cooldownTime - (now - cooldowns.get(sender))) / 60000);
            return extra.reply(`⏰ *Work on cooldown!*

You can work again in ${remaining} minutes.

> ©POWERED BY NEXUS`);
        }
        
        let economy = {};
        if (fs.existsSync(path)) economy = JSON.parse(fs.readFileSync(path));
        
        if (!economy[sender]) {
            economy[sender] = { balance: 1000, bank: 0 };
        }
        
        // Check transport fee
        if (economy[sender].balance < 150) {
            return extra.reply(`⛽ *NO FUEL!*

You need ${currencySymbol} 150 for transport to get to work!

💰 Balance: ${economy[sender].balance.toLocaleString()} ${currencySymbol}`);
        }
        
        const job = jobs[Math.floor(Math.random() * jobs.length)];
        const gross = Math.floor(Math.random() * (job.maxPay - job.minPay + 1) + job.minPay);
        const net = gross - job.transport;
        
        economy[sender].balance += net;
        
        cooldowns.set(sender, now);
        fs.writeFileSync(path, JSON.stringify(economy, null, 2));
        
        await extra.reply(`💼 *WORK* 💼

🩺 Job: ${job.name}
💰 Gross: ${gross.toLocaleString()} ${currencySymbol}
⛽ Transport: -${job.transport} ${currencySymbol}
💵 Net: ${net.toLocaleString()} ${currencySymbol}

💰 Balance: ${economy[sender].balance.toLocaleString()} ${currencySymbol}

> ©POWERED BY NEXUS`);
    }
};