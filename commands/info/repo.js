module.exports = {
    name: 'repo',
    category: 'info',
    description: 'View the Voltaria GitHub repository and support links',
    usage: '§repo',
    async execute(sock, msg, args, extra) {
        const repoInfo = `╭━━━━━━━━━━━━━━━━━━━━━━━━╮
┃      ◆ *VOLTARIA REPO*
╰━━━━━━━━━━━━━━━━━━━━━━━━╯

✦ *Repository:* Voltaria-v2.0
✦ *Owner:* Arashi
✦ *Language:* JavaScript / TypeScript

━━━━━━━━━━━━━━━━━━━━━━━━━━
◈ *GitHub Links*
━━━━━━━━━━━━━━━━━━━━━━━━━━

◆ *Visit Repo*
https://github.com/akiraxyd-005/Voltaria-v2.0

◆ *Fork It*
https://github.com/akiraxyd-005/Voltaria-v2.0/fork

◆ *Download ZIP*
https://github.com/akiraxyd-005/Voltaria-v2.0/archive/refs/heads/main.zip

━━━━━━━━━━━━━━━━━━━━━━━━━━
◈ *Community & Support*
━━━━━━━━━━━━━━━━━━━━━━━━━━

📢 *WhatsApp Channel*
https://whatsapp.com/channel/0029VbD6zwN4tRrvLtUTya0I

👥 *WhatsApp Community*
https://chat.whatsapp.com/E5vC8SxmkKXJ0ufWRwIc3l

👤 *Developer Contact*
https://wa.me/message/FBILJ7AVPXCEC1

━━━━━━━━━━━━━━━━━━━━━━━━━━
> ©𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 𝙽£𝚇𝚄$`;
        
        await extra.reply(repoInfo);
    }
};