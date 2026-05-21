const axios = require('axios');

module.exports = {
    name: 'yeet',
    category: 'reactions',
    description: 'Send a yeet GIF',
    usage: '§yeet @user',
    async execute(sock, msg, args, extra) {
        const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;
        const target = mentioned ? mentioned[0] : null;
        
        if (!target) {
            return extra.reply('❌ Mention someone to yeet!\nUsage: §yeet @user');
        }
        
        try {
            const { data } = await axios.get('https://api.waifu.pics/sfw/yeet');
            const response = await axios.get(data.url, { responseType: 'arraybuffer' });
            const buffer = Buffer.from(response.data);
            
            await sock.sendMessage(extra.from, {
                video: buffer, gifPlayback: true,
                caption: `@${extra.sender.split('@')[0]} yeets @${target.split('@')[0]} 🚀`,
                mentions: [extra.sender, target]
            }, { quoted: msg });
        } catch (error) {
            await extra.reply('❌ Failed to fetch yeet GIF.');
        }
    }
};