const path = require('path');
const fs = require('fs');

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

        const menu = `╔════════════════════════╗
║     *⎋Voltaria DASHBOARD⎋*
╚════════════════════════╝
 » 👤 *USER:* ${msg.pushName || 'Guest'}
 » 🚀 *UPTIME:* ${days}d ${hours}h ${minutes}m
 » 🏷️ *PREFIX:* §
 » 📦 *VERSION:* 3.4.0
══════════════════════════

┌───⊷ 🤖 *ai*
│ ⌘ §gpt
│ ⌘ §gemini
│ ⌘ §vision
│ ⌘ §summarize
│ ⌘ §recipe
│ ⌘ §tts
│ ⌘ §removebg
│ ⌘ §enhance
│ ⌘ §upscale
│ ⌘ §agentmode
└──────────────⊷

┌───⊷ 🎌 *anime*
│ ⌘ §anime
│ ⌘ §animequote
│ ⌘ §waifu
│ ⌘ §neko
│ ⌘ §foxxgirl
│ ⌘ §character
└──────────────⊷

┌───⊷ 🎵 *audio*
│ ⌘ §deep
│ ⌘ §nightcore
│ ⌘ §robot
│ ⌘ §bass
│ ⌘ §chipmunk
│ ⌘ §earrape
│ ⌘ §slow
│ ⌘ §fast
│ ⌘ §reverse
└──────────────⊷

┌───⊷ 📥 *download*
│ ⌘ §play
│ ⌘ §yt
│ ⌘ §ytvideo
│ ⌘ §yts
│ ⌘ §tiktok
│ ⌘ §instagram
│ ⌘ §twitter
│ ⌘ §facebook
│ ⌘ §capcut
└──────────────⊷

┌───⊷ 💰 *economy*
│ ⌘ §balance
│ ⌘ §work
│ ⌘ §daily
│ ⌘ §rob
│ ⌘ §pay
│ ⌘ §slots
│ ⌘ §blackjack
│ ⌘ §coinflip
│ ⌘ §dice
│ ⌘ §profile
└──────────────⊷

┌───⊷ 🎮 *games*
│ ⌘ §ttt
│ ⌘ §hangman
│ ⌘ §trivia
│ ⌘ §wordle
│ ⌘ §riddle
│ ⌘ §whoami
│ ⌘ §wyr
└──────────────⊷

┌───⊷ 👥 *group*
│ ⌘ §tagall
│ ⌘ §poll
│ ⌘ §warn
│ ⌘ §kick
│ ⌘ §promote
│ ⌘ §demote
│ ⌘ §mute
│ ⌘ §antilink
│ ⌘ §welcome
│ ⌘ §goodbye
└──────────────⊷

┌───⊷ 🔞 *hentai*
│ ⌘ §waifu
│ ⌘ §hentai
│ ⌘ §hentaigif
│ ⌘ §trap
│ ⌘ §cum
│ ⌘ §panties
└──────────────⊷

┌───⊷ ℹ️ *info*
│ ⌘ §botinfo
│ ⌘ §groupinfo
│ ⌘ §whois
│ ⌘ §getpp
│ ⌘ §cinfo
│ ⌘ §repo
└──────────────⊷

┌───⊷ 🖼️ *media*
│ ⌘ §toimg
│ ⌘ §tomp3
│ ⌘ §toaudio
│ ⌘ §toptt
│ ⌘ §tovideo
│ ⌘ §togif
└──────────────⊷

┌───⊷ 🎯 *misc*
│ ⌘ §ping
│ ⌘ §uptime
│ ⌘ §alive
│ ⌘ §owner
│ ⌘ §echo
│ ⌘ §report
└──────────────⊷

┌───⊷ 👑 *owner*
│ ⌘ §on
│ ⌘ §off
│ ⌘ §nsfw
│ ⌘ §broadcast
│ ⌘ §restart
│ ⌘ §ban
│ ⌘ §unban
└──────────────⊷

┌───⊷ 💕 *reactions*
│ ⌘ §hug
│ ⌘ §kiss
│ ⌘ §slap
│ ⌘ §pat
│ ⌘ §cuddle
│ ⌘ §dance
└──────────────⊷

┌───⊷ 📖 *religion*
│ ⌘ §bible
│ ⌘ §quran
└──────────────⊷

┌───⊷ 🔍 *search*
│ ⌘ §google
│ ⌘ §image
│ ⌘ §weather
│ ⌘ §news
│ ⌘ §wiki
└──────────────⊷

┌───⊷ 🔐 *session*
│ ⌘ §pair
│ ⌘ §addsession
│ ⌘ §listsessions
│ ⌘ §delsession
└──────────────⊷

┌───⊷ ⚙️ *settings*
│ ⌘ §setbio
│ ⌘ §setname
│ ⌘ §setpp
│ ⌘ §getprivacy
│ ⌘ §setprivacy
└──────────────⊷

┌───⊷ 📝 *text*
│ ⌘ §say
│ ⌘ §fancy
│ ⌘ §fancylist
└──────────────⊷

┌───⊷ ✨ *textmaker*
│ ⌘ §1917
│ ⌘ §neon
│ ⌘ §glitch
│ ⌘ §fire
│ ⌘ §matrix
│ ⌘ §hacker
└──────────────⊷

┌───⊷ 🔧 *tools*
│ ⌘ §sticker
│ ⌘ §qr
│ ⌘ §readqr
│ ⌘ §schedule
│ ⌘ §trt
│ ⌘ §ss
│ ⌘ §afk
│ ⌘ §calc
└──────────────⊷

┌───⊷ 🛠️ *utility*
│ ⌘ §fakeid
│ ⌘ §tempmail
│ ⌘ §remind
│ ⌘ §tourl
└──────────────⊷

┌───⊷ 📱 *whatsapp*
│ ⌘ §unsend
│ ⌘ §forward
│ ⌘ §block
│ ⌘ §unblock
│ ⌘ §clear
│ ⌘ §pinchat
│ ⌘ §archive
│ ⌘ §del
└──────────────⊷

━━━━━━━━━━━━━━━━━━━━━━━━━━
📂 *View a category:*
  §menu <category>

  🤖 ai  •  🎌 anime  •  🎵 audio  •  📥 download  •  💰 economy
  🎮 games  •  👥 group  •  🔞 hentai  •  ℹ️ info  •  🖼️ media
  🎯 misc  •  👑 owner  •  💕 reactions  •  📖 religion  •  🔍 search
  🔐 session  •  ⚙️ settings  •  📝 text  •  ✨ textmaker  •  🔧 tools
  🛠️ utility  •  📱 whatsapp

━━━━━━━━━━━━━━━━━━━━━━━━━━
> ©ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴠᴏʟᴛᴀʀɪᴀ ɴᴇxᴜꜱ`;

        const menuImagePath = path.join(__dirname, '../../assets/menu.png');

        try {
            if (fs.existsSync(menuImagePath)) {
                const imageBuffer = fs.readFileSync(menuImagePath);
                await sock.sendMessage(msg.chat, {
                    image: imageBuffer,
                    caption: menu,
                    mimetype: 'image/png'
                });
            } else {
                await extra.reply(menu);
            }
        } catch (err) {
            console.error('Menu send error:', err.message);
            await extra.reply(menu);
        }
    }
};
