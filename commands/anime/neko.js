const axios = require('axios');

module.exports = {
    name: 'neko',
    aliases: ['catgirl'],
    category: 'anime',
    description: 'Get random neko (cat girl) image',
    usage: '§neko',
    async execute(sock, msg, args, extra) {
        try {
            const { data } = await axios.get('https://api.waifu.pics/sfw/neko');
            const response = await axios.get(data.url, { responseType: 'arraybuffer' });
            const buffer = Buffer.from(response.data);
            
            await sock.sendMessage(extra.from, {
                image: buffer,
                caption: '🐱 *Neko Girl* 🐱\nNyaa~!'
            }, { quoted: msg });
        } catch (error) {
            extra.reply('❌ Failed to fetch neko image.');
        }
    }
};