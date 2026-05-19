const axios = require('axios');

module.exports = {
    name: 'movie',
    aliases: ['film', 'cinema'],
    category: 'search',
    description: 'Get info about a movie',
    usage: '§movie <movie name>',
    async execute(sock, msg, args, extra) {
        const movieName = args.join(' ');
        
        if (!movieName) {
            return extra.reply(`❌ *Usage:* §movie <movie name>\n\nExample: §movie Inception`);
        }
        
        await extra.reply(`🎬 *Searching for "${movieName}"...*`);
        
        try {
            const response = await axios.get('https://www.omdbapi.com/', {
                params: {
                    apikey: process.env.OMDB_API_KEY,
                    t: movieName,
                    plot: 'short'
                }
            });
            
            const movie = response.data;
            
            if (movie.Response === 'False') {
                return extra.reply(`❌ Movie "${movieName}" not found.`);
            }
            
            await extra.reply(`🎬 *${movie.Title} (${movie.Year})*\n\n⭐ *Rating:* ${movie.imdbRating}/10\n🎭 *Genre:* ${movie.Genre}\n🎬 *Director:* ${movie.Director}\n👥 *Cast:* ${movie.Actors}\n📝 *Plot:* ${movie.Plot}\n\n> ©POWERED BY NEXUS`);
        } catch (error) {
            await extra.reply(`❌ Movie search failed. Please try again later.\n\n> ©POWERED BY NEXUS`);
        }
    }
};