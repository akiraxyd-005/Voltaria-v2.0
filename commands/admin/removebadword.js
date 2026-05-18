const fs = require('fs');
const badwordsPath = './database/badwords.json';

module.exports = {
    name: 'removebadword',
    category: 'admin',
    description: 'Remove bad words from the filter list',
    usage: '§removebadword <word>',
    isGroup: true,
    isAdmin: true,
    async execute(sock, msg, args, extra) {
        const word = args[0]?.toLowerCase();
        
        if (!word) {
            return extra.reply(`❌ *𝑈𝑠𝑎𝑔𝑒:* §𝑟𝑒𝑚𝑜𝑣𝑒𝑏𝑎𝑑𝑤𝑜𝑟𝑑 <𝑤𝑜𝑟𝑑>\n\n𝐸𝑥𝑎𝑚𝑝𝑙𝑒: §𝑟𝑒𝑚𝑜𝑣𝑒𝑏𝑎𝑑𝑤𝑜𝑟𝑑 𝑠𝑝𝑎𝑚`);
        }
        
        let badwords = {};
        if (fs.existsSync(badwordsPath)) badwords = JSON.parse(fs.readFileSync(badwordsPath));
        
        if (!badwords[extra.from] || !badwords[extra.from].includes(word)) {
            return extra.reply(`⚠️ *${word}* 𝑖𝑠 𝑛𝑜𝑡 𝑖𝑛 𝑡ℎ𝑒 𝑏𝑎𝑑 𝑤𝑜𝑟𝑑𝑠 𝑙𝑖𝑠𝑡.`);
        }
        
        badwords[extra.from] = badwords[extra.from].filter(w => w !== word);
        fs.writeFileSync(badwordsPath, JSON.stringify(badwords, null, 2));
        
        await extra.reply(`✅ 𝑅𝑒𝑚𝑜𝑣𝑒𝑑 *${word}* 𝑓𝑟𝑜𝑚 𝑏𝑎𝑑 𝑤𝑜𝑟𝑑𝑠 𝑙𝑖𝑠𝑡.`);
    }
};