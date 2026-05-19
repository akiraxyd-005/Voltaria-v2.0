const fs = require('fs');
const path = './database/economy.json';
const currencySymbol = '𝑵̶';

module.exports = {
    name: 'deposit',
    aliases: ['dep'],
    category: 'economy',
    description: 'Deposit money to your bank',
    usage: '§deposit <amount>',
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
            amount = economy[sender].balance;
        } else {
            amount = parseInt(amount);
        }
        
        if (isNaN(amount) || amount <= 0) {
            return extra.reply(`❌ Enter a valid amount\n\nUsage: §deposit <amount> or §deposit all`);
        }
        
        if (amount > economy[sender].balance) {
            return extra.reply(`❌ Insufficient funds!\n\nYou have: ${economy[sender].balance.toLocaleString()} ${currencySymbol}`);
        }
        
        economy[sender].balance -= amount;
        economy[sender].bank += amount;
        
        fs.writeFileSync(path, JSON.stringify(economy, null, 2));
        
        await extra.reply(`🏦 *DEPOSIT*

💰 Deposited: ${amount.toLocaleString()} ${currencySymbol}
💵 Wallet: ${economy[sender].balance.toLocaleString()} ${currencySymbol}
🏦 Bank: ${economy[sender].bank.toLocaleString()} ${currencySymbol}

> ©POWERED BY NEXUS`);
    }
};