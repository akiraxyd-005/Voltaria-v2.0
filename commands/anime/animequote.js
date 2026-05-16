const axios = require('axios');

module.exports = {
    name: 'animequote',
    aliases: ['aq', 'quote'],
    category: 'anime',
    description: 'Get random anime quotes',
    usage: '§animequote',
    async execute(sock, msg, args, extra) {
        try {
            const { data } = await axios.get('https://animechan.xyz/api/random');
            
            const quote = `📖 *Anime Quote*\n\n🎭 *Anime:* ${data.anime}\n👤 *Character:* ${data.character}\n💬 *Quote:* "${data.quote}"`;
            
            await extra.reply(quote);
        } catch (error) {
            extra.reply('❌ Failed to fetch anime quote.');
        }
    }
};