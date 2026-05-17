const fs = require('fs');

module.exports = {
    name: 'broadcast',
    aliases: ['bc', 'announce'],
    category: 'owner',
    description: 'Send a message to all groups',
    usage: '§broadcast <message>',
    isOwner: true,
    async execute(sock, msg, args, extra) {
        const message = args.join(' ');
        
        if (!message) {
            return extra.reply('❌ Usage: §broadcast <message>');
        }
        
        await extra.reply('📢 *Broadcasting message to all groups...*');
        
        const groups = [];
        for (const [jid, data] of store.messages.entries()) {
            if (jid.endsWith('@g.us')) {
                groups.push(jid);
            }
        }
        
        let success = 0;
        for (const group of groups) {
            try {
                await sock.sendMessage(group, { text: `📢 *BROADCAST*\n\n${message}` });
                success++;
            } catch (e) {}
        }
        
        await extra.reply(`✅ *Broadcast complete*\n\nSent to ${success}/${groups.length} groups`);
    }
};