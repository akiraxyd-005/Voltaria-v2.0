const axios = require('axios');

module.exports = {
    name: 'nom',
    category: 'reactions',
    description: 'Send a nom GIF',
    usage: '§nom @user',
    async execute(sock, msg, args, extra) {
        const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;
        const target = mentioned ? mentioned[0] : null;
        
        try {
            const { data } = await axios.get('https://api.waifu.pics/sfw/nom');
            const response = await axios.get(data.url, { responseType: 'arraybuffer' });
            const buffer = Buffer.from(response.data);
            
            if (target) {
                await sock.sendMessage(extra.from, {
                    video: buffer, gifPlayback: true,
                    caption: `@${extra.sender.split('@')[0]} noms @${target.split('@')[0]} 🍴`,
                    mentions: [extra.sender, target]
                }, { quoted: msg });
            } else {
                await sock.sendMessage(extra.from, {
                    video: buffer, gifPlayback: true,
                    caption: `@${extra.sender.split('@')[0]} noms 🍴`,
                    mentions: [extra.sender]
                }, { quoted: msg });
            }
        } catch (error) {
            await extra.reply('❌ Failed to fetch nom GIF.');
        }
    }
};