const axios = require('axios');

module.exports = {
    name: 'google',
    aliases: ['gsearch', 'websearch'],
    category: 'search',
    description: 'Search Google and return top 5 results',
    usage: '§google <query>',
    async execute(sock, msg, args, extra) {
        const query = args.join(' ');
        
        if (!query) {
            return extra.reply(`❌ *Usage:* §google <query>\n\nExample: §google whatsapp bot tutorial`);
        }
        
        await extra.reply(`🔍 *Googling "${query}"...*`);
        
        try {
            const response = await axios.get('https://www.googleapis.com/customsearch/v1', {
                params: {
                    key: process.env.GOOGLE_API_KEY,
                    cx: process.env.GOOGLE_CX,
                    q: query,
                    num: 5
                }
            });
            
            const items = response.data.items;
            
            if (!items || items.length === 0) {
                return extra.reply(`❌ No results found for "${query}".`);
            }
            
            let result = `🔍 *Google Search: ${query}*\n\n`;
            for (let i = 0; i < items.length; i++) {
                const item = items[i];
                result += `${i+1}. *${item.title}*\n   🔗 ${item.link}\n   📝 ${item.snippet.substring(0, 100)}...\n\n`;
            }
            
            result += `> ©POWERED BY NEXUS`;
            await extra.reply(result);
        } catch (error) {
            await extra.reply(`❌ Google search failed. Please try again later.\n\n> ©POWERED BY NEXUS`);
        }
    }
};