const axios = require('axios');

module.exports = {
    name: 'cringe',
    category: 'reactions',
    description: 'Send a cringe GIF',
    usage: '§cringe',
    async execute(sock, msg, args, extra) {
        try {
            const { data } = await axios.get('https://api.waifu.pics/sfw/cringe');
            const response = await axios.get(data.url, { responseType: 'arraybuffer' });
            const buffer = Buffer.from(response.data);
            
            await sock.sendMessage(extra.from, {
                gif: buffer,
                caption: `@${extra.sender.split('@')[0]} cringes 😬`,
                mentions: [extra.sender]
            }, { quoted: msg });
        } catch (error) {
            await extra.reply('❌ Failed to fetch cringe GIF.');
        }
    }
};