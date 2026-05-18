const fs = require('fs');
const settingsPath = './database/groupsettings.json';

module.exports = {
    name: 'welcome',
    category: 'admin',
    description: 'Enable/Disable welcome message',
    usage: '§welcome on/off',
    isGroup: true,
    isAdmin: true,
    async execute(sock, msg, args, extra) {
        const action = args[0]?.toLowerCase();
        let settings = {};
        if (fs.existsSync(settingsPath)) settings = JSON.parse(fs.readFileSync(settingsPath));
        
        if (!settings[extra.from]) settings[extra.from] = {};
        
        if (action === 'on') {
            settings[extra.from].welcome = true;
            fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
            await extra.reply(`✨ *𝑊𝑒𝑙𝑐𝑜𝑚𝑒 𝑚𝑒𝑠𝑠𝑎𝑔𝑒 𝐸𝑁𝐴𝐵𝐿𝐸𝐷* ✨\n\n𝑁𝑒𝑤 𝑚𝑒𝑚𝑏𝑒𝑟𝑠 𝑤𝑖𝑙𝑙 𝑏𝑒 𝑔𝑟𝑒𝑒𝑡𝑒𝑑.\n\n𝑈𝑠𝑒 §𝑠𝑒𝑡𝑤𝑒𝑙𝑐𝑜𝑚𝑒 𝑡𝑜 𝑐𝑢𝑠𝑡𝑜𝑚𝑖𝑧𝑒~ 🌸`);
        } 
        else if (action === 'off') {
            settings[extra.from].welcome = false;
            fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
            await extra.reply(`💤 *𝑊𝑒𝑙𝑐𝑜𝑚𝑒 𝑚𝑒𝑠𝑠𝑎𝑔𝑒 𝐷𝐼𝑆𝐴𝐵𝐿𝐸𝐷* 💤`);
        }
        else {
            const status = settings[extra.from]?.welcome ? '✨ 𝐸𝑁𝐴𝐵𝐿𝐸𝐷 ✨' : '💤 𝐷𝐼𝑆𝐴𝐵𝐿𝐸𝐷 💤';
            await extra.reply(`┏━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  🎀 *𝑊𝐸𝐿𝐶𝑂𝑀𝐸 𝑆𝑌𝑆𝑇𝐸𝑀* 🎀
┗━━━━━━━━━━━━━━━━━━━━━━━━┛

📌 *𝑆𝑡𝑎𝑡𝑢𝑠:* ${status}

📝 *𝐶𝑜𝑚𝑚𝑎𝑛𝑑𝑠:*
  §𝑤𝑒𝑙𝑐𝑜𝑚𝑒 𝑜𝑛  - 𝐸𝑛𝑎𝑏𝑙𝑒 𝑔𝑟𝑒𝑒𝑡𝑖𝑛𝑔𝑠
  §𝑤𝑒𝑙𝑐𝑜𝑚𝑒 𝑜𝑓𝑓 - 𝐷𝑖𝑠𝑎𝑏𝑙𝑒 𝑔𝑟𝑒𝑒𝑡𝑖𝑛𝑔𝑠
  §𝑠𝑒𝑡𝑤𝑒𝑙𝑐𝑜𝑚𝑒  - 𝐶𝑢𝑠𝑡𝑜𝑚𝑖𝑧𝑒 𝑚𝑒𝑠𝑠𝑎𝑔𝑒

> ©𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 𝙽£𝚇𝚄$`);
        }
    }
};