module.exports = {
    name: 'forward',
    aliases: ['fw'],
    category: 'whatsapp',
    description: 'Forward a quoted message to a number or group',
    usage: '§forward <number/groupID>',
    async execute(sock, msg, args, extra) {
        let quoted = msg.quoted;
        if (!quoted) return await extra.reply('❌ Reply to a message to forward.');
        let target = args[0];
        if (!target) return await extra.reply('❌ Provide a number or group ID.\nUsage: §forward 254700123456');
        await sock.sendMessage(target, { forward: quoted });
        await extra.reply(`✅ Forwarded to ${target}`);
    }
};