const axios = require('axios');
const FOOTER = '\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n> ©𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 𝙽£𝚇𝚄$';
module.exports = {
    name: 'character', aliases: ['animechar', 'char'], category: 'anime',
    description: 'Search for anime character', usage: '§character <name>',
    async execute(sock, msg, args, extra) {
        const query = args.join(' ');
        if (!query) return extra.reply('❌ Please provide a character name.\n\nExample: §character gojo');
        try {
            const { data } = await axios.get(`https://api.jikan.moe/v4/characters?q=${encodeURIComponent(query)}&limit=1`, { timeout: 10000 });
            if (!data.data || !data.data.length) return extra.reply(`❌ No character found for "${query}"`);
            const c = data.data[0];
            const about = c.about ? c.about.substring(0, 300) + '...' : 'No description available.';
            const animeList = c.anime?.slice(0, 3).map(a => `• ${a.anime.name}`).join('\n') || 'Unknown';
            await sock.sendMessage(msg.chat, {
                image: { url: c.images.jpg.image_url },
                caption: `👤 *${c.name}*\n\n📖 *About:*\n${about}\n\n🎬 *Appears in:*\n${animeList}${FOOTER}`
            }, { quoted: msg });
        } catch(e) { await extra.reply('❌ Failed to fetch character information.'); }
    }
};
