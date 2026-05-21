const axios = require('axios');

module.exports = {
    name: 'highfive',
    category: 'reactions',
    description: 'Send a highfive GIF',
    usage: '§highfive @user',
    async execute(sock, msg, args, extra) {
        const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;
        const target = mentioned ? mentioned[0] : null;
        
        if (!target) {
            return extra.reply('❌ Mention someone to highfive!\nUsage: §highfive @user');
        }
        
        try {
            const { data } = await axios.get('https://api.waifu.pics/sfw/highfive');
            const response = await axios.get(data.url, { responseType: 'arraybuffer' });
            const buffer = Buffer.from(response.data);
            
            await sock.sendMessage(extra.from, {
                video: buffer, gifPlayback: true,
                caption: `@${extra.sender.split('@')[0]} highfives @${target.split('@')[0]} 🖐️`,
                mentions: [extra.sender, target]
            }, { quoted: msg });
        } catch (error) {
            await extra.reply('❌ Failed to fetch highfive GIF.');
        }
    }
};