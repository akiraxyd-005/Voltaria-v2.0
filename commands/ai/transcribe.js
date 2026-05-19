const axios = require('axios');
const FormData = require('form-data');

module.exports = {
    name: 'transcribe',
    aliases: ['audio2text'],
    category: 'ai',
    description: 'Convert speech to text from audio/video',
    usage: '§transcribe (reply to audio/voice message)',
    async execute(sock, msg, args, extra) {
        const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        
        if (!quoted || (!quoted.audioMessage && !quoted.voiceMessage)) {
            return extra.reply(`❌ *Usage:* Reply to an audio message with §transcribe`);
        }
        
        await extra.reply(`🎤 *Transcribing audio...*`);
        
        try {
            const stream = await sock.downloadMediaMessage(quoted);
            const chunks = [];
            for await (const chunk of stream) chunks.push(chunk);
            const audioBuffer = Buffer.concat(chunks);
            
            const formData = new FormData();
            formData.append('file', audioBuffer, 'audio.mp3');
            formData.append('model', 'whisper-1');
            
            const response = await axios.post('https://api.openai.com/v1/audio/transcriptions', formData, {
                headers: {
                    ...formData.getHeaders(),
                    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
                }
            });
            
            const transcription = response.data.text;
            
            await extra.reply(`🎤 *Transcription*\n\n${transcription}\n\n> ©POWERED BY NEXUS`);
        } catch (error) {
            await extra.reply(`❌ Transcription failed. Please try again later.\n\n> ©POWERED BY NEXUS`);
        }
    }
};