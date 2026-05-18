const fs = require('fs');
const settingsPath = './database/groupsettings.json';

const defaultWelcomeMessage = `╔════════════════════════════════════╗
║     🌸 *𝑊𝑒𝑙𝑐𝑜𝑚𝑒 𝑡𝑜 𝑡ℎ𝑒 𝑔𝑟𝑜𝑢𝑝!* 🌸
╚════════════════════════════════════╝

       ✨ *𝑊𝑒𝑙𝑐𝑜𝑚𝑒 @𝑢𝑠𝑒𝑟 ✨*

   🌸 *𝐺𝑟𝑜𝑢𝑝:* @𝑔𝑟𝑜𝑢𝑝
   👥 *𝑀𝑒𝑚𝑏𝑒𝑟𝑠:* #𝑚𝑒𝑚𝑏𝑒𝑟𝐶𝑜𝑢𝑛𝑡

𝑀𝑎𝑘𝑒 𝑓𝑟𝑖𝑒𝑛𝑑𝑠, 𝑛𝑜𝑡 𝑓𝑜𝑒𝑠!
𝑊𝑒𝑙𝑐𝑜𝑚𝑒 𝑡𝑜 𝑡ℎ𝑒 𝑓𝑎𝑚𝑖𝑙𝑦~ 💕

> ©𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 𝙽£𝚇𝚄$`;

module.exports = {
    name: 'setwelcome',
    category: 'admin',
    description: 'Set custom welcome message',
    usage: '§setwelcome <message>',
    isGroup: true,
    isAdmin: true,
    async execute(sock, msg, args, extra) {
        const message = args.join(' ');
        
        if (!message) {
            return extra.reply(`📝 *𝐶𝑢𝑟𝑟𝑒𝑛𝑡 𝑤𝑒𝑙𝑐𝑜𝑚𝑒 𝑚𝑒𝑠𝑠𝑎𝑔𝑒:*\n\n${defaultWelcomeMessage}\n\n𝑈𝑠𝑒 §𝑠𝑒𝑡𝑤𝑒𝑙𝑐𝑜𝑚𝑒 <𝑚𝑒𝑠𝑠𝑎𝑔𝑒> 𝑡𝑜 𝑐𝑢𝑠𝑡𝑜𝑚𝑖𝑧𝑒.\n\n📌 *𝑉𝑎𝑟𝑖𝑎𝑏𝑙𝑒𝑠:*\n@𝑢𝑠𝑒𝑟 - 𝑀𝑒𝑛𝑡𝑖𝑜𝑛𝑠 𝑡ℎ𝑒 𝑛𝑒𝑤 𝑚𝑒𝑚𝑏𝑒𝑟\n@𝑔𝑟𝑜𝑢𝑝 - 𝐺𝑟𝑜𝑢𝑝 𝑛𝑎𝑚𝑒\n#𝑚𝑒𝑚𝑏𝑒𝑟𝐶𝑜𝑢𝑛𝑡 - 𝑇𝑜𝑡𝑎𝑙 𝑚𝑒𝑚𝑏𝑒𝑟𝑠\n#𝑡𝑖𝑚𝑒 - 𝐶𝑢𝑟𝑟𝑒𝑛𝑡 𝑡𝑖𝑚𝑒`);
        }
        
        let settings = {};
        if (fs.existsSync(settingsPath)) settings = JSON.parse(fs.readFileSync(settingsPath));
        
        if (!settings[extra.from]) settings[extra.from] = {};
        
        settings[extra.from].welcomeMessage = message;
        fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
        
        await extra.reply(`✅ *𝑊𝑒𝑙𝑐𝑜𝑚𝑒 𝑚𝑒𝑠𝑠𝑎𝑔𝑒 𝑢𝑝𝑑𝑎𝑡𝑒𝑑!* ✨\n\n𝑃𝑟𝑒𝑣𝑖𝑒𝑤:\n${message.replace('@user', '@member').replace('@group', '𝐺𝑟𝑜𝑢𝑝 𝑁𝑎𝑚𝑒')}`);
    }
};