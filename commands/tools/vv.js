module.exports = {
    name: 'vv',
    aliases: ['viewonce', 'view'],
    category: 'tools',
    description: 'View a view-once message (saves it)',
    usage: '§vv (reply to view-once message)',
    async execute(sock, msg, args, extra) {
        const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        
        if (!quoted || !quoted.viewOnceMessageV2) {
            return extra.reply(`❌ *Usage:* Reply to a view-once message with §vv`);
        }
        
        const viewOnceMsg = quoted.viewOnceMessageV2.message;
        const messageType = Object.keys(viewOnceMsg)[0];
        
        await extra.reply(`👁️ *Processing view-once message...*`);
        
        try {
            let buffer;
            let caption = '';
            
            if (messageType === 'imageMessage') {
                const stream = await sock.downloadMediaMessage(viewOnceMsg.imageMessage);
                const chunks = [];
                for await (const chunk of stream) chunks.push(chunk);
                buffer = Buffer.concat(chunks);
                caption = `🖼️ * Here is your View-Once Image *\n\n> ©POWERED BY NEXUS`;
                await sock.sendMessage(extra.from, { image: buffer, caption }, { quoted: msg });
            } else if (messageType === 'videoMessage') {
                const stream = await sock.downloadMediaMessage(viewOnceMsg.videoMessage);
                const chunks = [];
                for await (const chunk of stream) chunks.push(chunk);
                buffer = Buffer.concat(chunks);
                caption = `🎥 * Here is your View-Once Video *\n\n> ©POWERED BY NEXUS`;
                await sock.sendMessage(extra.from, { video: buffer, caption }, { quoted: msg });
            } else {
                await extra.reply(`❌ Unsupported view-once type.\n\n> ©POWERED BY NEXUS`);
            }
        } catch (error) {
            await extra.reply(`❌ Failed to save view-once message.\n\n> ©POWERED BY NEXUS`);
        }
    }
};