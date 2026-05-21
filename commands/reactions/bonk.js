const axios = require('axios');

module.exports = {
    name: 'bonk',
    category: 'reactions',
    description: 'Send a bonk GIF',
    usage: '§bonk @user',
    async execute(sock, msg, args, extra) {
        const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;
        const target = mentioned ? mentioned[0] : null;
        
        if (!target) {
            return extra.reply('❌ Mention someone to bonk!\nUsage: §bonk @user');
        }
        
        try {
            const { data } = await axios.get('https://api.waifu.pics/sfw/bonk');
            const response = await axios.get(data.url, { responseType: 'arraybuffer' });
            const buffer = Buffer.from(response.data);
            
            await sock.sendMessage(extra.from, {
                video: buffer, gifPlayback: true,
                caption: `@${extra.sender.split('@')[0]} bonks @${target.split('@')[0]} 🔨`,
                mentions: [extra.sender, target]
            }, { quoted: msg });
        } catch (error) {
            await extra.reply('❌ Failed to fetch bonk GIF.');
        }
    }
};