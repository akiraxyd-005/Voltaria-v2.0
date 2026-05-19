const axios = require('axios');

module.exports = {
    name: 'lyrics',
    aliases: ['songlyrics'],
    category: 'search',
    description: 'Fetch lyrics of a song',
    usage: '§lyrics <song name>',
    async execute(sock, msg, args, extra) {
        const song = args.join(' ');
        
        if (!song) {
            return extra.reply(`❌ *Usage:* §lyrics <song name>\n\nExample: §lyrics Bohemian Rhapsody`);
        }
        
        await extra.reply(`🎤 *Searching lyrics for "${song}"...*`);
        
        try {
            const response = await axios.get(`https://api.lyrics.ovh/v1/${encodeURIComponent(song)}`);
            const lyrics = response.data.lyrics;
            
            if (!lyrics) {
                return extra.reply(`❌ No lyrics found for "${song}".`);
            }
            
            const truncatedLyrics = lyrics.length > 1500 ? lyrics.substring(0, 1500) + '...' : lyrics;
            
            await extra.reply(`🎤 *Lyrics: ${song}*\n\n${truncatedLyrics}\n\n> ©POWERED BY NEXUS`);
        } catch (error) {
            await extra.reply(`❌ Lyrics not found for "${song}".\n\n> ©POWERED BY NEXUS`);
        }
    }
};