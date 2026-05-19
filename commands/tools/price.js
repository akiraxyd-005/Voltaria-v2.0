const axios = require('axios');

module.exports = {
    name: 'price',
    aliases: ['crypto', 'coin'],
    category: 'tools',
    description: 'Get cryptocurrency or stock price',
    usage: '§price <symbol>',
    async execute(sock, msg, args, extra) {
        const symbol = args[0]?.toUpperCase();
        
        if (!symbol) {
            return extra.reply(`❌ *Usage:* §price <symbol>\n\nExample: §price BTC\n§price ETH\n§price TSLA`);
        }
        
        await extra.reply(`📊 *Fetching ${symbol} price...*`);
        
        try {
            const response = await axios.get(`https://api.coingecko.com/api/v3/simple/price`, {
                params: {
                    ids: symbol.toLowerCase(),
                    vs_currencies: 'usd'
                }
            });
            
            const price = response.data[symbol.toLowerCase()]?.usd;
            
            if (!price) {
                return extra.reply(`❌ Symbol "${symbol}" not found.\n\n> ©POWERED BY NEXUS`);
            }
            
            await extra.reply(`💰 *${symbol.toUpperCase()} Price*\n\n💵 $${price.toLocaleString()} USD\n\n> ©POWERED BY NEXUS`);
        } catch (error) {
            await extra.reply(`❌ Price fetch failed. Please try again later.\n\n> ©POWERED BY NEXUS`);
        }
    }
};