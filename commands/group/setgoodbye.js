const fs = require('fs');
const settingsPath = './database/groupsettings.json';

const defaultGoodbyeMessage = `🌸 *𝐺𝑜𝑜𝑑𝑏𝑦𝑒 @𝑢𝑠𝑒𝑟* 🌸

𝑊𝑒'𝑟𝑒 𝑠𝑎𝑑 𝑡𝑜 𝑠𝑒𝑒 𝑦𝑜𝑢 𝑔𝑜! 💔
𝑇𝑎𝑘𝑒 𝑐𝑎𝑟𝑒~ 🍃

> ©𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 𝙽£𝚇𝚄$`;

module.exports = {
    name: 'setgoodbye',
    category: 'group',
    description: 'Set custom goodbye message',
    usage: '§setgoodbye <message>',
    isGroup: true,
    isAdmin: true,
    async execute(sock, msg, args, extra) {
        const message = args.join(' ');
        
        if (!message) {
            return extra.reply(`📝 *𝐶𝑢𝑟𝑟𝑒𝑛𝑡 𝑔𝑜𝑜𝑑𝑏𝑦𝑒 𝑚𝑒𝑠𝑠𝑎𝑔𝑒:*\n\n${defaultGoodbyeMessage}\n\n𝑈𝑠𝑒 §𝑠𝑒𝑡𝑔𝑜𝑜𝑑𝑏𝑦𝑒 <𝑚𝑒𝑠𝑠𝑎𝑔𝑒> 𝑡𝑜 𝑐𝑢𝑠𝑡𝑜𝑚𝑖𝑧𝑒.\n\n📌 *𝑉𝑎𝑟𝑖𝑎𝑏𝑙𝑒𝑠:*\n@𝑢𝑠𝑒𝑟 - 𝑀𝑒𝑛𝑡𝑖𝑜𝑛𝑠 𝑡ℎ𝑒 𝑙𝑒𝑎𝑣𝑖𝑛𝑔 𝑚𝑒𝑚𝑏𝑒𝑟\n@𝑔𝑟𝑜𝑢𝑝 - 𝐺𝑟𝑜𝑢𝑝 𝑛𝑎𝑚𝑒`);
        }
        
        let settings = {};
        if (fs.existsSync(settingsPath)) settings = JSON.parse(fs.readFileSync(settingsPath));
        
        if (!settings[extra.from]) settings[extra.from] = {};
        
        settings[extra.from].goodbyeMessage = message;
        fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
        
        await extra.reply(`✅ *𝐺𝑜𝑜𝑑𝑏𝑦𝑒 𝑚𝑒𝑠𝑠𝑎𝑔𝑒 𝑢𝑝𝑑𝑎𝑡𝑒𝑑!* 🍃\n\n𝑃𝑟𝑒𝑣𝑖𝑒𝑤:\n${message.replace('@user', '@𝑚𝑒𝑚𝑏𝑒𝑟')}`);
    }
};