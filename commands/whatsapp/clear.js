module.exports = {
    name: 'clear',
    aliases: ['clearchat'],
    category: 'whatsapp',
    description: 'Clear chat with user or group',
    usage: '§clear <@tag/reply/number>',
    async execute(sock, msg, args, extra) {
        let target = msg.mentionedJid[0] || msg.quoted?.sender || args[0] || msg.chat;
        await sock.modifyChat(target, 'delete', { includeStarred: false });
        await extra.reply('✅ Chat cleared successfully.');
    }
};