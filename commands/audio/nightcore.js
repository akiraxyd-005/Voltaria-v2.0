const { downloadMedia, applyAudioEffect } = require('../../lib/audioEffects');

module.exports = {
    name: 'nightcore',
    category: 'audio',
    description: 'Apply nightcore effect to audio/video',
    usage: '§nightcore (reply to an audio message)',
    async execute(sock, msg, args, extra) {
        const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        
        if (!quoted || (!quoted.audioMessage && !quoted.voiceMessage && !quoted.videoMessage)) {
            return extra.reply('❌ Please reply to an audio or voice message.\n\nUsage: Reply to an audio with §nightcore');
        }
        
        await extra.reply('🎵 Processing audio with *nightcore* effect...');
        
        try {
            const audioBuffer = await downloadMedia(sock, quoted);
            const processedBuffer = await applyAudioEffect(audioBuffer, 'nightcore');
            
            await sock.sendMessage(extra.from, {
                audio: processedBuffer,
                mimetype: 'audio/mpeg',
                fileName: 'nightcore_effect.mp3',
                ptt: true
            }, { quoted: msg });
        } catch (error) {
            await extra.reply('❌ Failed to process audio.');
        }
    }
};