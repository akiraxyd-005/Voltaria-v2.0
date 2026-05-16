const axios = require('axios');

module.exports = {
    name: 'anime',
    aliases: ['animeinfo', 'animesearch'],
    category: 'anime',
    description: 'Search for anime information',
    usage: '§anime <name>',
    async execute(sock, msg, args, extra) {
        const query = args.join(' ');
        if (!query) return extra.reply('❌ Please provide an anime name.\n\nExample: §anime naruto');

        try {
            const { data } = await axios.get(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}&limit=1`);
            
            if (!data.data || data.data.length === 0) {
                return extra.reply(`❌ No anime found for "${query}"`);
            }

            const anime = data.data[0];
            const title = anime.title;
            const episodes = anime.episodes || 'Unknown';
            const status = anime.status;
            const score = anime.score || 'N/A';
            const synopsis = anime.synopsis?.substring(0, 300) + '...';
            const image = anime.images.jpg.image_url;

            const response = await axios.get(image, { responseType: 'arraybuffer' });
            const buffer = Buffer.from(response.data);

            await sock.sendMessage(extra.from, {
                image: buffer,
                caption: `📺 *${title}*\n\n🎬 Episodes: ${episodes}\n📊 Status: ${status}\n⭐ Score: ${score}\n\n📝 *Synopsis:*\n${synopsis}`
            }, { quoted: msg });

        } catch (error) {
            console.error(error);
            extra.reply('❌ Failed to fetch anime information.');
        }
    }
};