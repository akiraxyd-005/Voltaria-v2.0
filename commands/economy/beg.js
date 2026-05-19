const fs = require('fs');
const path = './database/economy.json';
const cooldowns = new Map();
const currencySymbol = '𝑵̶';

module.exports = {
    name: 'beg',
    category: 'economy',
    description: 'Beg for money',
    usage: '§beg',
    async execute(sock, msg, args, extra) {
        const sender = extra.sender;
        const now = Date.now();
        const cooldownTime = 30 * 60 * 1000; // 30 minutes
        
        if (cooldowns.has(sender) && (now - cooldowns.get(sender)) < cooldownTime) {
            const remaining = Math.ceil((cooldownTime - (now - cooldowns.get(sender))) / 60000);
            return extra.reply(`⏰ *Beg on cooldown!*

You can beg again in ${remaining} minutes.

> ©POWERED BY NEXUS`);
        }
        
        let economy = {};
        if (fs.existsSync(path)) economy = JSON.parse(fs.readFileSync(path));
        
        if (!economy[sender]) {
            economy[sender] = { balance: 1000, bank: 0 };
        }
        
        const success = Math.random() < 0.7;
        
        if (success) {
            const amount = Math.floor(Math.random() * 200) + 20;
            economy[sender].balance += amount;
            await extra.reply(`🫴 *BEGGING* 🫴

🙏 A kind stranger gave you ${amount.toLocaleString()} ${currencySymbol}!

💰 Balance: ${economy[sender].balance.toLocaleString()} ${currencySymbol}

> ©POWERED BY NEXUS`);
        } else {
            await extra.reply(`🫴 *BEGGING* 🫴

You begged... got ignored. Try a job, loser. 📝

💰 Balance: ${economy[sender].balance.toLocaleString()} ${currencySymbol}

> ©POWERED BY NEXUS`);
        }
        
        cooldowns.set(sender, now);
        fs.writeFileSync(path, JSON.stringify(economy, null, 2));
    }
};