const axios = require('axios');

module.exports = {
    name: 'slap',
    category: 'reactions',
    description: 'Send a slap GIF',
    usage: '§slap @user',
    async execute(sock, msg, args, extra) {
        const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;
        const target = mentioned ? mentioned[0] : null;
        
        if (!target) {
            return extra.reply('❌ Mention someone to slap!\nUsage: §slap @user');
        }
        
        try {
            const { data } = await axios.get('https://api.waifu.pics/sfw/slap');
            const response = await axios.get(data.url, { responseType: 'arraybuffer' });
            const buffer = Buffer.from(response.data);
            
            await sock.sendMessage(extra.from, {
                gif: buffer,
                caption: `@${extra.sender.split('@')[0]} slaps @${target.split('@')[0]} 👋`,
                mentions: [extra.sender, target]
            }, { quoted: msg });
        } catch (error) {
            await extra.reply('❌ Failed to fetch slap GIF.');
        }
    }
};