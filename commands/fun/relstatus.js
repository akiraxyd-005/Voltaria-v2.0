const fs = require('fs');
const relationshipsPath = './database/relationships.json';

module.exports = {
    name: 'relstatus',
    aliases: ['relationship'],
    category: 'fun',
    description: 'View your relationship status',
    usage: '§relstatus @user (optional)',
    async execute(sock, msg, args, extra) {
        const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;
        const target = mentioned ? mentioned[0] : extra.sender;
        
        let relationships = {};
        if (fs.existsSync(relationshipsPath)) relationships = JSON.parse(fs.readFileSync(relationshipsPath));
        
        const userData = relationships[target];
        
        let statusText = `💑 *RELATIONSHIP STATUS*\n\n👤 @${target.split('@')[0]}\n`;
        
        if (!userData) {
            statusText += `💔 Status: *Single and ready to mingle!*`;
        } else if (userData.status === 'married') {
            statusText += `💍 Status: *Married* to @${userData.partner.split('@')[0]}\n📅 Since: ${new Date(userData.since).toLocaleDateString()}`;
        } else if (userData.dating) {
            statusText += `💕 Status: *Dating* @${userData.dating.split('@')[0]}\n📅 Since: ${new Date(userData.datingSince).toLocaleDateString()}`;
        } else if (userData.status === 'mixed_feelings') {
            statusText += `💭 Status: *Mixed Feelings* (confused about what they want)`;
        } else {
            statusText += `💔 Status: *Single and ready to mingle!*`;
        }
        
        await sock.sendMessage(extra.from, {
            text: statusText,
            mentions: [target, userData?.partner, userData?.dating].filter(Boolean)
        }, { quoted: msg });
    }
};