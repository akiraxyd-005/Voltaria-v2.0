const crypto = require('crypto');

module.exports = {
    name: 'groupid',
    aliases: ['gcid', 'gcode'],
    category: 'group',
    description: 'Get this group\'s unique ID and confession code',
    usage: '§groupid',
    isGroup: true,
    async execute(sock, msg, args, extra) {
        const groupId = extra.from;
        const groupCode = crypto.createHash('md5').update(groupId).digest('hex').substring(0, 6);
        
        await extra.reply(`┏━━━━━━━━━━━━━━━━━━┓
┃  🔑 𝗚𝗥𝗢𝗨𝗣 𝗜𝗗
┗━━━━━━━━━━━━━━━━━━┛

📱 *Group ID:* ${groupId}
🏷️ *Confession Code:* ${groupCode}

━━━━━━━━━━━━━━━━━━━━━━━━━━
> ©𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 𝙽£𝚇𝚄$`);
    }
};