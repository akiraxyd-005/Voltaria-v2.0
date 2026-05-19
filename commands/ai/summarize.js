const axios = require('axios');

module.exports = {
    name: 'summarize',
    aliases: ['sum'],
    category: 'ai',
    description: 'Summarize text (quote a message or provide text)',
    usage: '§summarize <text> | Reply to a message with §summarize',
    async execute(sock, msg, args, extra) {
        let text = args.join(' ');
        
        const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        if (!text && quoted) {
            text = quoted.conversation || quoted.extendedTextMessage?.text || '';
        }
        
        if (!text) {
            return extra.reply(`❌ *Usage:* §summarize <text>\nOr reply to a message with §summarize`);
        }
        
        if (text.length < 50) {
            return extra.reply(`❌ Text too short. Minimum 50 characters.`);
        }
        
        await extra.reply(`📝 *Summarizing...*`);
        
        try {
            const response = await axios.post('https://api.together.xyz/v1/chat/completions', {
                model: 'meta-llama/Llama-3.2-3B-Instruct',
                messages: [
                    { role: 'system', content: 'You are a summarization AI. Summarize the following text concisely.' },
                    { role: 'user', content: text }
                ],
                max_tokens: 200
            }, {
                headers: {
                    'Authorization': `Bearer ${process.env.TOGETHER_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            });
            
            const summary = response.data.choices[0].message.content;
            
            await extra.reply(`📝 *Summary*\n\n${summary}\n\n> ©POWERED BY NEXUS`);
        } catch (error) {
            await extra.reply(`❌ Summarization failed. Please try again later.\n\n> ©POWERED BY NEXUS`);
        }
    }
};