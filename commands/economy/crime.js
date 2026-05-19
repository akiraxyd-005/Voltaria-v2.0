const fs = require('fs');
const path = './database/economy.json';
const cooldowns = new Map();
const currencySymbol = '𝑵̶';

const crimes = [
    { name: '🏦 Bank Heist', minGain: 500, maxGain: 3000, successRate: 0.35, fine: 0.3 },
    { name: '💰 Pickpocket', minGain: 50, maxGain: 300, successRate: 0.65, fine: 0.2 },
    { name: '🚗 Car Theft', minGain: 300, maxGain: 1200, successRate: 0.45, fine: 0.25 },
    { name: '💎 Jewelry Heist', minGain: 800, maxGain: 4000, successRate: 0.25, fine: 0.35 },
    { name: '🏪 Store Robbery', minGain: 200, maxGain: 800, successRate: 0.55, fine: 0.2 },
    { name: '📱 Phone Snatching', minGain: 100, maxGain: 500, successRate: 0.6, fine: 0.15 },
    { name: '💳 Credit Card Fraud', minGain: 400, maxGain: 2000, successRate: 0.4, fine: 0.3 },
    { name: '🌿 Drug Dealing', minGain: 300, maxGain: 1500, successRate: 0.5, fine: 0.25 }
];

module.exports = {
    name: 'crime',
    aliases: ['heist'],
    category: 'economy',
    description: 'Commit a crime to earn money',
    usage: '§crime',
    async execute(sock, msg, args, extra) {
        const sender = extra.sender;
        const now = Date.now();
        const cooldownTime = 3 * 60 * 60 * 1000; // 3 hours
        
        if (cooldowns.has(sender) && (now - cooldowns.get(sender)) < cooldownTime) {
            const remaining = Math.ceil((cooldownTime - (now - cooldowns.get(sender))) / 3600000);
            return extra.reply(`⏰ *Crime on cooldown!*

You can commit another crime in ${remaining} hours.

> ©POWERED BY NEXUS`);
        }
        
        let economy = {};
        if (fs.existsSync(path)) economy = JSON.parse(fs.readFileSync(path));
        
        if (!economy[sender]) {
            economy[sender] = { balance: 1000, bank: 0 };
        }
        
        const crime = crimes[Math.floor(Math.random() * crimes.length)];
        const success = Math.random() < crime.successRate;
        
        let message = '';
        
        if (success) {
            const gain = Math.floor(Math.random() * (crime.maxGain - crime.minGain + 1) + crime.minGain);
            economy[sender].balance += gain;
            message = `🥷 *CRIME* 🥷

🏦 Crime: ${crime.name}
💰 Stole: +${gain.toLocaleString()} ${currencySymbol}

✅ SUCCESS!

💰 Balance: ${economy[sender].balance.toLocaleString()} ${currencySymbol}`;
        } else {
            const fine = Math.floor(gain * crime.fine);
            economy[sender].balance -= fine;
            message = `🥷 *CRIME* 🥷

🏦 Crime: ${crime.name}
💸 Fine: -${fine.toLocaleString()} ${currencySymbol}

❌ BUSTED! 🚔

💰 Balance: ${economy[sender].balance.toLocaleString()} ${currencySymbol}`;
        }
        
        cooldowns.set(sender, now);
        fs.writeFileSync(path, JSON.stringify(economy, null, 2));
        
        await extra.reply(`${message}\n\n> ©POWERED BY NEXUS`);
    }
};