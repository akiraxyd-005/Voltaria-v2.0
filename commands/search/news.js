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
            let rssUrl = '';
            
            switch(category) {
                case 'world':
                    rssUrl = 'https://feeds.bbci.co.uk/news/world/rss.xml';
                    break;
                case 'business':
                    rssUrl = 'https://feeds.bbci.co.uk/news/business/rss.xml';
                    break;
                case 'technology':
                    rssUrl = 'https://feeds.bbci.co.uk/news/technology/rss.xml';
                    break;
                case 'entertainment':
                    rssUrl = 'https://feeds.bbci.co.uk/news/entertainment_and_arts/rss.xml';
                    break;
                case 'sports':
                    rssUrl = 'https://feeds.bbci.co.uk/sport/rss.xml';
                    break;
                case 'science':
                    rssUrl = 'https://feeds.nationalgeographic.com/ng/News/News-Main';
                    break;
                case 'health':
                    rssUrl = 'https://www.who.int/rss-feeds/news-english.xml';
                    break;
                default:
                    rssUrl = 'https://feeds.bbci.co.uk/news/rss.xml';
            }
            
            const response = await axios.get(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`);
            const items = response.data.items.slice(0, 5);
            
            if (!items || items.length === 0) {
                return extra.reply(`❌ No news found for ${category}.`);
            }
            
            let result = `📰 *Top ${category.toUpperCase()} News*\n\n`;
            
            for (let i = 0; i < items.length; i++) {
                const article = items[i];
                const title = article.title.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
                const description = article.description?.replace(/<[^>]*>/g, '').substring(0, 100) || 'No description';
                
                result += `${i+1}. *${title}*\n`;
                result += `   📝 ${description}...\n`;
                result += `   🔗 ${article.link}\n\n`;
            }
            
            result += `━━━━━━━━━━━━━━━━━━━━━━━━━━\n> ©𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 𝙽£𝚇𝚄$`;
            await extra.reply(result);
            
        } catch (error) {
            await extra.reply(`❌ News fetch failed. Please try again later.\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n> ©𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 𝙽£𝚇𝚄$`);
        }
    }
};