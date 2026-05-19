module.exports = {
    name: 'vv2',
    aliases: ['viewonce2', 'v2'],
    category: 'tools',
    description: 'Alternative view-once viewer',
    usage: '§vv2 (reply to view-once message)',
    async execute(sock, msg, args, extra) {
        const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        
        if (!quoted || !quoted.viewOnceMessageV2) {
            return extra.reply(`❌ *Usage:* Reply to a view-once message with §vv2`);
        }
        
        await extra.reply(`👁️ *Alternative method - Processing...*`);
        
        try {
            const viewOnceMsg = quoted.viewOnceMessageV2.message;
            const messageType = Object.keys(viewOnceMsg)[0];
            
            if (messageType === 'imageMessage') {
                const mediaMsg = viewOnceMsg.imageMessage;
                const stream = await sock.downloadMediaMessage(mediaMsg);
                const chunks = [];
                for await (const chunk of stream) chunks.push(chunk);
                const buffer = Buffer.concat(chunks);
                
                await sock.sendMessage(extra.from, {
                    image: buffer,
                    caption: `🖼️ *View-Once Image (Alternative)*\n\n> ©POWERED BY NEXUS`
                }, { quoted: msg });
            } else if (messageType === 'videoMessage') {
                const mediaMsg = viewOnceMsg.videoMessage;
                const stream = await sock.downloadMediaMessage(mediaMsg);
                const chunks = [];
                for await (const chunk of stream) chunks.push(chunk);
                const buffer = Buffer.concat(chunks);
                
                await sock.sendMessage(extra.from, {
                    video: buffer,
                    caption: `🎥 *View-Once Video (Alternative)*\n\n> ©POWERED BY NEXUS`
                }, { quoted: msg });
            } else {
                await extra.reply(`❌ No view-once media found.\n\n> ©POWERED BY NEXUS`);
            }
        } catch (error) {
            await extra.reply(`❌ Alternative method failed.\n\n> ©POWERED BY NEXUS`);
        }
    }
};