const axios = require('axios');
const FOOTER = '\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n> ©𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 𝙽£𝚇𝚄$';
module.exports = {
    name: 'foxxgirl', aliases: ['foxgirl', 'kitsune'], category: 'anime',
    description: 'Get random fox girl image', usage: '§foxxgirl',
    async execute(sock, msg, args, extra) {
        try {
            const { data } = await axios.get('https://nekos.life/api/v2/img/foxgirl', { timeout: 8000 });
            await sock.sendMessage(msg.chat, { image: { url: data.url }, caption: `🦊 *Foxx Girl* 🦊\nKitsune~!${FOOTER}` }, { quoted: msg });
        } catch(e) {
            try {
                const { data } = await axios.get('https://nekos.life/api/v2/img/neko', { timeout: 8000 });
                await sock.sendMessage(msg.chat, { image: { url: data.url }, caption: `🦊 *Fox Girl* 🦊\nKitsune~!${FOOTER}` }, { quoted: msg });
            } catch(e2) { await extra.reply('❌ Failed to fetch fox girl image.'); }
        }
    }
};
