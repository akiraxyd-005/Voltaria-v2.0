const fs = require('fs');
const path = './database/economy.json';
const currencySymbol = '𝑵̶';

module.exports = {
    name: 'bankbal',
    aliases: ['bank'],
    category: 'economy',
    description: 'Check your bank balance',
    usage: '§bankbal',
    async execute(sock, msg, args, extra) {
        const sender = extra.sender;
        
        let economy = {};
        if (fs.existsSync(path)) economy = JSON.parse(fs.readFileSync(path));
        
        if (!economy[sender]) {
            economy[sender] = { balance: 1000, bank: 0 };
            fs.writeFileSync(path, JSON.stringify(economy, null, 2));
        }
        
        const interest = Math.floor(economy[sender].bank * 0.02);
        
        await extra.reply(`🏦 *BANK ACCOUNT*

💰 Balance: ${economy[sender].bank.toLocaleString()} ${currencySymbol}
📈 Interest Rate: 2.0% per 12h
💵 Next Interest: ~${interest.toLocaleString()} ${currencySymbol}

━━━━━━━━━━━━━━━━━━━━
💡 Deposit ${currencySymbol} to earn passive interest!
🔒 Bank balance is protected from robbery!

> ©POWERED BY NEXUS`);
    }
};