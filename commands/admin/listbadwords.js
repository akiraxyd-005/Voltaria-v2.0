const fs = require('fs');
const badwordsPath = './database/badwords.json';

module.exports = {
    name: 'listbadwords',
    category: 'admin',
    description: 'List all bad words in the filter',
    usage: '§listbadwords',
    isGroup: true,
    isAdmin: true,
    async execute(sock, msg, args, extra) {
        let badwords = {};
        if (fs.existsSync(badwordsPath)) badwords = JSON.parse(fs.readFileSync(badwordsPath));
        
        const words = badwords[extra.from] || [];
        
        if (words.length === 0) {
            return extra.reply(`📝 *𝑁𝑜 𝑏𝑎𝑑 𝑤𝑜𝑟𝑑𝑠 𝑎𝑑𝑑𝑒𝑑* 𝑖𝑛 𝑡ℎ𝑖𝑠 𝑔𝑟𝑜𝑢𝑝.`);
        }
        
        const wordList = words.map((w, i) => `${i+1}. ${w}`).join('\n');
        await extra.reply(`🚫 *𝐵𝑎𝑑 𝑊𝑜𝑟𝑑𝑠 𝐿𝑖𝑠𝑡*\n\n${wordList}\n\n𝑇𝑜𝑡𝑎𝑙: ${words.length} 𝑤𝑜𝑟𝑑𝑠`);
    }
};