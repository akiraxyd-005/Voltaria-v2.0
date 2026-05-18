const { downloadMedia, applyAudioEffect } = require('../../lib/audioEffects');

module.exports = {
    name: 'deep',
    category: 'audio',
    description: 'Apply deep effect to audio/video',
    usage: '§deep (reply to an audio message)',
    async execute(sock, msg, args, extra) {
        const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        
        if (!quoted || (!quoted.audioMessage && !quoted.voiceMessage && !quoted.videoMessage)) {
            return extra.reply('❌ Please reply to an audio or voice message.\n\nUsage: Reply to an audio with §deep');
        }
        
        await extra.reply('🎵 Processing audio with *deep* effect...');
        
        try {
            const audioBuffer = await downloadMedia(sock, quoted);
            const processedBuffer = await applyAudioEffect(audioBuffer, 'deep');
            
            await sock.sendMessage(extra.from, {
                audio: processedBuffer,
                mimetype: 'audio/mpeg',
                fileName: 'deep_effect.mp3',
                ptt: true
            }, { quoted: msg });
        } catch (error) {
            console.error('Audio effect error:', error);
            await extra.reply('❌ Failed to process audio. Make sure FFmpeg is installed.');
        }
    }
};