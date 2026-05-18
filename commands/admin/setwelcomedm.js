const fs = require('fs');
const settingsPath = './database/groupsettings.json';

const defaultWelcomeDm = `🌸 *𝑊𝑒𝑙𝑐𝑜𝑚𝑒 𝑡𝑜 𝑡ℎ𝑒 𝑔𝑟𝑜𝑢𝑝!* 🌸

𝐼'𝑚 𝒜𝓂𝒶𝒾-𝒸𝒽𝒶𝓃~ 💕

𝐸𝑛𝑗𝑜𝑦 𝑦𝑜𝑢𝑟 𝑠𝑡𝑎𝑦! ✨

> ©𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 𝙽£𝚇𝚄$`;

module.exports = {
    name: 'setwelcomedm',
    category: 'admin',
    description: 'Set custom welcome DM message',
    usage: '§setwelcomedm <message>',
    isGroup: true,
    isAdmin: true,
    async execute(sock, msg, args, extra) {
        const message = args.join(' ');
        
        if (!message) {
            return extra.reply(`📝 *𝐶𝑢𝑟𝑟𝑒𝑛𝑡 𝑤𝑒𝑙𝑐𝑜𝑚𝑒 𝐷𝑀:*\n\n${defaultWelcomeDm}\n\n𝑈𝑠𝑒 §𝑠𝑒𝑡𝑤𝑒𝑙𝑐𝑜𝑚𝑒𝑑𝑚 <𝑚𝑒𝑠𝑠𝑎𝑔𝑒> 𝑡𝑜 𝑐𝑢𝑠𝑡𝑜𝑚𝑖𝑧𝑒.\n\n📌 *𝑉𝑎𝑟𝑖𝑎𝑏𝑙𝑒𝑠:*\n@𝑢𝑠𝑒𝑟 - 𝑀𝑒𝑚𝑏𝑒𝑟'𝑠 𝑛𝑎𝑚𝑒\n@𝑔𝑟𝑜𝑢𝑝 - 𝐺𝑟𝑜𝑢𝑝 𝑛𝑎𝑚𝑒`);
        }
        
        let settings = {};
        if (fs.existsSync(settingsPath)) settings = JSON.parse(fs.readFileSync(settingsPath));
        
        if (!settings[extra.from]) settings[extra.from] = {};
        
        settings[extra.from].welcomeDMMessage = message;
        fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
        
        await extra.reply(`✅ *𝑊𝑒𝑙𝑐𝑜𝑚𝑒 𝐷𝑀 𝑚𝑒𝑠𝑠𝑎𝑔𝑒 𝑢𝑝𝑑𝑎𝑡𝑒𝑑!* 💌\n\n𝑃𝑟𝑒𝑣𝑖𝑒𝑤 𝑠𝑒𝑛𝑡 𝑡𝑜 𝑦𝑜𝑢 𝑝𝑟𝑖𝑣𝑎𝑡𝑒𝑙𝑦.`);
        
        await sock.sendMessage(extra.sender, { text: `📨 *𝑃𝑟𝑒𝑣𝑖𝑒𝑤 𝑜𝑓 𝑤𝑒𝑙𝑐𝑜𝑚𝑒 𝐷𝑀:*\n\n${message.replace('@user', '𝑁𝑒𝑤 𝑀𝑒𝑚𝑏𝑒𝑟').replace('@group', '𝐺𝑟𝑜𝑢𝑝 𝑁𝑎𝑚𝑒')}` });
    }
};