module.exports = {
    name: 'say',
    aliases: ['repeat'],
    category: 'text',
    description: 'Repeat text multiple times',
    usage: '§say <text> <number>',
    async execute(sock, msg, args, extra) {
        if (!args.length) return extra.reply('❌ Usage: §say hello 5');
        
        let count = parseInt(args[args.length - 1]);
        let text = args.slice(0, -1).join(' ');
        
        if (isNaN(count) || count < 1 || count > 50) return extra.reply('❌ Number must be 1-50');
        
        let result = '';
        for (let i = 0; i < count; i++) {
            result += text + (i < count - 1 ? '\n' : '');
        }
        await extra.reply(result);
    }
};