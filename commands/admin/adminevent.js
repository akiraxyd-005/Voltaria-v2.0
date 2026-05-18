const fs = require('fs');
const settingsPath = './database/groupsettings.json';

module.exports = {
    name: 'adminevent',
    category: 'admin',
    description: 'Enable/Disable admin promote/demote events',
    usage: '§adminevent on/off',
    isGroup: true,
    isAdmin: true,
    async execute(sock, msg, args, extra) {
        const action = args[0]?.toLowerCase();
        let settings = {};
        if (fs.existsSync(settingsPath)) settings = JSON.parse(fs.readFileSync(settingsPath));
        
        if (!settings[extra.from]) settings[extra.from] = {};
        
        if (action === 'on') {
            settings[extra.from].adminEvents = true;
            fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
            await extra.reply(`✨ *𝐴𝑑𝑚𝑖𝑛 𝐸𝑣𝑒𝑛𝑡𝑠 𝐸𝑁𝐴𝐵𝐿𝐸𝐷* ✨\n\n𝐵𝑜𝑡 𝑤𝑖𝑙𝑙 𝑎𝑛𝑛𝑜𝑢𝑛𝑐𝑒 𝑤ℎ𝑒𝑛 𝑠𝑜𝑚𝑒𝑜𝑛𝑒 𝑖𝑠 𝑝𝑟𝑜𝑚𝑜𝑡𝑒𝑑 𝑜𝑟 𝑑𝑒𝑚𝑜𝑡𝑒𝑑.`);
        } 
        else if (action === 'off') {
            settings[extra.from].adminEvents = false;
            fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
            await extra.reply(`💤 *𝐴𝑑𝑚𝑖𝑛 𝐸𝑣𝑒𝑛𝑡𝑠 𝐷𝐼𝑆𝐴𝐵𝐿𝐸𝐷* 💤`);
        }
        else {
            const status = settings[extra.from]?.adminEvents ? '✨ 𝐸𝑁𝐴𝐵𝐿𝐸𝐷 ✨' : '💤 𝐷𝐼𝑆𝐴𝐵𝐿𝐸𝐷 💤';
            await extra.reply(`┏━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  👑 *𝐴𝐷𝑀𝐼𝑁 𝐸𝑉𝐸𝑁𝑇𝑆* 👑
┗━━━━━━━━━━━━━━━━━━━━━━━━┛

📌 *𝑆𝑡𝑎𝑡𝑢𝑠:* ${status}

📝 *𝐶𝑜𝑚𝑚𝑎𝑛𝑑𝑠:*
  §𝑎𝑑𝑚𝑖𝑛𝑒𝑣𝑒𝑛𝑡 𝑜𝑛  - 𝐴𝑛𝑛𝑜𝑢𝑛𝑐𝑒 𝑝𝑟𝑜𝑚𝑜𝑡𝑖𝑜𝑛𝑠/𝑑𝑒𝑚𝑜𝑡𝑖𝑜𝑛𝑠
  §𝑎𝑑𝑚𝑖𝑛𝑒𝑣𝑒𝑛𝑡 𝑜𝑓𝑓 - 𝐷𝑖𝑠𝑎𝑏𝑙𝑒 𝑎𝑛𝑛𝑜𝑢𝑛𝑐𝑒𝑚𝑒𝑛𝑡𝑠

> ©𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 𝙽£𝚇𝚄$`);
        }
    }
};