module.exports = {
    name: 'pin',
    aliases: ['pinmsg'],
    category: 'whatsapp',
    description: 'Pin a message (reply only)',
    usage: '§pin (reply to message)',
    async execute(sock, msg, args, extra) {
        if (!msg.isGroup) return await extra.reply('❌ Groups only.');
        let quoted = msg.quoted;
        if (!quoted) return await extra.reply('❌ Reply to a message to pin.');
        await sock.sendMessage(msg.chat, { pin: quoted.key });
        await extra.reply('✅ Message pinned successfully.');
    }
};