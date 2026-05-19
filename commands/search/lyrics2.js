const axios = require('axios');

module.exports = {
    name: 'lyrics2',
    aliases: ['v2lyrics'],
    category: 'search',
    description: 'Search song lyrics using the v2 engine',
    usage: '§lyrics2 <song name>',
    async execute(sock, msg, args, extra) {
        const song = args.join(' ');
        
        if (!song) {
            return extra.reply(`❌ *Usage:* §lyrics2 <song name>\n\nExample: §lyrics2 Shape of You`);
        }
        
        await extra.reply(`🎤 *Searching lyrics for "${song}" (v2)...*`);
        
        try {
            const response = await axios.get(`https://api.genius.com/search`, {
                params: {
                    q: song
                },
                headers: {
                    'Authorization': `Bearer ${process.env.GENIUS_API_KEY}`
                }
            });
            
            const hits = response.data.response.hits;
            
            if (!hits || hits.length === 0) {
                return extra.reply(`❌ No lyrics found for "${song}".`);
            }
            
            const topHit = hits[0];
            const title = topHit.result.title;
            const artist = topHit.result.primary_artist.name;
            const url = topHit.result.url;
            
            await extra.reply(`🎤 *Lyrics v2: ${title} by ${artist}*\n\n🔗 View full lyrics: ${url}\n\n> ©POWERED BY NEXUS`);
        } catch (error) {
            await extra.reply(`❌ Lyrics search failed. Please try again later.\n\n> ©POWERED BY NEXUS`);
        }
    }
};