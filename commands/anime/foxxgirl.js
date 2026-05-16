const axios = require('axios');

module.exports = {
    name: 'foxxgirl',
    aliases: ['foxgirl', 'kitsune'],
    category: 'anime',
    description: 'Get random fox girl image',
    usage: '§foxxgirl',
    async execute(sock, msg, args, extra) {
        try {
            const { data } = await axios.get('https://api.waifu.pics/sfw/foxgirl');
            const response = await axios.get(data.url, { responseType: 'arraybuffer' });
            const buffer = Buffer.from(response.data);
            
            await sock.sendMessage(extra.from, {
                image: buffer,
                caption: '🦊 *Foxx Girl* 🦊\nKitsune~!'
            }, { quoted: msg });
        } catch (error) {
            // Try backup API
            try {
                const { data } = await axios.get('https://nekos.life/api/v2/img/foxgirl');
                const response = await axios.get(data.url, { responseType: 'arraybuffer' });
                const buffer = Buffer.from(response.data);
                
                await sock.sendMessage(extra.from, {
                    image: buffer,
                    caption: '🦊 *Foxx Girl* 🦊\nKitsune~!'
                }, { quoted: msg });
            } catch (err) {
                extra.reply('❌ Failed to fetch fox girl image.');
            }
        }
    }
};