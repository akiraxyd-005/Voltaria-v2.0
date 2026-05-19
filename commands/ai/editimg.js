const axios = require('axios');
const FormData = require('form-data');

module.exports = {
    name: 'editimg',
    aliases: ['editimage'],
    category: 'ai',
    description: 'Edit an image using AI. Reply to an image with a prompt.',
    usage: '§editimg <prompt> (reply to image)',
    async execute(sock, msg, args, extra) {
        const prompt = args.join(' ');
        const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        
        if (!quoted || !quoted.imageMessage) {
            return extra.reply(`❌ *Usage:* Reply to an image with §editimg <prompt>`);
        }
        
        if (!prompt) {
            return extra.reply(`❌ Please provide an edit prompt.`);
        }
        
        await extra.reply(`🎨 *Editing image...*`);
        
        try {
            const stream = await sock.downloadMediaMessage(quoted);
            const chunks = [];
            for await (const chunk of stream) chunks.push(chunk);
            const imageBuffer = Buffer.concat(chunks);
            
            const formData = new FormData();
            formData.append('image', imageBuffer, 'image.png');
            formData.append('prompt', prompt);
            
            const response = await axios.post('https://api.stability.ai/v1/image/edit', formData, {
                headers: {
                    ...formData.getHeaders(),
                    'Authorization': `Bearer ${process.env.STABILITY_API_KEY}`
                }
            });
            
            const editedBuffer = Buffer.from(response.data.image, 'base64');
            
            await sock.sendMessage(extra.from, {
                image: editedBuffer,
                caption: `🎨 *Edited Image*\n\nPrompt: ${prompt}\n\n> ©POWERED BY NEXUS`
            }, { quoted: msg });
        } catch (error) {
            await extra.reply(`❌ Editing failed. Please try again later.\n\n> ©POWERED BY NEXUS`);
        }
    }
};