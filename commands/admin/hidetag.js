module.exports = {
    name: 'hidetag',
    aliases: ['htag', 'silenttag', 'ghosttag'],
    category: 'group',
    description: 'Tag all members without visible @ mention',
    usage: '§hidetag <message>',
    isGroup: true,
    isAdmin: true,
    botAdmin: true,
    async execute(sock, msg, args, extra) {
        const metadata = await sock.groupMetadata(extra.from);
        const participants = metadata.participants;
        const message = args.join(' ');
        
        if (!message) {
            return extra.reply(`❌ *Usage:* §hidetag <message>\n\nExample: §hidetag Meeting in 10 minutes!\n\n> ©POWERED BY NEXUS`);
        }
        
        // Delete the admin's command message
        await sock.sendMessage(extra.from, { delete: msg.key });
        
        const mentions = participants.map(p => p.id);
        
        await sock.sendMessage(extra.from, {
            text: message,
            mentions: mentions
        }, { quoted: msg });
    }
};