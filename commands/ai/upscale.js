const axios = require('axios');
const FormData = require('form-data');

module.exports = {
    name: 'upscale',
    aliases: ['enhanceimage'],
    category: 'ai',
    description: 'Upscale an image 2x or 4x. Reply to an image.',
    usage: '§upscale (reply to image)',
    async execute(sock, msg, args, extra) {
        const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        
        if (!quoted || !quoted.imageMessage) {
            return extra.reply(`❌ *Usage:* Reply to an image with §upscale`);
        }
        
        await extra.reply(`🔍 *Upscaling image...*`);
        
        try {
            const stream = await sock.downloadMediaMessage(quoted);
            const chunks = [];
            for await (const chunk of stream) chunks.push(chunk);
            const imageBuffer = Buffer.concat(chunks);
            
            const response = await axios.post('https://api.replicate.com/v1/predictions', {
                version: 'python-inference',
                input: { image: imageBuffer.toString('base64'), scale: 4 }
            }, {
                headers: {
                    'Authorization': `Token ${process.env.REPLICATE_API_KEY}`
                }
            });
            
            const upscaledBuffer = Buffer.from(response.data.output, 'base64');
            
            await sock.sendMessage(extra.from, {
                image: upscaledBuffer,
                caption: `🔍 *Upscaled Image*\n\n> ©POWERED BY NEXUS`
            }, { quoted: msg });
        } catch (error) {
            await extra.reply(`❌ Upscaling failed. Please try again later.\n\n> ©POWERED BY NEXUS`);
        }
    }
};