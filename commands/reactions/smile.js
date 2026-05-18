const axios = require('axios');

module.exports = {
    name: 'smile',
    category: 'reactions',
    description: 'Send a smile GIF',
    usage: '§smile @user',
    async execute(sock, msg, args, extra) {
        const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;
        const target = mentioned ? mentioned[0] : null;
        
        try {
            const { data } = await axios.get('https://api.waifu.pics/sfw/smile');
            const response = await axios.get(data.url, { responseType: 'arraybuffer' });
            const buffer = Buffer.from(response.data);
            
            if (target) {
                await sock.sendMessage(extra.from, {
                    gif: buffer,
                    caption: `@${extra.sender.split('@')[0]} smiles at @${target.split('@')[0]} 😊`,
                    mentions: [extra.sender, target]
                }, { quoted: msg });
            } else {
                await sock.sendMessage(extra.from, {
                    gif: buffer,
                    caption: `@${extra.sender.split('@')[0]} smiles 😊`,
                    mentions: [extra.sender]
                }, { quoted: msg });
            }
        } catch (error) {
            await extra.reply('❌ Failed to fetch smile GIF.');
        }
    }
};