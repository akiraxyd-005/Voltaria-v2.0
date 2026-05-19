const axios = require('axios');

module.exports = {
    name: 'define',
    aliases: ['dictionary', 'meaning'],
    category: 'search',
    description: 'Get dictionary definition of a word',
    usage: '§define <word>',
    async execute(sock, msg, args, extra) {
        const word = args.join(' ');
        
        if (!word) {
            return extra.reply(`❌ *Usage:* §define <word>\n\nExample: §define serendipity`);
        }
        
        await extra.reply(`📖 *Looking up "${word}"...*`);
        
        try {
            const response = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`);
            const data = response.data[0];
            
            const definition = data.meanings[0].definitions[0].definition;
            const partOfSpeech = data.meanings[0].partOfSpeech;
            const example = data.meanings[0].definitions[0].example || 'No example available';
            
            await extra.reply(`📖 *Definition: ${word}*\n\n📝 *(${partOfSpeech})* ${definition}\n\n📌 *Example:* ${example}\n\n> ©POWERED BY NEXUS`);
        } catch (error) {
            await extra.reply(`❌ Word "${word}" not found. Please check spelling.\n\n> ©POWERED BY NEXUS`);
        }
    }
};