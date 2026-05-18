const crypto = require('crypto');

module.exports = {
    name: 'groupid',
    aliases: ['gcid', 'gcode'],
    category: 'admin',
    description: 'Get this group\'s unique ID and confession code',
    usage: '§groupid',
    isGroup: true,
    async execute(sock, msg, args, extra) {
        const groupId = extra.from;
        const groupCode = crypto.createHash('md5').update(groupId).digest('hex').substring(0, 6);
        
        await extra.reply(`┏━━━━━━━━━━━━━━━━━━┓
┃  🔑 𝐺𝑅𝑂𝑈𝑃 𝐼𝐷
┗━━━━━━━━━━━━━━━━━━┛

📱 *𝐺𝑟𝑜𝑢𝑝 𝐼𝐷:* ${groupId}
🏷️ *𝐶𝑜𝑛𝑓𝑒𝑠𝑠𝑖𝑜𝑛 𝐶𝑜𝑑𝑒:* ${groupCode}

━━━━━━━━━━━━━━━━━━━━━━━━━━
> ©𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 𝙽£𝚇𝚄$`);
    }
};