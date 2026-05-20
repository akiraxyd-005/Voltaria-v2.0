module.exports = {
    name: 'unpinchat',
    aliases: ['unpinch'],
    category: 'whatsapp',
    description: 'Unpin chat',
    usage: '§unpinchat',
    async execute(sock, msg, args, extra) {
        await sock.modifyChat(msg.chat, 'pin', { pin: false });
        await extra.reply('✅ Chat unpinned.');
    }
};