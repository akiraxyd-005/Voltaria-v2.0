const fs = require('fs');
const settingsPath = './database/groupsettings.json';

module.exports = {
    name: 'goodbye',
    category: 'group',
    description: 'Enable/Disable goodbye message',
    usage: '§goodbye on/off',
    isGroup: true,
    isAdmin: true,
    async execute(sock, msg, args, extra) {
        const action = args[0]?.toLowerCase();
        let settings = {};
        if (fs.existsSync(settingsPath)) settings = JSON.parse(fs.readFileSync(settingsPath));
        
        if (!settings[extra.from]) settings[extra.from] = {};
        
        if (action === 'on') {
            settings[extra.from].goodbye = true;
            fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
            await extra.reply(`💫 *𝐺𝑜𝑜𝑑𝑏𝑦𝑒 𝑚𝑒𝑠𝑠𝑎𝑔𝑒 𝐸𝑁𝐴𝐵𝐿𝐸𝐷* 💫\n\n𝐿𝑒𝑎𝑣𝑖𝑛𝑔 𝑚𝑒𝑚𝑏𝑒𝑟𝑠 𝑤𝑖𝑙𝑙 𝑟𝑒𝑐𝑒𝑖𝑣𝑒 𝑎 𝑓𝑎𝑟𝑒𝑤𝑒𝑙𝑙.\n\n𝑈𝑠𝑒 §𝑠𝑒𝑡𝑔𝑜𝑜𝑑𝑏𝑦𝑒 𝑡𝑜 𝑐𝑢𝑠𝑡𝑜𝑚𝑖𝑧𝑒~ 🎀`);
        } 
        else if (action === 'off') {
            settings[extra.from].goodbye = false;
            fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
            await extra.reply(`🍃 *𝐺𝑜𝑜𝑑𝑏𝑦𝑒 𝑚𝑒𝑠𝑠𝑎𝑔𝑒 𝐷𝐼𝑆𝐴𝐵𝐿𝐸𝐷* 🍃`);
        }
        else {
            const status = settings[extra.from]?.goodbye ? '✨ 𝐸𝑁𝐴𝐵𝐿𝐸𝐷 ✨' : '💤 𝐷𝐼𝑆𝐴𝐵𝐿𝐸𝐷 💤';
            await extra.reply(`┏━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  🍃 *𝐺𝑂𝑂𝐷𝐵𝑌𝐸 𝑆𝑌𝑆𝑇𝐸𝑀* 🍃
┗━━━━━━━━━━━━━━━━━━━━━━━━┛

📌 *𝑆𝑡𝑎𝑡𝑢𝑠:* ${status}

📝 *𝐶𝑜𝑚𝑚𝑎𝑛𝑑𝑠:*
  §𝑔𝑜𝑜𝑑𝑏𝑦𝑒 𝑜𝑛  - 𝐸𝑛𝑎𝑏𝑙𝑒 𝑓𝑎𝑟𝑒𝑤𝑒𝑙𝑙𝑠
  §𝑔𝑜𝑜𝑑𝑏𝑦𝑒 𝑜𝑓𝑓 - 𝐷𝑖𝑠𝑎𝑏𝑙𝑒 𝑓𝑎𝑟𝑒𝑤𝑒𝑙𝑙𝑠
  §𝑠𝑒𝑡𝑔𝑜𝑜𝑑𝑏𝑦𝑒  - 𝐶𝑢𝑠𝑡𝑜𝑚𝑖𝑧𝑒 𝑚𝑒𝑠𝑠𝑎𝑔𝑒

> ©𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 𝙽£𝚇𝚄$`);
        }
    }
};