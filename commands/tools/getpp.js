const axios = require('axios');

module.exports = {
    name: 'getpp',
    aliases: ['gp', 'profilepic', 'pp'],
    category: 'tools',
    description: 'Get profile picture of a user',
    usage: '§getpp (reply to message or tag user)',
    async execute(sock, msg, args, extra) {
        try {
            let targetUser = null;
            
            // Check if replying to a message
            const quotedMessage = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
            if (quotedMessage) {
                targetUser = msg.message.extendedTextMessage.contextInfo.participant;
            } 
            // Check if user is tagged
            else {
                const mentionedJid = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;
                if (mentionedJid && mentionedJid.length > 0) {
                    targetUser = mentionedJid[0];
                } else {
                    // Default to sender
                    targetUser = extra.sender;
                }
            }
            
            if (!targetUser) {
                return extra.reply(`❌ Could not identify target user. Reply to a message or tag a user.\n\n> ©POWERED BY NEXUS`);
            }
            
            try {
                const ppUrl = await sock.profilePictureUrl(targetUser, 'image');
                
                if (!ppUrl) {
                    return extra.reply(`❌ Profile picture not found.\n\n> ©POWERED BY NEXUS`);
                }
                
                const response = await axios.get(ppUrl, { responseType: 'arraybuffer' });
                const buffer = Buffer.from(response.data);
                
                await sock.sendMessage(extra.from, {
                    image: buffer,
                    caption: `👤 Profile picture of @${targetUser.split('@')[0]}\n\n> ©POWERED BY NEXUS`,
                    mentions: [targetUser]
                }, { quoted: msg });
                
            } catch (profileError) {
                return extra.reply(`❌ Profile picture not found (private or no profile).\n\n> ©POWERED BY NEXUS`);
            }
            
        } catch (error) {
            await extra.reply(`❌ Could not fetch profile picture.\n\n> ©POWERED BY NEXUS`);
        }
    }
};