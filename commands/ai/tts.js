const axios = require('axios');

module.exports = {
    name: 'tts',
    aliases: ['speak', 'say'],
    category: 'ai',
    description: 'Convert text to a voice note',
    usage: '§tts <text>',
    async execute(sock, msg, args, extra) {
        const text = args.join(' ');
        
        if (!text) {
            return extra.reply(`❌ *Usage:* §tts <text>\n\nExample: §tts Hello everyone!`);
        }
        
        if (text.length > 200) {
            return extra.reply(`❌ Text too long. Maximum 200 characters.`);
        }
        
        await extra.reply(`🔊 *Generating speech...*`);
        
        try {
            const response = await axios.post('https://api.openai.com/v1/audio/speech', {
                model: 'tts-1',
                input: text,
                voice: 'nova'
            }, {
                headers: {
                    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                responseType: 'arraybuffer'
            });
            
            const audioBuffer = Buffer.from(response.data);
            
            await sock.sendMessage(extra.from, {
                audio: audioBuffer,
                mimetype: 'audio/mpeg',
                ptt: true,
                fileName: 'tts.mp3'
            }, { quoted: msg });
        } catch (error) {
            await extra.reply(`❌ TTS failed. Please try again later.\n\n> ©POWERED BY NEXUS`);
        }
    }
};