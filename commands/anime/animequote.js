const axios = require('axios');

const QUOTE_APIS = [
    'https://animechan.io/api/v1/quotes/random',
    'https://api.animefacts.xyz/api/v2/random',
];

module.exports = {
    name: 'animequote',
    aliases: ['aq', 'quote'],
    category: 'anime',
    description: 'Get random anime quotes',
    usage: '§animequote',
    async execute(sock, msg, args, extra) {
        try {
            const { data } = await axios.get(QUOTE_APIS[0], { timeout: 8000 });
            const item = data.data || data;
            const anime = item.anime?.name || item.anime || 'Unknown';
            const character = item.character?.name || item.character || 'Unknown';
            const quote = item.content || item.quote || item.text || '...';

            await extra.reply(`📖 *Anime Quote*\n\n🎭 *Anime:* ${anime}\n👤 *Character:* ${character}\n💬 *Quote:* "${quote}"`);
        } catch (e1) {
            try {
                // Fallback: static famous anime quotes
                const quotes = [
                    { anime: 'Naruto', character: 'Naruto Uzumaki', quote: "I'm not gonna run away, I never go back on my word! That's my ninja way!" },
                    { anime: 'Attack on Titan', character: 'Eren Yeager', quote: "I'll keep moving forward until I destroy every last one of them." },
                    { anime: 'One Piece', character: 'Monkey D. Luffy', quote: "I don't want to conquer anything. It's just that the person with the most freedom on the sea is the Pirate King!" },
                    { anime: 'Death Note', character: 'L Lawliet', quote: "Risking your life and doing something that could easily rob you of your life are exact opposites." },
                    { anime: 'Fullmetal Alchemist', character: 'Edward Elric', quote: "A lesson without pain is meaningless. That's because no one can gain without sacrificing something." },
                    { anime: 'Demon Slayer', character: 'Tanjiro Kamado', quote: "No matter how many times I get defeated, I'll keep fighting to protect those important to me." },
                    { anime: 'Tokyo Ghoul', character: 'Ken Kaneki', quote: "Why is it that the beautiful things are entwined more deeply with death than with life?" },
                    { anime: 'Re:Zero', character: 'Subaru Natsuki', quote: "I'm not going to say I'm sorry. I'm not going to say I was wrong. But I was glad you were there." },
                ];
                const q = quotes[Math.floor(Math.random() * quotes.length)];
                await extra.reply(`📖 *Anime Quote*\n\n🎭 *Anime:* ${q.anime}\n👤 *Character:* ${q.character}\n💬 *Quote:* "${q.quote}"`);
            } catch (e2) {
                await extra.reply('❌ Failed to fetch anime quote.');
            }
        }
    }
};
