module.exports = {
    name: 'link',
    aliases: ['grouplink', 'invite'],
    category: 'group',
    description: 'Get group invite link',
    isGroup: true,
    isAdmin: true,
    async execute(sock, msg, args, extra) {
        try {
            const code = await sock.groupInviteCode(extra.from);
            const link = `https://chat.whatsapp.com/${code}`;
            await extra.reply(`🔗 *Group Invite Link*\n\n${link}`);
        } catch (error) {
            extra.reply('❌ Failed to get invite link. Make sure I am an admin and "Add Others" is enabled.');
        }
    }
};