const fs = require('fs');
const whitelistPath = './database/linkwhitelist.json';

module.exports = {
    name: 'denylink',
    category: 'admin',
    description: 'Remove a domain from the antilink whitelist',
    usage: '§denylink <domain>',
    isGroup: true,
    isAdmin: true,
    async execute(sock, msg, args, extra) {
        const domain = args[0]?.toLowerCase();
        
        if (!domain) {
            return extra.reply(`❌ *𝑈𝑠𝑎𝑔𝑒:* §𝑑𝑒𝑛𝑦𝑙𝑖𝑛𝑘 <𝑑𝑜𝑚𝑎𝑖𝑛>\n\n𝐸𝑥𝑎𝑚𝑝𝑙𝑒: §𝑑𝑒𝑛𝑦𝑙𝑖𝑛𝑘 𝑦𝑜𝑢𝑡𝑢𝑏𝑒.𝑐𝑜𝑚`);
        }
        
        let whitelist = {};
        if (fs.existsSync(whitelistPath)) whitelist = JSON.parse(fs.readFileSync(whitelistPath));
        
        if (!whitelist[extra.from] || !whitelist[extra.from].includes(domain)) {
            return extra.reply(`⚠️ *${domain}* 𝑖𝑠 𝑛𝑜𝑡 𝑖𝑛 𝑡ℎ𝑒 𝑎𝑙𝑙𝑜𝑤𝑙𝑖𝑠𝑡.`);
        }
        
        whitelist[extra.from] = whitelist[extra.from].filter(d => d !== domain);
        fs.writeFileSync(whitelistPath, JSON.stringify(whitelist, null, 2));
        
        await extra.reply(`❌ *${domain}* ℎ𝑎𝑠 𝑏𝑒𝑒𝑛 𝑟𝑒𝑚𝑜𝑣𝑒𝑑 𝑓𝑟𝑜𝑚 𝑡ℎ𝑒 𝑎𝑙𝑙𝑜𝑤𝑙𝑖𝑠𝑡.`);
    }
};