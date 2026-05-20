module.exports = {
    name: 'menu',
    aliases: ['help', 'all', 'commands'],
    category: 'menu',
    description: 'Show full bot menu',
    usage: '§menu',
    async execute(sock, msg, args, extra) {
        const uptime = process.uptime();
        const days = Math.floor(uptime / 86400);
        const hours = Math.floor((uptime % 86400) / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        
        const menu = `╭──────༺𓆩⛧𓆪༻──────╮
          .VOLTARIA.
╰──────༺𓆩⛧𓆪༻──────╯

Yo, *${msg.pushName || 'Guest'}* !

╭───────────────╮
│ ⚡ Prefix : §
│ 🚀 Version : 3.4.0
│ ⏳ Uptime : ${days}d ${hours}h ${minutes}m
│ 👥 Users : 10,051
│ 📅 Date : May 21, 2026
╰───────────────╯

༺═━━〔 COMMAND CATEGORIES 〕━━═༻

༺🤖༻ §menu ai
༺🎐༻ §menu anime
༺🎵༻ §menu audio
༺⚙️༻ §menu config
༺♻️༻ §menu debug
༺📥༻ §menu download
༺💎༻ §menu economy
༺🎉༻ §menu fun
༺🎮༻ §menu games
༺🧑‍🧑‍🧒‍🧒༻ §menu group
༺🔞༻ §menu hentai
༺ℹ️༻ §menu info
༺🎨༻ §menu logo
༺🖼️༻ §menu media
༺📦༻ §menu misc
༺⚜️༻ §menu owner
༺💫༻ §menu reactions
༺📖༻ §menu religion
༺🔍༻ §menu search
༺🔐༻ §menu session
༺⚙️༻ §menu settings
༺✍️༻ §menu text
༺🛠️༻ §menu tools
༺🧩༻ §menu utility
༺📱༻ §menu whatsapp

༺═━━〔 QUICK COMMANDS 〕━━═༻

༺⚡༻ §ping
༺🤖༻ §gpt
༺🎧༻ §play
༺🖼️༻ §sticker
༺👤༻ §profile
༺💎༻ §daily
༺🎮༻ §ttt
༺🔍༻ §weather

╭────༺☾༻────╮
│ Type §menu <category>
╰────༺☾༻────╯

> ©𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 𝙽£𝚇𝚄$`;

        const sentMsg = await extra.reply(menu);
        
        setTimeout(async () => {
            try {
                await sock.sendMessage(msg.chat, { delete: sentMsg.key });
            } catch (err) {}
        }, 2400000);
    }
};