const axios = require('axios');

module.exports = {
    name: 'ud',
    aliases: ['urbandictionary', 'urbandict'],
    category: 'search',
    description: 'Urban Dictionary search',
    usage: '§ud <word>',
    async execute(sock, msg, args, extra) {
        const word = args.join(' ');
        
        if (!word) {
            return extra.reply(`❌ *Usage:* §ud <word>\n\nExample: §ud simp`);
        }
        
        await extra.reply(`📖 *Searching Urban Dictionary for "${word}"...*`);
        
        try {
            const response = await axios.get(`https://api.urbandictionary.com/v0/define?term=${encodeURIComponent(word)}`);
            const definitions = response.data.list;
            
            if (!definitions || definitions.length === 0) {
                return extra.reply(`❌ No definition found for "${word}".`);
            }
            
            const def = definitions[0];
            const definition = def.definition.length > 500 ? def.definition.substring(0, 500) + '...' : def.definition;
            const example = def.example.length > 300 ? def.example.substring(0, 300) + '...' : def.example;
            
            await extra.reply(`📖 *Urban Dictionary: ${word}*\n\n📝 *Definition:* ${definition}\n\n📌 *Example:* ${example}\n\n👍 ${def.thumbs_up} | 👎 ${def.thumbs_down}\n\n> ©POWERED BY NEXUS`);
        } catch (error) {
            await extra.reply(`❌ Urban Dictionary search failed.\n\n> ©POWERED BY NEXUS`);
        }
    }
};