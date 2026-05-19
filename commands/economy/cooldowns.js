const cooldowns = new Map();

module.exports = {
    name: 'cooldowns',
    aliases: ['cd'],
    category: 'economy',
    description: 'View your active cooldowns',
    usage: '§cooldowns',
    async execute(sock, msg, args, extra) {
        const sender = extra.sender;
        const now = Date.now();
        
        const cooldownList = [
            { name: '🎁 Daily', time: 24 * 60 * 60 * 1000, key: 'daily' },
            { name: '💼 Work', time: 60 * 60 * 1000, key: 'work' },
            { name: '🔫 Crime', time: 3 * 60 * 60 * 1000, key: 'crime' },
            { name: '🙏 Beg', time: 30 * 60 * 1000, key: 'beg' },
            { name: '🎣 Fish', time: 45 * 60 * 1000, key: 'fish' },
            { name: '🏹 Hunt', time: 60 * 60 * 1000, key: 'hunt' },
            { name: '💰 Rob', time: 2 * 60 * 60 * 1000, key: 'rob' }
        ];
        
        let display = `┏━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  ⏱️  *COOLDOWNS*
┗━━━━━━━━━━━━━━━━━━━━━━━━┛\n\n`;
        
        for (const cd of cooldownList) {
            const lastUsed = cooldowns.get(`${sender}_${cd.key}`);
            if (lastUsed && (now - lastUsed) < cd.time) {
                const remaining = cd.time - (now - lastUsed);
                const hours = Math.floor(remaining / (60 * 60 * 1000));
                const minutes = Math.ceil((remaining % (60 * 60 * 1000)) / (60 * 1000));
                display += `${cd.name}: ⏳ ${hours}h ${minutes}m\n`;
            } else {
                display += `${cd.name}: ✅ Ready\n`;
            }
        }
        
        display += `\n> ©POWERED BY NEXUS`;
        await extra.reply(display);
    }
};