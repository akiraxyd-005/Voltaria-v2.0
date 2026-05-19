const jimp = require('jimp');
const jsQR = require('jsqr');

module.exports = {
    name: 'readqr',
    aliases: ['scanqr', 'decodqr', 'qrread'],
    category: 'tools',
    description: 'Read/Scan QR code from an image',
    usage: '§readqr (reply to image containing QR code)',
    async execute(sock, msg, args, extra) {
        const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        
        if (!quoted || !quoted.imageMessage) {
            return extra.reply(`❌ *Usage:* Reply to an image containing a QR code with §readqr`);
        }
        
        await extra.reply(`📱 *Scanning QR code...*`);
        
        try {
            const stream = await sock.downloadMediaMessage(quoted);
            const chunks = [];
            for await (const chunk of stream) chunks.push(chunk);
            const imageBuffer = Buffer.concat(chunks);
            
            const image = await jimp.read(imageBuffer);
            const width = image.bitmap.width;
            const height = image.bitmap.height;
            const pixels = new Uint8ClampedArray(image.bitmap.data);
            
            const code = jsQR(pixels, width, height);
            
            if (!code) {
                return extra.reply(`❌ No QR code found in the image.\n\n> ©POWERED BY NEXUS`);
            }
            
            await extra.reply(`📱 *QR Code Content*\n\n${code.data}\n\n> ©POWERED BY NEXUS`);
        } catch (error) {
            await extra.reply(`❌ QR code reading failed.\n\n> ©POWERED BY NEXUS`);
        }
    }
};