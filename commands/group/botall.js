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
        
        // Complete list of known bots from Tensura, MD bots, etc.
        const knownBotNames = [
            // Tensura Bots
            'ALYA', 'AQUA', 'ASUNA', 'ELAINA', 'EMILIA', 'FRIEREN', 'KURUMI',
            'MAI', 'MARIN', 'MEGUMIN', 'MITA', 'MIYABI', 'MODEUS', 'NANAMI',
            'NAZUNA', 'REM', 'RIMURU', 'RIN', 'TATSUMAKI', 'YUKI', 'YUMEKO',
           
           
            // MD Bots
            'RED QUEEN', 'REDQUEEN', 'KHAN', 'KHAN-MD', 'JAWAD', 'JAWAD-MD',
            'KNIGHTBOT', 'KNIGHTBOT-MD', 'KAZEKI', 'XYLO', 'XYLO-MD',
            
            // Generic bot identifiers
            'BOT', 'MD', 'VOLTARIA', 'AMAI'
        ];
        
        // Also check for bot patterns in JID
        const botPatterns = ['bot', 'md', 'whatsapp', 'gateway', 'api'];
        
        const bots = [];
        const currentBotJid = sock.user.id;
        
        for (const participant of metadata.participants) {
            // Skip if it's the current bot itself
            if (participant.id === currentBotJid) continue;
            
            const userName = (participant.pushName || '').toUpperCase();
            const userJid = participant.id.toLowerCase();
            let isBot = false;
            let botType = '';
            
            // Check against known bot names
            for (const botName of knownBotNames) {
                if (userName.includes(botName) || userName === botName) {
                    isBot = true;
                    botType = botName;
                    break;
                }
            }
            
            // Check JID patterns
            if (!isBot) {
                for (const pattern of botPatterns) {
                    if (userJid.includes(pattern)) {
                        isBot = true;
                        botType = pattern.toUpperCase();
                        break;
                    }
                }
            }
            
            if (isBot) {
                bots.push({ id: participant.id, name: userName, type: botType });
            }
        }
        
        if (bots.length === 0) {
            return extra.reply(`🤖 *𝑁𝑜 𝑏𝑜𝑡𝑠 𝑓𝑜𝑢𝑛𝑑* 𝑖𝑛 𝑡ℎ𝑖𝑠 𝑔𝑟𝑜𝑢𝑝.`);
        }
        
        // Sort bots by type/name
        bots.sort((a, b) => a.name.localeCompare(b.name));
        
        let mentionText = `🤖 *${message}* 🤖\n\n`;
        const mentions = [];
        
        for (const bot of bots) {
            mentionText += `• @${bot.id.split('@')[0]} ${bot.type !== bot.name ? `(${bot.type})` : ''}\n`;
            mentions.push(bot.id);
        }
        
        mentionText += `\n*𝑇𝑜𝑡𝑎𝑙 𝑏𝑜𝑡𝑠: ${bots.length}*`;
        
        await sock.sendMessage(extra.from, {
            text: mentionText,
            mentions: mentions
        }, { quoted: msg });
    }
};