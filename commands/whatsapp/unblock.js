module.exports = {
    name: 'unblock',
    aliases: [],
    category: 'whatsapp',
    description: 'Unblock a user (reply, tag, or number)',
    usage: '§unblock <@tag/reply/number>',
    async execute(sock, msg, args, extra) {
        let user = msg.mentionedJid[0] || msg.quoted?.sender || args[0];
        if (!user) return await extra.reply('❌ Reply, tag, or provide a number.');
        await sock.updateBlockStatus(user, 'unblock');
        await extra.reply(`✅ Unblocked: ${user}`);
    }
};