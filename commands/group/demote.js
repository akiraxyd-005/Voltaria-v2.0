module.exports = {
    name: 'demote',
    aliases: ['removeadmin'],
    category: 'group',
    description: 'Demote an admin to member',
    isGroup: true,
    isAdmin: true,
    botAdmin: true,
    async execute(sock, msg, args, extra) {
        const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;
        
        if (!mentioned || mentioned.length === 0) {
            return extra.reply('❌ Please mention the user to demote.\n\nExample: §demote @user');
        }
        
        const target = mentioned[0];
        
        try {
            await sock.groupParticipantsUpdate(extra.from, [target], 'demote');
            await extra.reply(`✅ @${target.split('@')[0]} has been demoted to member.`, { mentions: [target] });
        } catch (error) {
            extra.reply('❌ Failed to demote user.');
        }
    }
};