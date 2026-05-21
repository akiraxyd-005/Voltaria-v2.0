const axios = require('axios');
const FOOTER = '\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n> ©𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 𝙽£𝚇𝚄$';
const ENDPOINTS = ['neko', 'waifu', 'pat', 'hug', 'fox_girl', 'smug', 'cry', 'blush'];
module.exports = {
    name: 'animerandom', aliases: ['randomanime', 'ranime'], category: 'anime',
    description: 'Get random anime image/GIF', usage: '§animerandom',
    async execute(sock, msg, args, extra) {
        const endpoint = ENDPOINTS[Math.floor(Math.random() * ENDPOINTS.length)];
        try {
            const { data } = await axios.get(`https://nekos.life/api/v2/img/${endpoint}`, { timeout: 8000 });
            await sock.sendMessage(msg.chat, { image: { url: data.url }, caption: `🎀 *Random Anime:* ${endpoint.toUpperCase()} 🎀${FOOTER}` }, { quoted: msg });
        } catch(e) { await extra.reply('❌ Failed to fetch anime image.'); }
    }
};
