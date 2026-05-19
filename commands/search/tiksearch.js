const axios = require('axios');

module.exports = {
    name: 'tiksearch',
    aliases: ['tiktoksearch', 'ttsearch'],
    category: 'search',
    description: 'Search TikTok videos using keywords',
    usage: '§tiksearch <query>',
    async execute(sock, msg, args, extra) {
        const query = args.join(' ');
        
        if (!query) {
            return extra.reply(`❌ *Usage:* §tiksearch <query>\n\nExample: §tiksearch dancing cats`);
        }
        
        await extra.reply(`🔍 *Searching TikTok for "${query}"...*`);
        
        try {
            const response = await axios.get(`https://www.tikwm.com/api/search?keywords=${encodeURIComponent(query)}&count=5`);
            const videos = response.data.data.videos;
            
            if (!videos || videos.length === 0) {
                return extra.reply(`❌ No TikTok videos found for "${query}".`);
            }
            
            let result = `🎵 *TikTok Search: ${query}*\n\n`;
            for (let i = 0; i < Math.min(videos.length, 5); i++) {
                const video = videos[i];
                result += `${i+1}. *${video.title.substring(0, 50)}*\n   👤 ${video.author.unique_id}\n   ❤️ ${video.digg_count}\n\n`;
            }
            
            result += `> ©POWERED BY NEXUS`;
            await extra.reply(result);
        } catch (error) {
            await extra.reply(`❌ TikTok search failed. Please try again later.\n\n> ©POWERED BY NEXUS`);
        }
    }
};