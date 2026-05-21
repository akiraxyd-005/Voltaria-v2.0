const axios = require('axios');
const FOOTER = '\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n> ©𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 𝙽£𝚇𝚄$';
module.exports = {
    name: 'waifu', aliases: ['animegirl'], category: 'anime',
    description: 'Get random waifu image', usage: '§waifu',
    async execute(sock, msg, args, extra) {
        try {
            const { data } = await axios.get('https://nekos.life/api/v2/img/waifu', { timeout: 8000 });
            await sock.sendMessage(msg.chat, { image: { url: data.url }, caption: `🌸 *Your Waifu* 🌸${FOOTER}` }, { quoted: msg });
        } catch(e) { await extra.reply('❌ Failed to fetch waifu image.'); }
    }
};
