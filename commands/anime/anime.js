const axios = require('axios');
const FOOTER = '\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n> ©𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 𝙽£𝚇𝚄$';
module.exports = {
    name: 'anime', aliases: ['animeinfo', 'animesearch'], category: 'anime',
    description: 'Search for anime information', usage: '§anime <name>',
    async execute(sock, msg, args, extra) {
        const query = args.join(' ');
        if (!query) return extra.reply('❌ Please provide an anime name.\n\nExample: §anime naruto');
        try {
            const { data } = await axios.get(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}&limit=1`, { timeout: 10000 });
            if (!data.data || !data.data.length) return extra.reply(`❌ No anime found for "${query}"`);
            const a = data.data[0];
            const synopsis = a.synopsis ? a.synopsis.substring(0, 300) + '...' : 'No synopsis available.';
            const image = a.images.jpg.image_url;
            await sock.sendMessage(msg.chat, {
                image: { url: image },
                caption: `📺 *${a.title}*\n\n🎬 Episodes: ${a.episodes || 'Unknown'}\n📊 Status: ${a.status}\n⭐ Score: ${a.score || 'N/A'}\n\n📝 *Synopsis:*\n${synopsis}${FOOTER}`
            }, { quoted: msg });
        } catch(e) { await extra.reply('❌ Failed to fetch anime information.'); }
    }
};
