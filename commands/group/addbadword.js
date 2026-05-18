const fs = require('fs');
const badwordsPath = './database/badwords.json';

module.exports = {
    name: 'addbadword',
    category: 'group',
    description: 'Add bad words to the filter list',
    usage: '§addbadword <word>',
    isGroup: true,
    isAdmin: true,
    async execute(sock, msg, args, extra) {
        const word = args[0]?.toLowerCase();
        
        if (!word) {
            return extra.reply(`❌ *𝑈𝑠𝑎𝑔𝑒:* §𝑎𝑑𝑑𝑏𝑎𝑑𝑤𝑜𝑟𝑑 <𝑤𝑜𝑟𝑑>\n\n𝐸𝑥𝑎𝑚𝑝𝑙𝑒: §𝑎𝑑𝑑𝑏𝑎𝑑𝑤𝑜𝑟𝑑 𝑠𝑝𝑎𝑚`);
        }
        
        let badwords = {};
        if (fs.existsSync(badwordsPath)) badwords = JSON.parse(fs.readFileSync(badwordsPath));
        
        if (!badwords[extra.from]) badwords[extra.from] = [];
        
        if (badwords[extra.from].includes(word)) {
            return extra.reply(`⚠️ *${word}* 𝑖𝑠 𝑎𝑙𝑟𝑒𝑎𝑑𝑦 𝑖𝑛 𝑡ℎ𝑒 𝑏𝑎𝑑 𝑤𝑜𝑟𝑑𝑠 𝑙𝑖𝑠𝑡.`);
        }
        
        badwords[extra.from].push(word);
        fs.writeFileSync(badwordsPath, JSON.stringify(badwords, null, 2));
        
        await extra.reply(`✅ 𝐴𝑑𝑑𝑒𝑑 *${word}* 𝑡𝑜 𝑏𝑎𝑑 𝑤𝑜𝑟𝑑𝑠 𝑙𝑖𝑠𝑡.`);
    }
};