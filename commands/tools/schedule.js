const fs = require('fs');
const schedulePath = './database/schedules.json';

module.exports = {
    name: 'schedule',
    aliases: ['remind', 'timer'],
    category: 'tools',
    description: 'Schedule a reminder',
    usage: '§schedule <time> <message>',
    async execute(sock, msg, args, extra) {
        const timeArg = args[0];
        const message = args.slice(1).join(' ');
        
        if (!timeArg || !message) {
            return extra.reply(`❌ *Usage:* §schedule <time> <message>\n\nExamples:\n§schedule 5m Call mom\n§schedule 1h Meeting\n§schedule 30s Hello`);
        }
        
        const value = parseInt(timeArg);
        const unit = timeArg.slice(-1).toLowerCase();
        let delayMs = 0;
        
        switch(unit) {
            case 's': delayMs = value * 1000; break;
            case 'm': delayMs = value * 60 * 1000; break;
            case 'h': delayMs = value * 60 * 60 * 1000; break;
            case 'd': delayMs = value * 24 * 60 * 60 * 1000; break;
            default: return extra.reply(`❌ Invalid time format. Use s (seconds), m (minutes), h (hours), d (days)`);
        }
        
        const scheduleId = Date.now();
        const scheduledTime = new Date(Date.now() + delayMs);
        
        let schedules = {};
        if (fs.existsSync(schedulePath)) schedules = JSON.parse(fs.readFileSync(schedulePath));
        if (!schedules[extra.sender]) schedules[extra.sender] = [];
        
        schedules[extra.sender].push({
            id: scheduleId,
            message: message,
            time: Date.now() + delayMs,
            readableTime: scheduledTime.toLocaleString()
        });
        
        fs.writeFileSync(schedulePath, JSON.stringify(schedules, null, 2));
        
        await extra.reply(`⏰ *Reminder set!*\n\n📝 ${message}\n⏱️ Will remind at ${scheduledTime.toLocaleTimeString()}\n\n> ©POWERED BY NEXUS`);
        
        setTimeout(async () => {
            let current = {};
            if (fs.existsSync(schedulePath)) current = JSON.parse(fs.readFileSync(schedulePath));
            
            const reminder = current[extra.sender]?.find(r => r.id === scheduleId);
            if (reminder) {
                await sock.sendMessage(extra.from, {
                    text: `⏰ *REMINDER*\n\n${reminder.message}\n\n> ©POWERED BY NEXUS`
                }, { quoted: msg });
                
                current[extra.sender] = current[extra.sender].filter(r => r.id !== scheduleId);
                fs.writeFileSync(schedulePath, JSON.stringify(current, null, 2));
            }
        }, delayMs);
    }
};