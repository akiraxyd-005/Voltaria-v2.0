const axios = require('axios');

module.exports = {
    name: 'fetch',
    aliases: ['get', 'request'],
    category: 'tools',
    description: 'Fetch data from a URL',
    usage: '§fetch <url>',
    async execute(sock, msg, args, extra) {
        const url = args[0];
        
        if (!url) {
            return extra.reply(`❌ *Usage:* §fetch <url>\n\nExample: §fetch https://api.example.com`);
        }
        
        await extra.reply(`🌐 *Fetching data...*`);
        
        try {
            const response = await axios.get(url, { timeout: 10000 });
            const data = typeof response.data === 'object' ? JSON.stringify(response.data, null, 2) : response.data;
            const truncated = data.length > 1500 ? data.substring(0, 1500) + '...' : data;
            
            await extra.reply(`🌐 *Fetched Data*\n\n\`\`\`json\n${truncated}\n\`\`\`\n\n> ©POWERED BY NEXUS`);
        } catch (error) {
            await extra.reply(`❌ Failed to fetch URL. Make sure it's valid.\n\n> ©POWERED BY NEXUS`);
        }
    }
};