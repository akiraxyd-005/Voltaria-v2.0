const axios = require('axios');

module.exports = {
    name: 'currency',
    aliases: ['exchange', 'convert'],
    category: 'search',
    description: 'Convert currency using exchangerate-api.com',
    usage: '§currency <amount> <from> <to>',
    async execute(sock, msg, args, extra) {
        const amount = parseFloat(args[0]);
        const from = args[1]?.toUpperCase();
        const to = args[2]?.toUpperCase();
        
        if (!amount || !from || !to) {
            return extra.reply(`❌ *Usage:* §currency <amount> <from> <to>\n\nExample: §currency 100 USD EUR`);
        }
        
        await extra.reply(`💱 *Converting ${amount} ${from} to ${to}...*`);
        
        try {
            const response = await axios.get(`https://api.exchangerate-api.com/v4/latest/${from}`);
            const rate = response.data.rates[to];
            
            if (!rate) {
                return extra.reply(`❌ Invalid currency code. Use USD, EUR, GBP, etc.`);
            }
            
            const converted = (amount * rate).toFixed(2);
            
            await extra.reply(`💱 *Currency Conversion*\n\n${amount} ${from} = ${converted} ${to}\n\n📊 *Exchange Rate:* 1 ${from} = ${rate} ${to}\n\n> ©POWERED BY NEXUS`);
        } catch (error) {
            await extra.reply(`❌ Currency conversion failed. Please check currency codes.\n\n> ©POWERED BY NEXUS`);
        }
    }
};