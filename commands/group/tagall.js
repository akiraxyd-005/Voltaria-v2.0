module.exports = {
    name: 'tagall',
    aliases: ['everyone', 'all'],
    category: 'group',
    description: 'Tag all members in the group',
    isGroup: true,
    isAdmin: true,
    async execute(sock, msg, args, extra) {
        const metadata = await sock.groupMetadata(extra.from);
        const participants = metadata.participants;
        const message = args.join(' ') || '📢 Attention everyone!';
        
        let mentionText = `*${message}*\n\n`;
        const mentions = [];
        
        for (const participant of participants) {
            mentionText += `• @${participant.id.split('@')[0]}\n`;
            mentions.push(participant.id);
        }
        
        await sock.sendMessage(extra.from, {
            text: mentionText,
            mentions: mentions
        }, { quoted: msg });
    }
};