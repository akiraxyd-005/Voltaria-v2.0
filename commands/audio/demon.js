const { downloadMedia, applyAudioEffect } = require('../../lib/audioEffects');

module.exports = {
    name: 'demon',
    category: 'audio',
    description: 'Apply demon effect to audio/video',
    usage: '§demon (reply to an audio message)',
    async execute(sock, msg, args, extra) {
        const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        
        if (!quoted || (!quoted.audioMessage && !quoted.voiceMessage && !quoted.videoMessage)) {
            return extra.reply('❌ Please reply to an audio or voice message.\n\nUsage: Reply to an audio with §demon');
        }
        
        await extra.reply('👹 Processing audio with *demon* effect...');
        
        try {
            const audioBuffer = await downloadMedia(sock, quoted);
            const processedBuffer = await applyAudioEffect(audioBuffer, 'demon');
            
            await sock.sendMessage(extra.from, {
                audio: processedBuffer,
                mimetype: 'audio/mpeg',
                fileName: 'demon_effect.mp3',
                ptt: true
            }, { quoted: msg });
        } catch (error) {
            await extra.reply('❌ Failed to process audio.');
        }
    }
};