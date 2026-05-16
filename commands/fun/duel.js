const fs = require('fs');
const duelsPath = './database/duels.json';
const economyPath = './database/economy.json';
const currencySymbol = '𝑵̶';

module.exports = {
    name: 'duel',
    category: 'fun',
    description: 'Duel someone for Nex',
    usage: '§duel @user <amount>',
    async execute(sock, msg, args, extra) {
        const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;
        
        if (!mentioned || mentioned.length === 0) {
            return extra.reply('❌ Mention someone to duel!\nUsage: *§duel @user 500*');
        }
        
        const target = mentioned[0];
        const amount = parseInt(args[1]);
        
        if (!amount || isNaN(amount) || amount <= 0) {
            return extra.reply(`❌ Enter a valid amount of ${currencySymbol} Nex to duel for!\nUsage: *§duel @user 500*`);
        }
        
        if (target === extra.sender) {
            return extra.reply('❌ You cannot duel yourself!');
        }
        
        // Check if user has enough money
        let economy = {};
        if (fs.existsSync(economyPath)) economy = JSON.parse(fs.readFileSync(economyPath));
        
        const userMoney = economy[extra.sender]?.balance || 0;
        
        if (userMoney < amount) {
            return extra.reply(`❌ You don't have enough ${currencySymbol} Nex!\nYou have: ${currencySymbol} ${userMoney.toLocaleString()}\nDuel amount: ${currencySymbol} ${amount.toLocaleString()}`);
        }
        
        let duels = {};
        if (fs.existsSync(duelsPath)) duels = JSON.parse(fs.readFileSync(duelsPath));
        
        duels[Date.now()] = {
            from: extra.sender,
            to: target,
            amount: amount,
            status: 'pending',
            time: Date.now(),
            expires: Date.now() + 300000 // 5 minutes
        };
        
        fs.writeFileSync(duelsPath, JSON.stringify(duels, null, 2));
        
        await sock.sendMessage(extra.from, {
            text: `⚔️ *DUEL CHALLENGE* ⚔️\n\n@${extra.sender.split('@')[0]} has challenged @${target.split('@')[0]} to a duel for *${currencySymbol} ${amount.toLocaleString()} Nex*!\n\nType *§acceptduel* to accept the challenge!\n💀 Refusing means forfeiting the amount!`,
            mentions: [extra.sender, target]
        }, { quoted: msg });
    }
};