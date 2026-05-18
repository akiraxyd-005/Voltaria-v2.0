const axios = require('axios');

module.exports = {
    name: 'handhold',
    category: 'reactions',
    description: 'Send a handhold GIF',
    usage: '§handhold @user',
    async execute(sock, msg, args, extra) {
        const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;
        const target = mentioned ? mentioned[0] : null;
        
        if (!target) {
            return extra.reply('❌ Mention someone to hold hands with!\nUsage: §handhold @user');
        }
        
        try {
            const { data } = await axios.get('https://api.waifu.pics/sfw/handhold');
            const response = await axios.get(data.url, { responseType: 'arraybuffer' });
            const buffer = Buffer.from(response.data);
            
            await sock.sendMessage(extra.from, {
                gif: buffer,
                caption: `@${extra.sender.split('@')[0]} holds hands with @${target.split('@')[0]} 🤝`,
                mentions: [extra.sender, target]
            }, { quoted: msg });
        } catch (error) {
            await extra.reply('❌ Failed to fetch handhold GIF.');
        }
    }
};