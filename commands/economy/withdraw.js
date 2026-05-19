const fs = require('fs');
const path = './database/economy.json';
const currencySymbol = '𝑵̶';

module.exports = {
    name: 'withdraw',
    aliases: ['with'],
    category: 'economy',
    description: 'Withdraw money from your bank',
    usage: '§withdraw <amount>',
    async execute(sock, msg, args, extra) {
        const sender = extra.sender;
        let amount = args[0]?.toLowerCase();
        
        let economy = {};
        if (fs.existsSync(path)) economy = JSON.parse(fs.readFileSync(path));
        
        if (!economy[sender]) {
            economy[sender] = { balance: 1000, bank: 0 };
            fs.writeFileSync(path, JSON.stringify(economy, null, 2));
        }
        
        if (amount === 'all') {
            amount = economy[sender].bank;
        } else {
            amount = parseInt(amount);
        }
        
        if (isNaN(amount) || amount <= 0) {
            return extra.reply(`❌ Enter a valid amount\n\nUsage: §withdraw <amount> or §withdraw all`);
        }
        
        if (amount > economy[sender].bank) {
            return extra.reply(`❌ Insufficient bank funds!\n\nYou have: ${economy[sender].bank.toLocaleString()} ${currencySymbol}`);
        }
        
        economy[sender].bank -= amount;
        economy[sender].balance += amount;
        
        fs.writeFileSync(path, JSON.stringify(economy, null, 2));
        
        await extra.reply(`🏦 *WITHDRAWAL*

💰 Withdrew: ${amount.toLocaleString()} ${currencySymbol}
💵 Wallet: ${economy[sender].balance.toLocaleString()} ${currencySymbol}
🏦 Bank: ${economy[sender].bank.toLocaleString()} ${currencySymbol}

> ©POWERED BY NEXUS`);
    }
};