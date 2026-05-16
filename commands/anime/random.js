const axios = require('axios');

module.exports = {
    name: 'animerandom',
    aliases: ['randomanime', 'ranime'],
    category: 'anime',
    description: 'Get random anime GIF',
    usage: '§randomanime',
    async execute(sock, msg, args, extra) {
        const endpoints = ['hug', 'kiss', 'pat', 'smug', 'cry', 'dance', 'blush', 'wave'];
        const random = endpoints[Math.floor(Math.random() * endpoints.length)];
        
        try {
            const { data } = await axios.get(`https://api.waifu.pics/sfw/${random}`);
            const response = await axios.get(data.url, { responseType: 'arraybuffer' });
            const buffer = Buffer.from(response.data);
            
            await sock.sendMessage(extra.from, {
                image: buffer,
                caption: `🎀 *Random Anime Action:* ${random.toUpperCase()} 🎀`
            }, { quoted: msg });
        } catch (error) {
            extra.reply('❌ Failed to fetch anime GIF.');
        }
    }
};