const fs = require('fs');
const path = './database/economy.json';
const cooldowns = new Map();
const currencySymbol = '𝑵̶';

module.exports = {
    name: 'rob',
    category: 'economy',
    description: 'Rob another user',
    usage: '§rob @user',
    isGroup: true,
    async execute(sock, msg, args, extra) {
        const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;
        
        if (!mentioned || mentioned.length === 0) {
            return extra.reply(`❌ *Usage:* §rob @user`);
        }
        
        const sender = extra.sender;
        const victim = mentioned[0];
        const now = Date.now();
        const cooldownTime = 2 * 60 * 60 * 1000; // 2 hours
        
        if (sender === victim) {
            return extra.reply(`❌ You cannot rob yourself!`);
        }
        
        if (cooldowns.has(sender) && (now - cooldowns.get(sender)) < cooldownTime) {
            const remaining = Math.ceil((cooldownTime - (now - cooldowns.get(sender))) / 3600000);
            return extra.reply(`⏰ *Robbery on cooldown!*

You can rob again in ${remaining} hours.

> ©POWERED BY NEXUS`);
        }
        
        let economy = {};
        if (fs.existsSync(path)) economy = JSON.parse(fs.readFileSync(path));
        
        if (!economy[sender]) {
            economy[sender] = { balance: 1000, bank: 0 };
        }
        if (!economy[victim]) {
            economy[victim] = { balance: 1000, bank: 0 };
        }
        
        const victimBalance = economy[victim].balance;
        
        if (victimBalance < 100) {
            return extra.reply(`❌ @${victim.split('@')[0]} is too poor to rob! They only have ${victimBalance.toLocaleString()} ${currencySymbol}`);
        }
        
        const success = Math.random() < 0.4;
        
        if (success) {
            const stolen = Math.min(Math.floor(victimBalance * 0.3), 5000);
            economy[sender].balance += stolen;
            economy[victim].balance -= stolen;
            
            await sock.sendMessage(extra.from, {
                text: `🔫 *ROBBERY* 🔫

@${sender.split('@')[0]} successfully robbed @${victim.split('@')[0]}!

💰 Stolen: ${stolen.toLocaleString()} ${currencySymbol}

💵 Robber's balance: ${economy[sender].balance.toLocaleString()} ${currencySymbol}
💵 Victim's balance: ${economy[victim].balance.toLocaleString()} ${currencySymbol}

> ©POWERED BY NEXUS`,
                mentions: [sender, victim]
            }, { quoted: msg });
        } else {
            const penalty = Math.min(500, economy[sender].balance);
            economy[sender].balance -= penalty;
            
            await sock.sendMessage(extra.from, {
                text: `🔫 *ROBBERY* 🔫

@${sender.split('@')[0]} tried to rob @${victim.split('@')[0]}... but got caught! 🚔

💸 Fine: ${penalty.toLocaleString()} ${currencySymbol}

💵 Balance: ${economy[sender].balance.toLocaleString()} ${currencySymbol}

> ©POWERED BY NEXUS`,
                mentions: [sender, victim]
            }, { quoted: msg });
        }
        
        cooldowns.set(sender, now);
        fs.writeFileSync(path, JSON.stringify(economy, null, 2));
    }
};