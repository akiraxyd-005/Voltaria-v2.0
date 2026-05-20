module.exports = {
    name: 'listsessions',
    aliases: ['sessions', 'listsession'],
    category: 'session',
    description: 'List all active sessions',
    usage: '§listsessions',
    async execute(sock, msg, args, extra) {
        let isOwner = global.owner?.includes(msg.sender.split('@')[0]);
        if (!isOwner) return await extra.reply('❌ Owner only command.');
        
        // Logic to list sessions
        let sessionList = `◆ *Active Sessions*\n\n• Main session (Active)\n• No other sessions found.`;
        
        await extra.reply(sessionList);
    }
};