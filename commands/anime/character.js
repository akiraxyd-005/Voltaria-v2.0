const axios = require('axios');

module.exports = {
    name: 'character',
    aliases: ['animechar', 'char'],
    category: 'anime',
    description: 'Search for anime character',
    usage: '§character <name>',
    async execute(sock, msg, args, extra) {
        const query = args.join(' ');
        if (!query) return extra.reply('❌ Please provide a character name.\n\nExample: §character gojo');

        try {
            const { data } = await axios.get(`https://api.jikan.moe/v4/characters?q=${encodeURIComponent(query)}&limit=1`);
            
            if (!data.data || data.data.length === 0) {
                return extra.reply(`❌ No character found for "${query}"`);
            }

            const char = data.data[0];
            const name = char.name;
            const about = char.about?.substring(0, 300) + '...' || 'No description available.';
            const image = char.images.jpg.image_url;
            
            // Get anime appearances
            let animeList = '';
            if (char.anime && char.anime.length > 0) {
                animeList = char.anime.slice(0, 3).map(a => `• ${a.anime.name}`).join('\n');
            }

            const response = await axios.get(image, { responseType: 'arraybuffer' });
            const buffer = Buffer.from(response.data);

            await sock.sendMessage(extra.from, {
                image: buffer,
                caption: `👤 *${name}*\n\n📖 *About:*\n${about}\n\n🎬 *Appears in:*\n${animeList || 'Unknown'}`
            }, { quoted: msg });

        } catch (error) {
            extra.reply('❌ Failed to fetch character information.');
        }
    }
};