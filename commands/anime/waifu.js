const axios = require('axios');

module.exports = {
    name: 'waifu',
    aliases: ['animegirl'],
    category: 'anime',
    description: 'Get random waifu image',
    usage: '§waifu',
    async execute(sock, msg, args, extra) {
        try {
            const { data } = await axios.get('https://api.waifu.pics/sfw/waifu');
            const response = await axios.get(data.url, { responseType: 'arraybuffer' });
            const buffer = Buffer.from(response.data);
            
            await sock.sendMessage(extra.from, {
                image: buffer,
                caption: '🌸 *Your Waifu* 🌸'
            }, { quoted: msg });
        } catch (error) {
            extra.reply('❌ Failed to fetch waifu image.');
        }
    }
};