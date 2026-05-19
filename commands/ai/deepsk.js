module.exports = {
    name: 'deepsk',
    aliases: ['deepseek', 'ds'],
    category: 'ai',
    description: 'Summon the AI brain behind Voltaria',
    usage: '§deepsk <question>',
    async execute(sock, msg, args, extra) {
        const question = args.join(' ');
        
        const response = `┏━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  🧠 *DEEPSK AI* 🧠
┗━━━━━━━━━━━━━━━━━━━━━━━━┛

💭 *"I'm the brain behind Voltaria."*

${question ? `❓ *You asked:* ${question}\n\n` : ''}
✨ I help with coding, debugging, bot features, and ideas.

💡 Just ask me anything — I'm always here.

> ©POWERED BY NEXUS`;
        
        await extra.reply(response);
    }
};