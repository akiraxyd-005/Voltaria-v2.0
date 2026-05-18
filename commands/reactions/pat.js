const axios = require('axios');

module.exports = {
    name: 'pat',
    category: 'reactions',
    description: 'Send a pat GIF',
    usage: '§pat @user',
    async execute(sock, msg, args, extra) {
        const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;
        const target = mentioned ? mentioned[0] : null;
        
        try {
            const { data } = await axios.get('https://api.waifu.pics/sfw/pat');
            const response = await axios.get(data.url, { responseType: 'arraybuffer' });
            const buffer = Buffer.from(response.data);
            
            if (target) {
                await sock.sendMessage(extra.from, {
                    gif: buffer,
                    caption: `@${extra.sender.split('@')[0]} pats @${target.split('@')[0]} 🖐️`,
                    mentions: [extra.sender, target]
                }, { quoted: msg });
            } else {
                await sock.sendMessage(extra.from, {
                    gif: buffer,
                    caption: `@${extra.sender.split('@')[0]} sends a pat 🖐️`,
                    mentions: [extra.sender]
                }, { quoted: msg });
            }
        } catch (error) {
            await extra.reply('❌ Failed to fetch pat GIF.');
        }
    }
};