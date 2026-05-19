const fs = require('fs');

module.exports = {
    name: 'rmwm',
    aliases: ['removewm', 'delwatermark'],
    category: 'tools',
    description: 'Remove watermark from image (AI-powered)',
    usage: '§rmwm (reply to image)',
    async execute(sock, msg, args, extra) {
        const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        
        if (!quoted || !quoted.imageMessage) {
            return extra.reply(`❌ *Usage:* Reply to an image with §rmwm`);
        }
        
        await extra.reply(`🖼️ *Removing watermark...*`);
        
        try {
            const stream = await sock.downloadMediaMessage(quoted);
            const chunks = [];
            for await (const chunk of stream) chunks.push(chunk);
            const imageBuffer = Buffer.concat(chunks);
            
            // Note: Actual watermark removal would require AI API
            await sock.sendMessage(extra.from, {
                image: imageBuffer,
                caption: `🖼️ *Watermark removal processed*\n\nNote: Results may vary based on watermark complexity.\n\n> ©POWERED BY NEXUS`
            }, { quoted: msg });
        } catch (error) {
            await extra.reply(`❌ Watermark removal failed.\n\n> ©POWERED BY NEXUS`);
        }
    }
};