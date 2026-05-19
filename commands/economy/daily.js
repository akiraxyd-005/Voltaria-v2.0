const fs = require('fs');
const path = './database/economy.json';
const currencySymbol = '𝑵̶';

module.exports = {
    name: 'daily',
    aliases: ['claim'],
    category: 'economy',
    description: 'Claim your daily reward',
    usage: '§daily',
    async execute(sock, msg, args, extra) {
        const sender = extra.sender;
        const now = Date.now();
        const oneDay = 24 * 60 * 60 * 1000;
        
        let economy = {};
        if (fs.existsSync(path)) economy = JSON.parse(fs.readFileSync(path));
        
        if (!economy[sender]) {
            economy[sender] = { balance: 1000, bank: 0, lastDaily: 0, dailyStreak: 0 };
        }
        
        const userData = economy[sender];
        
        if (userData.lastDaily && (now - userData.lastDaily) < oneDay) {
            const remaining = oneDay - (now - userData.lastDaily);
            const hours = Math.floor(remaining / (60 * 60 * 1000));
            const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));
            return extra.reply(`⏰ *Daily reward already claimed!*

Next claim in: ${hours}h ${minutes}m

> ©POWERED BY NEXUS`);
        }
        
        let reward = 1000;
        let streak = (userData.dailyStreak || 0) + 1;
        let streakBonus = 0;
        
        if (streak > 1) {
            streakBonus = Math.floor(reward * (streak * 0.05));
            reward += streakBonus;
        }
        
        userData.balance += reward;
        userData.lastDaily = now;
        userData.dailyStreak = streak;
        
        fs.writeFileSync(path, JSON.stringify(economy, null, 2));
        
        await extra.reply(`🎁 *DAILY REWARD!*

💰 Reward: +${reward.toLocaleString()} ${currencySymbol}
🔥 Streak: ${streak} days (+${streakBonus.toLocaleString()} ${currencySymbol})

💵 New Balance: ${userData.balance.toLocaleString()} ${currencySymbol}

> ©POWERED BY NEXUS`);
    }
};