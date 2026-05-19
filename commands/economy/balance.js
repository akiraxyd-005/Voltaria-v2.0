const fs = require('fs');
const path = './database/economy.json';
const currencySymbol = '𝑵̶';

module.exports = {
    name: 'balance',
    aliases: ['bal', 'money', 'cash'],
    category: 'economy',
    description: 'Check your balance',
    usage: '§balance',
    async execute(sock, msg, args, extra) {
        const sender = extra.sender;
        let economy = {};
        if (fs.existsSync(path)) economy = JSON.parse(fs.readFileSync(path));
        
        if (!economy[sender]) {
            economy[sender] = { balance: 1000, bank: 0, lastDaily: 0, dailyStreak: 0 };
            fs.writeFileSync(path, JSON.stringify(economy, null, 2));
        }
        
        const userData = economy[sender];
        const total = userData.balance + userData.bank;
        
        await extra.reply(`┏━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  💰 *BALANCE* 💰
┗━━━━━━━━━━━━━━━━━━━━━━━━┛

💵 *Wallet:* ${userData.balance.toLocaleString()} ${currencySymbol}
🏦 *Bank:* ${userData.bank.toLocaleString()} ${currencySymbol}
⚡ *Total:* ${total.toLocaleString()} ${currencySymbol}

━━━━━━━━━━━━━━━━━━━━━━━━━━
> ©POWERED BY NEXUS`);
    }
};