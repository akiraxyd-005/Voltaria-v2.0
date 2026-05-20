module.exports = {
    name: 'del',
    aliases: ['delete', 'remove'],
    category: 'whatsapp',
    description: 'Delete a message for everyone (admin/owner only)',
    usage: '§del (reply to message)',
    async execute(sock, msg, args, extra) {
        let isAdmin = msg.isGroup ? (msg.isAdmin || msg.isSuperAdmin) : true;
        let isOwner = global.owner?.includes(msg.sender.split('@')[0]);
        
        if (!isAdmin && !isOwner) return await extra.reply('❌ Admin or owner only.');
        
        let quoted = msg.quoted;
        if (!quoted) return await extra.reply('❌ Reply to a message to delete.');
        
        await sock.sendMessage(msg.chat, { delete: quoted.key });
        await extra.reply('✅ Message deleted for everyone.');
    }
};