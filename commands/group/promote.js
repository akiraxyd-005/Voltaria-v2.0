module.exports = {
    name: 'promote',
    aliases: ['makeadmin'],
    category: 'group',
    description: 'Promote a member to admin',
    isGroup: true,
    isAdmin: true,
    botAdmin: true,
    async execute(sock, msg, args, extra) {
        const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;
        
        if (!mentioned || mentioned.length === 0) {
            return extra.reply('❌ Please mention the user to promote.\n\nExample: §promote @user');
        }
        
        const target = mentioned[0];
        
        try {
            await sock.groupParticipantsUpdate(extra.from, [target], 'promote');
            await extra.reply(`✅ @${target.split('@')[0]} has been promoted to admin.`, { mentions: [target] });
        } catch (error) {
            extra.reply('❌ Failed to promote user.');
        }
    }
};