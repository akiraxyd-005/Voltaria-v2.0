module.exports = {
    name: 'hidetag',
    aliases: ['htag', 'silenttag'],
    category: 'group',
    description: 'Tag all members without visible @ mention',
    isGroup: true,
    isAdmin: true,
    async execute(sock, msg, args, extra) {
        const metadata = await sock.groupMetadata(extra.from);
        const participants = metadata.participants;
        const message = args.join(' ') || '📢 Announcement from admins';
        
        const mentions = participants.map(p => p.id);
        
        await sock.sendMessage(extra.from, {
            text: message,
            mentions: mentions
        }, { quoted: msg });
    }
};