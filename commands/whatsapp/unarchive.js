module.exports = {
    name: 'unarchive',
    aliases: ['unarch'],
    category: 'whatsapp',
    description: 'Unarchive chat',
    usage: '§unarchive',
    async execute(sock, msg, args, extra) {
        await sock.modifyChat(msg.chat, 'archive', { archive: false });
        await extra.reply('✅ Chat unarchived.');
    }
};