const axios = require('axios');

module.exports = {
    name: 'sora',
    aliases: ['soraai'],
    category: 'ai',
    description: 'Generate cinematic videos using Sora AI',
    usage: '§sora <prompt>',
    async execute(sock, msg, args, extra) {
        const prompt = args.join(' ');
        
        if (!prompt) {
            return extra.reply(`❌ *Usage:* §sora <prompt>\n\nExample: §sora a cat playing`);
        }
        
        await extra.reply(`🎬 *Generating video... This may take a minute.*`);
        
        try {
            const response = await axios.post('https://api.openai.com/v1/videos/generations', {
                model: 'sora-1.0',
                prompt: prompt,
                duration: 5,
                resolution: '720p'
            }, {
                headers: {
                    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            });
            
            const videoUrl = response.data.data[0].url;
            const videoResponse = await axios.get(videoUrl, { responseType: 'arraybuffer' });
            const videoBuffer = Buffer.from(videoResponse.data);
            
            await sock.sendMessage(extra.from, {
                video: videoBuffer,
                caption: `🎬 *Sora Video*\n\nPrompt: ${prompt}\n\n> ©POWERED BY NEXUS`
            }, { quoted: msg });
        } catch (error) {
            await extra.reply(`❌ Video generation failed. Please try again later.\n\n> ©POWERED BY NEXUS`);
        }
    }
};