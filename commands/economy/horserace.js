const fs = require('fs');
const path = './database/economy.json';
const cooldowns = new Map();
const currencySymbol = '𝑵̶';

const horses = [
    { name: '🏇 Thunder', odds: 5, speed: 0.2 },
    { name: '🏇 Lightning', odds: 4, speed: 0.25 },
    { name: '🏇 Storm', odds: 3, speed: 0.3 },
    { name: '🏇 Shadow', odds: 2, speed: 0.4 },
    { name: '🏇 Spirit', odds: 1.5, speed: 0.5 }
];

module.exports = {
    name: 'horserace',
    aliases: ['horses'],
    category: 'economy',
    description: 'Bet on a horse race',
    usage: '§horserace <horse 1-5> <amount>',
    async execute(sock, msg, args, extra) {
        const sender = extra.sender;
        const horseNum = parseInt(args[0]) - 1;
        const amount = parseInt(args[1]);
        
        if (cooldowns.has(sender) && Date.now() - cooldowns.get(sender) < 120000) {
            const remaining = Math.ceil((120000 - (Date.now() - cooldowns.get(sender))) / 1000);
            return extra.reply(`⏳ Slow down! Next race in ${remaining}s`);
        }
        
        if (isNaN(horseNum) || horseNum < 0 || horseNum > 4) {
            return extra.reply(`❌ Pick a horse (1-5)\n\nUsage: §horserace <1-5> <amount>`);
        }
        
        if (!amount || isNaN(amount) || amount < 10) {
            return extra.reply(`❌ Enter a valid amount (minimum 10 ${currencySymbol})`);
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
        
        // Simulate race
        const raceResults = horses.map(h => ({
            name: h.name,
            progress: Math.random() * h.speed
        }));
        
        raceResults.sort((a, b) => b.progress - a.progress);
        const winner = raceResults[0];
        const winnerIndex = horses.findIndex(h => h.name === winner.name);
        const selectedHorse = horses[horseNum];
        
        const raceDisplay = horses.map(h => {
            const progress = raceResults.find(r => r.name === h.name).progress;
            const barLength = Math.floor(progress * 30);
            const bar = '▓'.repeat(Math.min(barLength, 30));
            const isWinner = h.name === winner.name;
            return `${h.name} [${bar.padEnd(30, '░')}] ${isWinner ? '🏆' : ''}`;
        }).join('\n\n');
        
        let message = '';
        
        if (horseNum === winnerIndex) {
            const winAmount = Math.floor(amount * selectedHorse.odds);
            economy[sender].balance += winAmount;
            message = `🏇 *HORSE RACE*\n\n${raceDisplay}\n\n🏆 Winner: ${winner.name}\nYour pick: ${selectedHorse.name}\n\n✅ YOU WIN!\n💰 Won: ${winAmount.toLocaleString()} ${currencySymbol} (${selectedHorse.odds}x)`;
        } else {
            economy[sender].balance -= amount;
            message = `🏇 *HORSE RACE*\n\n${raceDisplay}\n\n🏆 Winner: ${winner.name}\nYour pick: ${selectedHorse.name}\n\n❌ You lost!\n💸 Lost: ${amount.toLocaleString()} ${currencySymbol}`;
        }
        
        fs.writeFileSync(path, JSON.stringify(economy, null, 2));
        cooldowns.set(sender, Date.now());
        
        message += `\n\n💰 Balance: ${economy[sender].balance.toLocaleString()} ${currencySymbol}\n\n> ©POWERED BY NEXUS`;
        await extra.reply(message);
    }
};