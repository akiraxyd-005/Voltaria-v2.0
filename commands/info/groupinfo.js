module.exports = {
    name: 'groupinfo',
    aliases: ['glinfo', 'gc'],
    category: 'info',
    description: 'Get info about the group',
    isGroup: true,
    async execute(sock, msg, args, extra) {
        const metadata = await sock.groupMetadata(extra.from);
        const participants = metadata.participants;
        const admins = participants.filter(p => p.admin === 'admin' || p.admin === 'superadmin');
        
        const groupInfo = `┏━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  📊  *GROUP INFO*  📊
┗━━━━━━━━━━━━━━━━━━━━━━━━┛

📛 *Name:* ${metadata.subject}
🆔 *ID:* ${metadata.id}
👥 *Members:* ${participants.length}
👑 *Admins:* ${admins.length}
📅 *Created:* ${new Date(metadata.creation * 1000).toLocaleDateString()}
🔒 *Settings:* ${metadata.announce ? 'Admins only' : 'All members'} can send messages

━━━━━━━━━━━━━━━━━━━━━━━━━━
> ©𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 𝙽£𝚇𝚄$`;
        
        await extra.reply(groupInfo);
    }
};