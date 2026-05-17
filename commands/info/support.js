module.exports = {
    name: 'support',
    aliases: ['links', 'community'],
    category: 'info',
    description: 'Get support links for Voltaria',
    usage: '§support',
    async execute(sock, msg, args, extra) {
        const supportInfo = `╭━━━━━━━━━━━━━━━━━━━━━━━━╮
┃      📢 *SUPPORT & LINKS*
╰━━━━━━━━━━━━━━━━━━━━━━━━╯

✦ *WhatsApp Channel*
https://whatsapp.com/channel/0029VbD6zwN4tRrvLtUTya0I

✦ *WhatsApp Community*
https://chat.whatsapp.com/E5vC8SxmkKXJ0ufWRwIc3l

✦ *Developer Contact*
https://wa.me/message/FBILJ7AVPXCEC1

━━━━━━━━━━━━━━━━━━━━━━━━━━
✦ *GitHub Repository*
https://github.com/akiraxyd-005/Voltaria-v2.0

━━━━━━━━━━━━━━━━━━━━━━━━━━
> ©𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 𝙽£𝚇𝚄$`;
        
        await extra.reply(supportInfo);
    }
};