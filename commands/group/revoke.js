module.exports = {
    name: 'revoke',
    aliases: ['resetlink', 'newlink'],
    category: 'group',
    description: 'Revoke and generate new group invite link',
    isGroup: true,
    isAdmin: true,
    async execute(sock, msg, args, extra) {
        try {
            await sock.groupRevokeInvite(extra.from);
            const code = await sock.groupInviteCode(extra.from);
            const link = `https://chat.whatsapp.com/${code}`;
            await extra.reply(`🔗 *New Group Invite Link*\n\n${link}`);
        } catch (error) {
            extra.reply('❌ Failed to revoke invite link.');
        }
    }
};