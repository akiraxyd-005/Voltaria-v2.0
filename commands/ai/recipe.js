const axios = require('axios');

module.exports = {
    name: 'recipe',
    aliases: ['cook'],
    category: 'ai',
    description: 'Get a recipe for any dish or ingredient',
    usage: '§recipe <dish name>',
    async execute(sock, msg, args, extra) {
        const dish = args.join(' ');
        
        if (!dish) {
            return extra.reply(`❌ *Usage:* §recipe <dish name>\n\nExample: §recipe spaghetti carbonara`);
        }
        
        await extra.reply(`🍳 *Finding recipe...*`);
        
        try {
            const response = await axios.post('https://api.together.xyz/v1/chat/completions', {
                model: 'meta-llama/Llama-3.2-3B-Instruct',
                messages: [
                    { role: 'system', content: 'You are a recipe assistant. Provide a recipe with ingredients and instructions.' },
                    { role: 'user', content: `Give me a recipe for ${dish}` }
                ],
                max_tokens: 800
            }, {
                headers: {
                    'Authorization': `Bearer ${process.env.TOGETHER_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            });
            
            const recipe = response.data.choices[0].message.content;
            
            await extra.reply(`🍳 *Recipe for ${dish}*\n\n${recipe}\n\n> ©POWERED BY NEXUS`);
        } catch (error) {
            await extra.reply(`❌ Recipe search failed. Please try again later.\n\n> ©POWERED BY NEXUS`);
        }
    }
};