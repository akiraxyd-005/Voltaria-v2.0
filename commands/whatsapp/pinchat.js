module.exports = {
    name: 'pinchat',
    aliases: ['pinch'],
    category: 'whatsapp',
    description: 'Pin chat to top',
    usage: '§pinchat',
    async execute(sock, msg, args, extra) {
        await sock.modifyChat(msg.chat, 'pin', { pin: true });
        await extra.reply('✅ Chat pinned to top.');
    }
};