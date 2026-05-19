const axios = require('axios');

module.exports = {
    name: 'vision',
    aliases: ['describe'],
    category: 'ai',
    description: 'Analyze an image with AI. Reply to image with optional question.',
    usage: '§vision <question> (reply to image)',
    async execute(sock, msg, args, extra) {
        const question = args.join(' ') || 'Describe this image in detail.';
        const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        
        if (!quoted || !quoted.imageMessage) {
            return extra.reply(`❌ *Usage:* Reply to an image with §vision`);
        }
        
        await extra.reply(`👁️ *Analyzing image...*`);
        
        try {
            const stream = await sock.downloadMediaMessage(quoted);
            const chunks = [];
            for await (const chunk of stream) chunks.push(chunk);
            const imageBuffer = Buffer.concat(chunks);
            const base64Image = imageBuffer.toString('base64');
            
            const response = await axios.post('https://api.openai.com/v1/chat/completions', {
                model: 'gpt-4-vision-preview',
                messages: [
                    {
                        role: 'user',
                        content: [
                            { type: 'text', text: question },
                            { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${base64Image}` } }
                        ]
                    }
                ],
                max_tokens: 300
            }, {
                headers: {
                    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            });
            
            const description = response.data.choices[0].message.content;
            
            await extra.reply(`👁️ *Analysis*\n\n${description}\n\n> ©POWERED BY NEXUS`);
        } catch (error) {
            await extra.reply(`❌ Analysis failed. Please try again later.\n\n> ©POWERED BY NEXUS`);
        }
    }
};