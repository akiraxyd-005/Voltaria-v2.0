const axios = require('axios');

module.exports = {
    name: 'poke',
    category: 'reactions',
    description: 'Send a poke GIF',
    usage: '§poke @user',
    async execute(sock, msg, args, extra) {
        const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;
        const target = mentioned ? mentioned[0] : null;
        
        if (!target) {
            return extra.reply('❌ Mention someone to poke!\nUsage: §poke @user');
        }
        
        try {
            const { data } = await axios.get('https://api.waifu.pics/sfw/poke');
            const response = await axios.get(data.url, { responseType: 'arraybuffer' });
            const buffer = Buffer.from(response.data);
            
            await sock.sendMessage(extra.from, {
                gif: buffer,
                caption: `@${extra.sender.split('@')[0]} pokes @${target.split('@')[0]} 👆`,
                mentions: [extra.sender, target]
            }, { quoted: msg });
        } catch (error) {
            await extra.reply('❌ Failed to fetch poke GIF.');
        }
    }
};