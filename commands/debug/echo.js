module.exports = {
    name: 'echo',
    aliases: ['say', 'repeat'],
    category: 'debug',
    description: 'Echo back the message (testing)',
    usage: '§echo <message>',
    async execute(sock, msg, args, extra) {
        const message = args.join(' ');
        
        if (!message) {
            return extra.reply('❌ What do you want me to echo?\n\nUsage: §echo Hello World!');
        }
        
        await extra.reply(`🔊 *You said:*\n\n${message}`);
    }
};