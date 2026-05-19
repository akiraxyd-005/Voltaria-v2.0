const fs = require('fs');
const path = './database/economy.json';
const currencySymbol = '𝑵̶';

module.exports = {
    name: 'pay',
    aliases: ['transfer', 'send'],
    category: 'economy',
    description: 'Send money to another user',
    usage: '§pay @user <amount>',
    isGroup: true,
    async execute(sock, msg, args, extra) {
        const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;
        const amount = parseInt(args[1]);
        
        if (!mentioned || mentioned.length === 0) {
            return extra.reply(`❌ *Usage:* §pay @user <amount>

Example: §pay @John 1000`);
        }
        
        if (!amount || isNaN(amount) || amount < 10) {
            return extra.reply(`❌ Enter a valid amount (minimum 10 ${currencySymbol})`);
        }
        
        const sender = extra.sender;
        const receiver = mentioned[0];
        
        if (sender === receiver) {
            return extra.reply(`❌ You cannot send money to yourself!`);
        }
        
        let economy = {};
        if (fs.existsSync(path)) economy = JSON.parse(fs.readFileSync(path));
        
        if (!economy[sender]) {
            economy[sender] = { balance: 1000, bank: 0 };
        }
        if (!economy[receiver]) {
            economy[receiver] = { balance: 1000, bank: 0 };
        }
        
        if (economy[sender].balance < amount) {
            return extra.reply(`❌ Insufficient funds!

You have: ${economy[sender].balance.toLocaleString()} ${currencySymbol}
You want to send: ${amount.toLocaleString()} ${currencySymbol}`);
        }
        
        economy[sender].balance -= amount;
        economy[receiver].balance += amount;
        
        fs.writeFileSync(path, JSON.stringify(economy, null, 2));
        
        await sock.sendMessage(extra.from, {
            text: `💸 *TRANSFER* 💸

@${sender.split('@')[0]} sent @${receiver.split('@')[0]}:

💰 ${amount.toLocaleString()} ${currencySymbol}

💵 Sender's new balance: ${economy[sender].balance.toLocaleString()} ${currencySymbol}
💵 Receiver's new balance: ${economy[receiver].balance.toLocaleString()} ${currencySymbol}

> ©POWERED BY NEXUS`,
            mentions: [sender, receiver]
        }, { quoted: msg });
    }
};