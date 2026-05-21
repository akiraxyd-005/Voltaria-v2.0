const axios = require('axios');

module.exports = {
    name: 'dance',
    category: 'reactions',
    description: 'Send a dance GIF',
    usage: '§dance',
    async execute(sock, msg, args, extra) {
        try {
            const { data } = await axios.get('https://api.waifu.pics/sfw/dance');
            const response = await axios.get(data.url, { responseType: 'arraybuffer' });
            const buffer = Buffer.from(response.data);
            
            await sock.sendMessage(extra.from, {
                video: buffer, gifPlayback: true,
                caption: `@${extra.sender.split('@')[0]} dances 💃`,
                mentions: [extra.sender]
            }, { quoted: msg });
        } catch (error) {
            await extra.reply('❌ Failed to fetch dance GIF.');
        }
    }
};