module.exports = {
    name: 'kick',
    aliases: ['remove', 'boot'],
    category: 'group',
    description: 'Remove a member from the group',
    isGroup: true,
    isAdmin: true,
    botAdmin: true,
    async execute(sock, msg, args, extra) {
        const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;
        
        if (!mentioned || mentioned.length === 0) {
            return extra.reply('❌ Please mention the user to kick.\n\nExample: §kick @user');
        }
        
        const target = mentioned[0];
        const targetName = msg.pushName || target.split('@')[0];
        
        try {
            await sock.groupParticipantsUpdate(extra.from, [target], 'remove');
            await extra.reply(`✅ *${targetName}* has been removed from the group.`);
        } catch (error) {
            extra.reply('❌ Failed to kick user. Make sure I am an admin.');
        }
    }
};