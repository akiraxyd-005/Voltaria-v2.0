const axios = require('axios');
const FormData = require('form-data');

module.exports = {
    name: 'enhance',
    aliases: ['improve'],
    category: 'ai',
    description: 'Enhance image quality with AI. Reply to an image.',
    usage: '§enhance (reply to image)',
    async execute(sock, msg, args, extra) {
        const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        
        if (!quoted || !quoted.imageMessage) {
            return extra.reply(`❌ *Usage:* Reply to an image with §enhance`);
        }
        
        await extra.reply(`✨ *Enhancing image...*`);
        
        try {
            const stream = await sock.downloadMediaMessage(quoted);
            const chunks = [];
            for await (const chunk of stream) chunks.push(chunk);
            const imageBuffer = Buffer.concat(chunks);
            
            const formData = new FormData();
            formData.append('image', imageBuffer, 'image.png');
            
            const response = await axios.post('https://api.deepai.org/api/torch-srgan', formData, {
                headers: {
                    ...formData.getHeaders(),
                    'api-key': process.env.DEEPAI_API_KEY
                }
            });
            
            const enhancedUrl = response.data.output_url;
            const enhancedResponse = await axios.get(enhancedUrl, { responseType: 'arraybuffer' });
            const enhancedBuffer = Buffer.from(enhancedResponse.data);
            
            await sock.sendMessage(extra.from, {
                image: enhancedBuffer,
                caption: `✨ *Image Enhanced*\n\n> ©POWERED BY NEXUS`
            }, { quoted: msg });
        } catch (error) {
            await extra.reply(`❌ Enhancement failed. Please try again later.\n\n> ©POWERED BY NEXUS`);
        }
    }
};