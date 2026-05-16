module.exports = {
    name: 'groupinfo',
    aliases: ['glinfo', 'gc'],
    category: 'group',
    description: 'Get group information',
    isGroup: true,
    async execute(sock, msg, args, extra) {
        const metadata = await sock.groupMetadata(extra.from);
        const participants = metadata.participants;
        const admins = participants.filter(p => p.admin === 'admin' || p.admin === 'superadmin');
        
        const info = `📊 *GROUP INFORMATION*\n\n` +
                     `📛 *Name:* ${metadata.subject}\n` +
                     `🆔 *ID:* ${metadata.id}\n` +
                     `👥 *Members:* ${participants.length}\n` +
                     `👑 *Admins:* ${admins.length}\n` +
                     `📅 *Created:* ${new Date(metadata.creation * 1000).toLocaleDateString()}\n` +
                     `🔒 *Settings:* ${metadata.announce ? 'Admins only' : 'All members'} can send messages`;
        
        await extra.reply(info);
    }
};