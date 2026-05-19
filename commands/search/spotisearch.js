const axios = require('axios');

module.exports = {
    name: 'spotisearch',
    aliases: ['spotifysearch', 'spsearch'],
    category: 'search',
    description: 'Search Spotify for songs',
    usage: '§spotisearch <song name>',
    async execute(sock, msg, args, extra) {
        const query = args.join(' ');
        
        if (!query) {
            return extra.reply(`❌ *Usage:* §spotisearch <song name>\n\nExample: §spotisearch Blinding Lights`);
        }
        
        await extra.reply(`🎵 *Searching Spotify for "${query}"...*`);
        
        try {
            const response = await axios.get('https://api.spotify.com/v1/search', {
                params: {
                    q: query,
                    type: 'track',
                    limit: 5
                },
                headers: {
                    'Authorization': `Bearer ${process.env.SPOTIFY_TOKEN}`
                }
            });
            
            const tracks = response.data.tracks.items;
            
            if (!tracks || tracks.length === 0) {
                return extra.reply(`❌ No songs found for "${query}".`);
            }
            
            let result = `🎵 *Spotify Search: ${query}*\n\n`;
            for (let i = 0; i < tracks.length; i++) {
                const track = tracks[i];
                const artists = track.artists.map(a => a.name).join(', ');
                result += `${i+1}. *${track.name}*\n   👤 ${artists}\n   💿 ${track.album.name}\n\n`;
            }
            
            result += `> ©POWERED BY NEXUS`;
            await extra.reply(result);
        } catch (error) {
            await extra.reply(`❌ Spotify search failed. Please try again later.\n\n> ©POWERED BY NEXUS`);
        }
    }
};