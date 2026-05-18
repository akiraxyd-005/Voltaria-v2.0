const fs = require('fs');
const settingsPath = './database/groupsettings.json';

module.exports = {
    name: 'antibad',
    category: 'admin',
    description: 'Set anti-bad words mode (off/delete/warn/kick)',
    usage: '§antibad off | delete | warn | kick',
    isGroup: true,
    isAdmin: true,
    async execute(sock, msg, args, extra) {
        const mode = args[0]?.toLowerCase();
        const validModes = ['off', 'delete', 'warn', 'kick'];
        
        if (!mode || !validModes.includes(mode)) {
            return extra.reply(`❓ *𝑈𝑠𝑎𝑔𝑒:* §𝑎𝑛𝑡𝑖𝑏𝑎𝑑 𝑜𝑓𝑓 | 𝑑𝑒𝑙𝑒𝑡𝑒 | 𝑤𝑎𝑟𝑛 | 𝑘𝑖𝑐𝑘

• *𝑑𝑒𝑙𝑒𝑡𝑒* - 𝐷𝑒𝑙𝑒𝑡𝑒 𝑏𝑎𝑑 𝑤𝑜𝑟𝑑𝑠
• *𝑤𝑎𝑟𝑛* - 𝑊𝑎𝑟𝑛 𝑢𝑠𝑒𝑟 (3 𝑤𝑎𝑟𝑛𝑠 = 𝑘𝑖𝑐𝑘)
• *𝑘𝑖𝑐𝑘* - 𝐼𝑛𝑠𝑡𝑎𝑛𝑡𝑙𝑦 𝑘𝑖𝑐𝑘 𝑢𝑠𝑒𝑟`);
        }
        
        let settings = {};
        if (fs.existsSync(settingsPath)) settings = JSON.parse(fs.readFileSync(settingsPath));
        
        if (!settings[extra.from]) settings[extra.from] = {};
        
        settings[extra.from].antibad = mode;
        fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
        
        const modeEmoji = mode === 'off' ? '❌' : mode === 'delete' ? '🗑️' : mode === 'warn' ? '⚠️' : '👢';
        await extra.reply(`${modeEmoji} *𝐴𝑛𝑡𝑖-𝐵𝑎𝑑 𝑊𝑜𝑟𝑑𝑠 𝑚𝑜𝑑𝑒 𝑠𝑒𝑡 𝑡𝑜: ${mode.toUpperCase()}*`);
    }
};