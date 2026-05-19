const axios = require('axios');
const FormData = require('form-data');

module.exports = {
    name: 'removebg',
    aliases: ['rmbg'],
    category: 'ai',
    description: 'Remove background from an image. Reply to an image.',
    usage: '§removebg (reply to image)',
    async execute(sock, msg, args, extra) {
        const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        
        if (!quoted || !quoted.imageMessage) {
            return extra.reply(`❌ *Usage:* Reply to an image with §removebg`);
        }
        
        await extra.reply(`✂️ *Removing background...*`);
        
        try {
            const stream = await sock.downloadMediaMessage(quoted);
            const chunks = [];
            for await (const chunk of stream) chunks.push(chunk);
            const imageBuffer = Buffer.concat(chunks);
            
            const formData = new FormData();
            formData.append('image_file', imageBuffer, 'image.png');
            formData.append('size', 'auto');
            
            const response = await axios.post('https://api.remove.bg/v1.0/removebg', formData, {
                headers: {
                    ...formData.getHeaders(),
                    'X-Api-Key': process.env.REMOVEBG_API_KEY
                },
                responseType: 'arraybuffer'
            });
            
            const processedBuffer = Buffer.from(response.data);
            
            await sock.sendMessage(extra.from, {
                image: processedBuffer,
                caption: `✂️ *Background Removed*\n\n> ©POWERED BY NEXUS`
            }, { quoted: msg });
        } catch (error) {
            await extra.reply(`❌ Background removal failed. Please try again later.\n\n> ©POWERED BY NEXUS`);
        }
    }
};