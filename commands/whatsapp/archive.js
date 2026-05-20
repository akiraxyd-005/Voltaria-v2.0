module.exports = {
    name: 'archive',
    aliases: ['arch'],
    category: 'whatsapp',
    description: 'Archive chat',
    usage: '§archive',
    async execute(sock, msg, args, extra) {
        await sock.modifyChat(msg.chat, 'archive', { archive: true });
        await extra.reply('✅ Chat archived.');
    }
};