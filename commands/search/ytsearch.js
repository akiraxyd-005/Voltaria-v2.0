const axios = require('axios');

module.exports = {
    name: 'ytsearch',
    aliases: ['youtube', 'youtubesearch'],
    category: 'search',
    description: 'Search YouTube videos',
    usage: '§ytsearch <query>',
    async execute(sock, msg, args, extra) {
        const query = args.join(' ');
        
        if (!query) {
            return extra.reply(`❌ *Usage:* §ytsearch <query>\n\nExample: §ytsearch funny cats`);
        }
        
        await extra.reply(`📺 *Searching YouTube for "${query}"...*`);
        
        try {
            const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
                params: {
                    part: 'snippet',
                    q: query,
                    maxResults: 5,
                    type: 'video',
                    key: process.env.YOUTUBE_API_KEY
                }
            });
            
            const videos = response.data.items;
            
            if (!videos || videos.length === 0) {
                return extra.reply(`❌ No YouTube videos found for "${query}".`);
            }
            
            let result = `📺 *YouTube Search: ${query}*\n\n`;
            for (let i = 0; i < videos.length; i++) {
                const video = videos[i];
                const videoId = video.id.videoId;
                result += `${i+1}. *${video.snippet.title}*\n   🔗 https://youtu.be/${videoId}\n   👤 ${video.snippet.channelTitle}\n\n`;
            }
            
            result += `> ©POWERED BY NEXUS`;
            await extra.reply(result);
        } catch (error) {
            await extra.reply(`❌ YouTube search failed. Please try again later.\n\n> ©POWERED BY NEXUS`);
        }
    }
};