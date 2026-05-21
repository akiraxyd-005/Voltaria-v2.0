const axios = require('axios');

module.exports = {
    name: 'animenews',
    aliases: ['anews', 'seasonal'],
    category: 'anime',
    description: 'Get the current season\'s top airing anime',
    usage: '§animenews',
    async execute(sock, msg, args, extra) {
        await extra.reply('📡 *Fetching seasonal anime...*');

        try {
            const { data } = await axios.get('https://api.jikan.moe/v4/seasons/now?limit=10', { timeout: 10000 });
            const animes = data.data;

            if (!animes || animes.length === 0) {
                return extra.reply('❌ No seasonal anime found right now.');
            }

            let text = `🎌 *CURRENTLY AIRING ANIME*\n`;
            text += `━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

            animes.slice(0, 10).forEach((anime, i) => {
                const score  = anime.score ? `⭐ ${anime.score}` : '⭐ N/A';
                const eps    = anime.episodes ? `${anime.episodes} eps` : 'ongoing';
                const studio = anime.studios?.[0]?.name || 'Unknown';
                text += `*${i + 1}.* ${anime.title}\n`;
                text += `   ${score} • 📺 ${eps} • 🏢 ${studio}\n\n`;
            });

            text += `━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
            text += `> ©POWERED BY VOLTARIA NEXUS`;

            const firstImage = animes[0]?.images?.jpg?.image_url;

            if (firstImage) {
                try {
                    const imgRes = await axios.get(firstImage, { responseType: 'arraybuffer', timeout: 8000 });
                    const buffer = Buffer.from(imgRes.data);
                    await sock.sendMessage(msg.chat, { image: buffer, caption: text }, { quoted: msg });
                    return;
                } catch { }
            }

            await extra.reply(text);
        } catch (error) {
            await extra.reply('❌ Failed to fetch anime news. Try again later.');
        }
    }
};
