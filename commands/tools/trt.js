const axios = require('axios');

module.exports = {
    name: 'trt',
    aliases: ['translate', 'tr'],
    category: 'tools',
    description: 'Translate text to another language',
    usage: '§trt <lang> <text>',
    async execute(sock, msg, args, extra) {
        const targetLang = args[0];
        const text = args.slice(1).join(' ');
        
        if (!targetLang || !text) {
            return extra.reply(`❌ *Usage:* §trt <lang> <text>\n\nExample: §trt es Hello world\n§trt fr Bonjour le monde`);
        }
        
        await extra.reply(`🌐 *Translating...*`);
        
        try {
            const response = await axios.get(`https://translate.googleapis.com/translate_a/single`, {
                params: {
                    client: 'gtx',
                    sl: 'auto',
                    tl: targetLang,
                    dt: 't',
                    q: text
                }
            });
            
            const translation = response.data[0][0][0];
            
            await extra.reply(`🌐 *Translation*\n\n📝 Original: ${text}\n🔤 Translated: ${translation}\n\n> ©POWERED BY NEXUS`);
        } catch (error) {
            await extra.reply(`❌ Translation failed. Use language codes: es, fr, de, ja, etc.\n\n> ©POWERED BY NEXUS`);
        }
    }
};