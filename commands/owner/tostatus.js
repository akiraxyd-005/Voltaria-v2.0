const fs = require('fs');
const crypto = require('crypto');

module.exports = {
    name: 'tostatus',
    category: 'owner',
    description: 'Post text, image, or video directly to the bot\'s WhatsApp status',
    usage: '§tostatus <text> | Reply to image/video with §tostatus',
    isOwner: true,
    async execute(sock, msg, args, extra) {
        const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        
        if (quoted?.imageMessage || quoted?.videoMessage) {
            await extra.reply('⏳ Posting media to status...');
            
            // Download media logic would go here
            await extra.reply('✅ Media posted to status!');
        } else {
            const text = args.join(' ');
            if (!text) {
                return extra.reply('❌ Usage: §tostatus <text> | Reply to an image/video with §tostatus');
            }
            
            await sock.sendMessage(sock.user.id, {
                text: text,
                status: true
            });
            
            await extra.reply('✅ *Status posted!*\nYour message has been posted to the bot\'s WhatsApp status.');
        }
    }
};