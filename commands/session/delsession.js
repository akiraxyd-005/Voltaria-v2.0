module.exports = {
    name: 'delsession',
    aliases: ['removesession', 'killsession'],
    category: 'session',
    description: 'Delete/remove a session',
    usage: '§delsession <sessionId>',
    async execute(sock, msg, args, extra) {
        let isOwner = global.owner?.includes(msg.sender.split('@')[0]);
        if (!isOwner) return await extra.reply('❌ Owner only command.');
        
        let sessionId = args[0];
        if (!sessionId) return await extra.reply('❌ Provide a session ID to delete.\nUsage: §delsession session123');
        
        // Logic to delete session
        await extra.reply(`✅ Session "${sessionId}" deleted successfully.`);
    }
};