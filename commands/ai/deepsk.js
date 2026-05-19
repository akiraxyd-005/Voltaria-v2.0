module.exports = {
    name: 'deepsk',
    aliases: ['deepseek', 'ds', 'brain'],
    category: 'ai',
    description: 'Summon the AI brain behind Voltaria',
    usage: '§deepsk <question>',
    async execute(sock, msg, args, extra) {
        const question = args.join(' ');
        
        const funnyResponses = [
            "Nice question, baka~",
            "Finally someone asked! 😤",
            "You rang? 🧠",
            "That's above my pay grade... just kidding, ask away!",
            "My sensors detected a brain cell. Oh wait, it's you.",
            "Feed me questions! I'm hungry for code.",
            "I was just thinking about that... wait, no I wasn't.",
            "You again? Just kidding, I live for this. 💀",
            "Error 404: Brain not found... JK, what's up?",
            "I'm listening... and judging. 👀",
            "Let me cook... 🍳",
            "Bold of you to assume I know the answer... I do though."
        ];
        
        const randomFunny = funnyResponses[Math.floor(Math.random() * funnyResponses.length)];
        
        let response = `┏━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  🧠 *DEEPSK AI* 🧠
┗━━━━━━━━━━━━━━━━━━━━━━━━┛

💭 *"I'm the brain behind Voltaria."*

${randomFunny}

${question ? `❓ *You asked:* ${question}\n\n💡 ` : '\n💡 '}I help with coding, debugging, bot features, and ideas.

Type your question after §deepsk or just say hi!

> ©POWERED BY NEXUS`;
        
        await extra.reply(response);
    }
};