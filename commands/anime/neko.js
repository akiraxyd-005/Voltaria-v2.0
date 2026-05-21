const axios = require('axios');
const FOOTER = '\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n> ©𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 𝙽£𝚇𝚄$';
module.exports = {
    name: 'neko', aliases: ['catgirl'], category: 'anime',
    description: 'Get random neko (cat girl) image', usage: '§neko',
    async execute(sock, msg, args, extra) {
        try {
            const { data } = await axios.get('https://nekos.life/api/v2/img/neko', { timeout: 8000 });
            await sock.sendMessage(msg.chat, { image: { url: data.url }, caption: `🐱 *Neko Girl* 🐱\nNyaa~!${FOOTER}` }, { quoted: msg });
        } catch(e) { await extra.reply('❌ Failed to fetch neko image.'); }
    }
};
