const fs = require('fs');
const settingsPath = './database/groupsettings.json';

module.exports = {
    name: 'welcomedm',
    category: 'admin',
    description: 'Enable/Disable DM to new members',
    usage: '§welcomedm on/off',
    isGroup: true,
    isAdmin: true,
    async execute(sock, msg, args, extra) {
        const action = args[0]?.toLowerCase();
        let settings = {};
        if (fs.existsSync(settingsPath)) settings = JSON.parse(fs.readFileSync(settingsPath));
        
        if (!settings[extra.from]) settings[extra.from] = {};
        
        if (action === 'on') {
            settings[extra.from].welcomeDM = true;
            fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
            await extra.reply(`💌 *𝑊𝑒𝑙𝑐𝑜𝑚𝑒 𝐷𝑀 𝐸𝑁𝐴𝐵𝐿𝐸𝐷* 💌\n\n𝑁𝑒𝑤 𝑚𝑒𝑚𝑏𝑒𝑟𝑠 𝑤𝑖𝑙𝑙 𝑟𝑒𝑐𝑒𝑖𝑣𝑒 𝑎 𝑝𝑟𝑖𝑣𝑎𝑡𝑒 𝑚𝑒𝑠𝑠𝑎𝑔𝑒.\n\n𝑈𝑠𝑒 §𝑠𝑒𝑡𝑤𝑒𝑙𝑐𝑜𝑚𝑒𝑑𝑚 𝑡𝑜 𝑐𝑢𝑠𝑡𝑜𝑚𝑖𝑧𝑒 𝑡ℎ𝑒 𝐷𝑀~`);
        } 
        else if (action === 'off') {
            settings[extra.from].welcomeDM = false;
            fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
            await extra.reply(`📪 *𝑊𝑒𝑙𝑐𝑜𝑚𝑒 𝐷𝑀 𝐷𝐼𝑆𝐴𝐵𝐿𝐸𝐷* 📪`);
        }
        else {
            const status = settings[extra.from]?.welcomeDM ? '✨ 𝐸𝑁𝐴𝐵𝐿𝐸𝐷 ✨' : '💤 𝐷𝐼𝑆𝐴𝐵𝐿𝐸𝐷 💤';
            await extra.reply(`┏━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  💌 *𝑊𝐸𝐿𝐶𝑂𝑀𝐸 𝐷𝑀* 💌
┗━━━━━━━━━━━━━━━━━━━━━━━━┛

📌 *𝑆𝑡𝑎𝑡𝑢𝑠:* ${status}

📝 *𝐶𝑜𝑚𝑚𝑎𝑛𝑑𝑠:*
  §𝑤𝑒𝑙𝑐𝑜𝑚𝑒𝑑𝑚 𝑜𝑛   - 𝑆𝑒𝑛𝑑 𝐷𝑀𝑠 𝑡𝑜 𝑛𝑒𝑤 𝑚𝑒𝑚𝑏𝑒𝑟𝑠
  §𝑤𝑒𝑙𝑐𝑜𝑚𝑒𝑑𝑚 𝑜𝑓𝑓  - 𝐷𝑖𝑠𝑎𝑏𝑙𝑒 𝐷𝑀𝑠
  §𝑠𝑒𝑡𝑤𝑒𝑙𝑐𝑜𝑚𝑒𝑑𝑚   - 𝐶𝑢𝑠𝑡𝑜𝑚𝑖𝑧𝑒 𝐷𝑀 𝑚𝑒𝑠𝑠𝑎𝑔𝑒

> ©𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 𝙽£𝚇𝚄$`);
        }
    }
};