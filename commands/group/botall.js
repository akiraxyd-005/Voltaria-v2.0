const fs = require('fs');
const botsDbPath = './database/bots.json';

module.exports = {
    name: 'botall',
    aliases: ['tagbots', 'bots'],
    category: 'group',
    description: 'Mention all bots in the group',
    usage: '§botall <message>',
    isGroup: true,
    isAdmin: true,
    async execute(sock, msg, args, extra) {
        const metadata = await sock.groupMetadata(extra.from);
        const message = args.join(' ') || '📢 Attention bots!';
        
        // Load bot list from database
        let botList = { botNames: [] };
        if (fs.existsSync(botsDbPath)) {
            botList = JSON.parse(fs.readFileSync(botsDbPath));
        }
        
        // Also include built-in patterns
        const builtInPatterns = ['BOT', 'MD', 'VOLTARIA', 'XYLO', 'AMAI'];
        const allBotNames = [...botList.botNames, ...builtInPatterns];
        
        const bots = [];
        const currentBotJid = sock.user.id;
        
        for (const participant of metadata.participants) {
            if (participant.id === currentBotJid) continue;
            
            const userName = (participant.pushName || '').toUpperCase();
            
            for (const botName of allBotNames) {
                if (userName.includes(botName) || userName === botName) {
                    bots.push({ id: participant.id, name: userName });
                    break;
                }
            }
        }
        
        if (bots.length === 0) {
            return extra.reply(`🤖 *𝑁𝑜 𝑏𝑜𝑡𝑠 𝑓𝑜𝑢𝑛𝑑* 𝑖𝑛 𝑡ℎ𝑖𝑠 𝑔𝑟𝑜𝑢𝑝.`);
        }
        
        let mentionText = `🤖 *${message}* 🤖\n\n`;
        const mentions = [];
        
        for (const bot of bots) {
            mentionText += `• @${bot.id.split('@')[0]}\n`;
            mentions.push(bot.id);
        }
        
        mentionText += `\n*𝑇𝑜𝑡𝑎𝑙 𝑏𝑜𝑡𝑠: ${bots.length}*`;
        
        await sock.sendMessage(extra.from, {
            text: mentionText,
            mentions: mentions
        }, { quoted: msg });
    }
};