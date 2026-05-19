const axios = require('axios');

module.exports = {
    name: 'news',
    aliases: ['headlines', 'topnews'],
    category: 'search',
    description: 'Get top news headlines',
    usage: '§news <category>',
    async execute(sock, msg, args, extra) {
        const category = args[0]?.toLowerCase() || 'general';
        
        const validCategories = ['general', 'world', 'business', 'technology', 'entertainment', 'sports', 'science', 'health'];
        
        if (!validCategories.includes(category)) {
            return extra.reply(`❌ Invalid category. Options: general, world, business, technology, entertainment, sports, science, health`);
        }
        
        await extra.reply(`📰 *Fetching top ${category} news...*`);
        
        try {
            const response = await axios.get('https://gnews.io/api/v4/top-headlines', {
                params: {
                    category: category,
                    lang: 'en',
                    country: 'us',
                    max: 5,
                    apikey: process.env.GNEWS_API_KEY
                }
            });
            
            const articles = response.data.articles;
            
            if (!articles || articles.length === 0) {
                return extra.reply(`❌ No news found for ${category}.`);
            }
            
            let result = `📰 *Top ${category.toUpperCase()} News*\n\n`;
            for (let i = 0; i < articles.length; i++) {
                const article = articles[i];
                result += `${i+1}. *${article.title}*\n   📝 ${article.description?.substring(0, 100) || 'No description'}...\n   🔗 ${article.url}\n\n`;
            }
            
            result += `> ©POWERED BY NEXUS`;
            await extra.reply(result);
        } catch (error) {
            await extra.reply(`❌ News fetch failed. Please try again later.\n\n> ©POWERED BY NEXUS`);
        }
    }
};