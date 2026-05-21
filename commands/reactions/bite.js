const axios = require('axios');

module.exports = {
    name: 'bite',
    category: 'reactions',
    description: 'Send a bite GIF',
    usage: '§bite @user',
    async execute(sock, msg, args, extra) {
        const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;
        const target = mentioned ? mentioned[0] : null;
        
        if (!target) {
            return extra.reply('❌ Mention someone to bite!\nUsage: §bite @user');
        }
        
        try {
            const { data } = await axios.get('https://api.waifu.pics/sfw/bite');
            const response = await axios.get(data.url, { responseType: 'arraybuffer' });
            const buffer = Buffer.from(response.data);
            
            await sock.sendMessage(extra.from, {
                video: buffer, gifPlayback: true,
                caption: `@${extra.sender.split('@')[0]} bites @${target.split('@')[0]} 🦷`,
                mentions: [extra.sender, target]
            }, { quoted: msg });
        } catch (error) {
            await extra.reply('❌ Failed to fetch bite GIF.');
        }
    }
};