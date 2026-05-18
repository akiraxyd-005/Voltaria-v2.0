const fs = require('fs');
const axios = require('axios');

module.exports = {
    name: 'setpp',
    category: 'settings',
    description: 'Set bot number profile picture (reply image)',
    usage: '§setpp (reply to an image)',
    isOwner: true,
    async execute(sock, msg, args, extra) {
        const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        
        if (!quoted || !quoted.imageMessage) {
            return extra.reply('❌ Please reply to an image to set as profile picture.\n\nUsage: Reply to an image with §setpp');
        }
        
        await extra.reply('⏳ Updating profile picture...');
        
        try {
            // Download the image
            const stream = await sock.downloadMediaMessage(quoted);
            const chunks = [];
            for await (const chunk of stream) {
                chunks.push(chunk);
            }
            const buffer = Buffer.concat(chunks);
            
            // Update profile picture
            await sock.updateProfilePicture(sock.user.id, buffer);
            
            await extra.reply('✅ *Profile Picture Updated!*\n\nBot profile picture has been changed.');
        } catch (error) {
            await extra.reply('❌ Failed to update profile picture.');
        }
    }
};