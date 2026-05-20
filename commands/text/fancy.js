module.exports = {
    name: 'fancy',
    aliases: ['fancytext', 'style'],
    category: 'text',
    description: 'Convert text to fancy fonts (1-50)',
    usage: '§fancy <number> <text>',
    async execute(sock, msg, args, extra) {
        if (args.length < 2) return extra.reply('❌ Usage: §fancy 1 hello\nType §fancylist for styles');
        
        let styleNum = parseInt(args[0]);
        let text = args.slice(1).join(' ');
        
        if (isNaN(styleNum) || styleNum < 1 || styleNum > 50) return extra.reply('❌ Style number must be 1-50');
        
        // Map style numbers to actual font converters
        const styleMap = {
            1: str => [...str].map(c => String.fromCodePoint(c.charCodeAt(0) + 120135)).join(''),
            // Add all 50 style mappings here
        };
        
        let result = styleMap[styleNum] ? styleMap[styleNum](text) : text;
        await extra.reply(result);
    }
};