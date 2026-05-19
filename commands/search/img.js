const axios = require('axios');

module.exports = {
    name: 'img',
    aliases: ['image', 'pics'],
    category: 'search',
    description: 'Search images online',
    usage: '§img <query>',
    async execute(sock, msg, args, extra) {
        const query = args.join(' ');
        
        if (!query) {
            return extra.reply(`❌ *Usage:* §img <query>\n\nExample: §img beautiful sunset`);
        }
        
        await extra.reply(`🖼️ *Searching images for "${query}"...*`);
        
        try {
            const response = await axios.get('https://pixabay.com/api/', {
                params: {
                    key: process.env.PIXABAY_API_KEY,
                    q: query,
                    image_type: 'photo',
                    per_page: 5
                }
            });
            
            const images = response.data.hits;
            
            if (!images || images.length === 0) {
                return extra.reply(`❌ No images found for "${query}".`);
            }
            
            const randomImage = images[Math.floor(Math.random() * images.length)];
            const imageResponse = await axios.get(randomImage.webformatURL, { responseType: 'arraybuffer' });
            const imageBuffer = Buffer.from(imageResponse.data);
            
            await sock.sendMessage(extra.from, {
                image: imageBuffer,
                caption: `🖼️ *Image: ${query}*\n\n📷 Source: Pixabay\n❤️ ${randomImage.likes} likes\n\n> ©POWERED BY NEXUS`
            }, { quoted: msg });
        } catch (error) {
            await extra.reply(`❌ Image search failed. Please try again later.\n\n> ©POWERED BY NEXUS`);
        }
    }
};