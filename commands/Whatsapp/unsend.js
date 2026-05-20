module.exports = {
    name: 'unsend',
    aliases: [],
    category: 'whatsapp',
    description: 'Delete your sent message (reply only)',
    usage: '§unsend',
    async execute(sock, msg, args, extra) {
        let quoted = msg.quoted;
        if (!quoted) return await extra.reply('❌ Reply to your own message to unsend it.');
        if (quoted.key.fromMe) {
            await sock.sendMessage(msg.chat, { delete: quoted.key });
            await extra.reply('✅ Message deleted successfully.');
        } else {
            await extra.reply('❌ You can only delete your own messages.');
        }
    }
};