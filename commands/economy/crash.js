const fs = require('fs');
const path = './database/economy.json';
const cooldowns = new Map();
const activeGames = new Map();
const currencySymbol = '𝑵̶';

module.exports = {
    name: 'crash',
    category: 'economy',
    description: 'Bet on a multiplier and cash out before it crashes',
    usage: '§crash <amount>',
    async execute(sock, msg, args, extra) {
        const sender = extra.sender;
        const amount = parseInt(args[0]);
        
        if (cooldowns.has(sender) && Date.now() - cooldowns.get(sender) < 60000) {
            const remaining = Math.ceil((60000 - (Date.now() - cooldowns.get(sender))) / 1000);
            return extra.reply(`⏳ Slow down! Next crash game in ${remaining}s`);
        }
        
        if (!amount || isNaN(amount) || amount < 10) {
            return extra.reply(`❌ Enter a valid amount (minimum 10 ${currencySymbol})\n\nUsage: §crash 100`);
        }
        
        let economy = {};
        if (fs.existsSync(path)) economy = JSON.parse(fs.readFileSync(path));
        
        if (!economy[sender]) {
            economy[sender] = { balance: 1000, bank: 0 };
            fs.writeFileSync(path, JSON.stringify(economy, null, 2));
        }
        
        if (economy[sender].balance < amount) {
            return extra.reply(`❌ You don't have enough ${currencySymbol}!\n💰 Balance: ${economy[sender].balance.toLocaleString()} ${currencySymbol}`);
        }
        
        if (activeGames.has(sender)) {
            return extra.reply(`❌ You already have an active crash game! Use §cashout to cash out.`);
        }
        
        economy[sender].balance -= amount;
        fs.writeFileSync(path, JSON.stringify(economy, null, 2));
        
        const crashPoint = (Math.random() * 9 + 1.1).toFixed(2);
        let currentMultiplier = 1.0;
        let crashed = false;
        
        activeGames.set(sender, {
            bet: amount,
            crashPoint: parseFloat(crashPoint),
            cashedOut: false,
            startTime: Date.now()
        });
        
        const sendUpdate = async () => {
            if (crashed) return;
            
            const game = activeGames.get(sender);
            if (!game || game.cashedOut) return;
            
            if (currentMultiplier >= game.crashPoint) {
                crashed = true;
                activeGames.delete(sender);
                cooldowns.set(sender, Date.now());
                
                await sock.sendMessage(extra.from, {
                    text: `🚀 *CRASH*\n\n📈 Crashed at: ${game.crashPoint}x\n💀 You didn't cash out!\n\n💸 Lost: ${game.bet.toLocaleString()} ${currencySymbol}\n💰 Balance: ${economy[sender].balance.toLocaleString()} ${currencySymbol}\n\n> ©POWERED BY NEXUS`
                }, { quoted: msg });
                return;
            }
            
            currentMultiplier = Math.min(currentMultiplier + 0.05, game.crashPoint);
            setTimeout(sendUpdate, 500);
        };
        
        sendUpdate();
        
        await extra.reply(`🚀 *CRASH*\n\n📈 Current multiplier: ${currentMultiplier.toFixed(2)}x\n💰 Bet: ${amount.toLocaleString()} ${currencySymbol}\n\nType §cashout to cash out!\n\n> ©POWERED BY NEXUS`);
        
        setTimeout(() => {
            if (activeGames.has(sender)) {
                const game = activeGames.get(sender);
                if (!game.cashedOut) {
                    activeGames.delete(sender);
                }
            }
        }, 60000);
    }
};