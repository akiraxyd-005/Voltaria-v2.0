const axios = require('axios');

module.exports = {
    name: 'wiki',
    aliases: ['wikipedia'],
    category: 'search',
    description: 'Search Wikipedia',
    usage: '§wiki <query>',
    async execute(sock, msg, args, extra) {
        const query = args.join(' ');
        
        if (!query) {
            return extra.reply(`❌ *Usage:* §wiki <query>\n\nExample: §wiki Albert Einstein`);
        }
        
        await extra.reply(`📚 *Searching Wikipedia for "${query}"...*`);
        
        try {
            const response = await axios.get('https://en.wikipedia.org/api/rest_v1/page/summary/' + encodeURIComponent(query));
            const data = response.data;
            
            if (!data.title) {
                return extra.reply(`❌ No Wikipedia page found for "${query}".`);
            }
            
            const extract = data.extract.length > 800 ? data.extract.substring(0, 800) + '...' : data.extract;
            
            await extra.reply(`📚 *Wikipedia: ${data.title}*\n\n${extract}\n\n🔗 Read more: ${data.content_urls.desktop.page}\n\n> ©POWERED BY NEXUS`);
        } catch (error) {
            await extra.reply(`❌ No Wikipedia page found for "${query}".\n\n> ©POWERED BY NEXUS`);
        }
    }
};