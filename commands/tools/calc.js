module.exports = {
    name: 'calc',
    aliases: ['calculator', 'math'],
    category: 'tools',
    description: 'Evaluate mathematical expressions',
    usage: '§calc <expression>',
    async execute(sock, msg, args, extra) {
        const expression = args.join(' ');

        if (!expression) {
            return extra.reply(`❌ *Usage:* §calc <expression>\n\nExample: §calc 2 + 2 * 3`);
        }

        try {
            // Safe evaluation using Function (basic math only)
            const sanitized = expression.replace(/[^0-9+\-*/%().]/g, '');
            const result = Function(`"use strict"; return (${sanitized})`)();

            await extra.reply(`🧮 *Calculator*\n\n${expression} = ${result}\n\n> ©POWERED BY NEXUS`);
        } catch (error) {
            await extra.reply(`❌ Invalid expression. Use numbers and operators (+, -, *, /, %)\n\n> ©POWERED BY NEXUS`);
        }
    }
};