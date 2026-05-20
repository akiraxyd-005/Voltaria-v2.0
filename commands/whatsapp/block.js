module.exports = {
    name: 'block',
    aliases: [],
    category: 'whatsapp',
    description: 'Block a user (reply, tag, or number)',
    usage: '§block <@tag/reply/number>',
    async execute(sock, msg, args, extra) {
        let user = msg.mentionedJid[0] || msg.quoted?.sender || args[0];
        if (!user) return await extra.reply('❌ Reply, tag, or provide a number.');
        await sock.updateBlockStatus(user, 'block');
        await extra.reply(`✅ Blocked: ${user}`);
    }
};