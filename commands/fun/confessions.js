const fs = require('fs');
const crypto = require('crypto');
const confessionsPath = './database/confessions.json';

module.exports = {
    name: 'confessions',
    aliases: ['confession'],
    category: 'fun',
    description: 'Enable/disable anonymous confessions in this group',
    isGroup: true,
    isAdmin: true,
    async execute(sock, msg, args, extra) {
        const action = args[0]?.toLowerCase();
        let confessions = {};
        if (fs.existsSync(confessionsPath)) confessions = JSON.parse(fs.readFileSync(confessionsPath));
        
        // Generate unique group code (first 8 chars of group ID hash)
        const groupId = extra.from;
        const groupCode = crypto.createHash('md5').update(groupId).digest('hex').substring(0, 4);
        
        if (!confessions[groupId]) {
            confessions[groupId] = {
                enabled: false,
                code: groupCode,
                total: 0,
                messages: []
            };
        }
        
        if (action === 'on') {
            confessions[groupId].enabled = true;
            fs.writeFileSync(confessionsPath, JSON.stringify(confessions, null, 2));
            
            await extra.reply(`┏━━━━━━━━━━━━━━━━━━┓
┃  🎭 𝗖𝗢𝗡𝗙𝗘𝗦𝗦𝗜𝗢𝗡𝗦
┗━━━━━━━━━━━━━━━━━━┛

📌 Status: *ON*
🏷️ Group code: *${confessions[groupId].code}*
📊 Total confessions: ${confessions[groupId].total}

💡 People can DM the bot with:
   \`confess ${confessions[groupId].code} Your message\``);
        } 
        else if (action === 'off') {
            confessions[groupId].enabled = false;
            fs.writeFileSync(confessionsPath, JSON.stringify(confessions, null, 2));
            
            await extra.reply(`┏━━━━━━━━━━━━━━━━━━┓
┃  🎭 𝗖𝗢𝗡𝗙𝗘𝗦𝗦𝗜𝗢𝗡𝗦
┗━━━━━━━━━━━━━━━━━━┛

📌 Status: *OFF*
🏷️ Group code: *${confessions[groupId].code}*
📊 Total confessions: ${confessions[groupId].total}

💡 Confessions are now disabled in this group.`);
        }
        else {
            const status = confessions[groupId].enabled ? 'ON' : 'OFF';
            await extra.reply(`┏━━━━━━━━━━━━━━━━━━┓
┃  🎭 𝗖𝗢𝗡𝗙𝗘𝗦𝗦𝗜𝗢𝗡𝗦
┗━━━━━━━━━━━━━━━━━━┛

📌 Status: *${status}*
🏷️ Group code: *${confessions[groupId].code}*
📊 Total confessions: ${confessions[groupId].total}

Usage: §confessions on/off

💡 When enabled, people DM the bot with:
   confess ${confessions[groupId].code} Your message`);
        }
    }
};