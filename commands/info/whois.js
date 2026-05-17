const fs = require('fs');
const economyPath = './database/economy.json';

module.exports = {
    name: 'whois',
    aliases: ['userinfo', 'profile'],
    category: 'info',
    description: 'Get info about a user',
    usage: '§whois @user',
    async execute(sock, msg, args, extra) {
        const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;
        const target = mentioned ? mentioned[0] : extra.sender;
        const targetNumber = target.split('@')[0];
        
        let economy = {};
        if (fs.existsSync(economyPath)) economy = JSON.parse(fs.readFileSync(economyPath));
        const userData = economy[target] || { balance: 0, bank: 0, level: 1, xp: 0 };
        
        let formattedNumber = targetNumber;
        if (targetNumber.startsWith('254')) {
            formattedNumber = `+${targetNumber.slice(0, 3)} ${targetNumber.slice(3, 6)} ${targetNumber.slice(6)}`;
        }
        
        const userInfo = `┏━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  ◆  𝗨𝗦𝗘𝗥 𝗜𝗡𝗙𝗢
┗━━━━━━━━━━━━━━━━━━━━━━━━┛

  ◆ *Name:* ${targetNumber}
  ◆ *Phone:* ${formattedNumber}
  ◆ *Bio:* No bio
  ◆ *Role:* N/A

  ━━ 𝗘𝗰𝗼𝗻𝗼𝗺𝘆 ━━
  💰 *Wallet:* ${userData.balance.toLocaleString()}
  🏦 *Bank:* ${(userData.bank || 0).toLocaleString()}
  ⭐ *Level:* ${userData.level || 1}
  ✨ *XP:* ${(userData.xp || 0)}/${(userData.level || 1) * 1000}

  💍 *Spouse:* Single
  🏷️ *Tag:* None
  🔥 *Streak:* 1 days
  🏆 *Achievements:* 6 unlocked
  🎖️ *Badges:* 👑

━━━━━━━━━━━━━━━━━━━━━━━━━━
> ©𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 𝙽£𝚇𝚄$`;
        
        await sock.sendMessage(extra.from, {
            text: userInfo,
            mentions: [target]
        }, { quoted: msg });
    }
};