module.exports = {
    name: 'group',
    category: 'group',
    description: 'Open or close group (admins only messaging)',
    isGroup: true,
    isAdmin: true,
    botAdmin: true,
    async execute(sock, msg, args, extra) {
        const action = args[0]?.toLowerCase();
        
        if (action === 'close') {
            await sock.groupSettingUpdate(extra.from, 'announcement');
            await extra.reply('🔒 *Group Closed*\n\nOnly admins can send messages now.');
        } else if (action === 'open') {
            await sock.groupSettingUpdate(extra.from, 'not_announcement');
            await extra.reply('🔓 *Group Opened*\n\nAll members can send messages now.');
        } else if (action === 'status') {
            const metadata = await sock.groupMetadata(extra.from);
            const status = metadata.announce ? '🔒 CLOSED (Admins only)' : '🔓 OPEN (All members)';
            await extra.reply(`📊 *Group Status*\n\n${status}`);
        } else {
            await extra.reply(`📝 *Group Control*\n\n§group open - Open group for all members\n§group close - Restrict to admins only\n§group status - Check current status`);
        }
    }
};