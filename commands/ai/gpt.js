const axios = require('axios');

module.exports = {
    name: 'gpt',
    aliases: ['chatgpt'],
    category: 'ai',
    description: 'Chat with AI using Llama 3.3',
    usage: '§gpt <question>',
    async execute(sock, msg, args, extra) {
        const question = args.join(' ');
        
        if (!question) {
            return extra.reply(`❌ *Usage:* §gpt <question>\n\nExample: §gpt What is the capital of France?`);
        }
        
        await extra.reply(`🧠 *Thinking...*`);

        const tryApis = async () => {
            if (process.env.TOGETHER_API_KEY) {
                const r = await axios.post('https://api.together.xyz/v1/chat/completions', {
                    model: 'meta-llama/Llama-3.3-70B-Instruct-Turbo',
                    messages: [{ role: 'user', content: question }],
                    max_tokens: 500
                }, { headers: { 'Authorization': `Bearer ${process.env.TOGETHER_API_KEY}`, 'Content-Type': 'application/json' }, timeout: 20000 });
                return r.data.choices[0].message.content;
            }
            const encoded = encodeURIComponent(question);
            const r = await axios.get(`https://text.pollinations.ai/${encoded}`, { timeout: 20000 });
            return typeof r.data === 'string' ? r.data : JSON.stringify(r.data);
        };

        try {
            const answer = await tryApis();
            await extra.reply(`🧠 *Response*\n\n${answer}\n\n> ©POWERED BY NEXUS`);
        } catch (error) {
            await extra.reply(`❌ AI service unavailable. Please try again later.\n\n> ©POWERED BY NEXUS`);
        }
    }
};