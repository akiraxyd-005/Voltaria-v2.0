const fs = require('fs');
const analyticsPath = './database/analytics.json';

module.exports = {
    name: 'kickinactive',
    category: 'group',
    description: 'Kick inactive/ghost members using analytics data',
    usage: '§kickinactive <days>',
    isGroup: true,
    isAdmin: true,
    botAdmin: true,
    async execute(sock, msg, args, extra) {
        const days = parseInt(args[0]) || 7;
        const metadata = await sock.groupMetadata(extra.from);
        
        let analytics = {};
        if (fs.existsSync(analyticsPath)) analytics = JSON.parse(fs.readFileSync(analyticsPath));
        
        const groupAnalytics = analytics[extra.from]?.data || {};
        const cutoff = Date.now() - (days * 24 * 60 * 60 * 1000);
        
        const inactiveUsers = [];
        for (const [userId, data] of Object.entries(groupAnalytics)) {
            if (data.lastMessage < cutoff) {
                inactiveUsers.push(userId);
            }
        }
        
        if (inactiveUsers.length === 0) {
            return extra.reply(`📝 *𝑁𝑜 𝑖𝑛𝑎𝑐𝑡𝑖𝑣𝑒 𝑚𝑒𝑚𝑏𝑒𝑟𝑠 𝑓𝑜𝑢𝑛𝑑* 𝑖𝑛 𝑡ℎ𝑒 𝑙𝑎𝑠𝑡 ${days} 𝑑𝑎𝑦𝑠.`);
        }
        
        await extra.reply(`⏳ *𝐹𝑜𝑢𝑛𝑑 ${inactiveUsers.length} 𝑖𝑛𝑎𝑐𝑡𝑖𝑣𝑒 𝑚𝑒𝑚𝑏𝑒𝑟𝑠. 𝐾𝑖𝑐𝑘𝑖𝑛𝑔...*`);
        
        let kicked = 0;
        for (const user of inactiveUsers.slice(0, 20)) {
            try {
                await sock.groupParticipantsUpdate(extra.from, [user], 'remove');
                kicked++;
            } catch (e) {}
        }
        
        await extra.reply(`👢 *𝐾𝑖𝑐𝑘𝑒𝑑 ${kicked} 𝑖𝑛𝑎𝑐𝑡𝑖𝑣𝑒 𝑚𝑒𝑚𝑏𝑒𝑟𝑠*\n\n𝑈𝑠𝑒𝑟𝑠 𝑖𝑛𝑎𝑐𝑡𝑖𝑣𝑒 𝑓𝑜𝑟 ${days}+ 𝑑𝑎𝑦𝑠 ℎ𝑎𝑣𝑒 𝑏𝑒𝑒𝑛 𝑟𝑒𝑚𝑜𝑣𝑒𝑑.`);
    }
};