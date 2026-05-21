const path = require('path');
const fs = require('fs');

const CATEGORY_EMOJI = {
    admin:     '🛡️',
    ai:        '🤖',
    anime:     '🎌',
    audio:     '🎵',
    debug:     '🔍',
    download:  '📥',
    economy:   '💰',
    fun:       '🎉',
    games:     '🎮',
    group:     '👥',
    hentai:    '🔞',
    info:      'ℹ️',
    owner:     '👑',
    reactions: '💕',
    religion:  '📖',
    search:    '🔎',
    session:   '🔐',
    settings:  '⚙️',
    text:      '📝',
    textmaker: '✨',
    tools:     '🔧',
    whatsapp:  '📱',
};

const SKIP_CATEGORIES = new Set(['menu', 'general']);

function buildMenu(pushName, days, hours, minutes) {
    const commandsDir = path.join(__dirname, '../../commands');
    const categories = fs.readdirSync(commandsDir)
        .filter(c => {
            if (SKIP_CATEGORIES.has(c)) return false;
            return fs.statSync(path.join(commandsDir, c)).isDirectory();
        })
        .sort();

    let sections = '';
    let categoryList = [];

    for (const cat of categories) {
        const emoji = CATEGORY_EMOJI[cat] || '📌';
        const catDir = path.join(commandsDir, cat);
        const cmds = fs.readdirSync(catDir)
            .filter(f => f.endsWith('.js'))
            .map(f => '§' + f.replace('.js', ''))
            .sort();

        if (cmds.length === 0) continue;

        sections += `┌───⊷ ${emoji} *${cat}*\n`;
        for (const cmd of cmds) {
            sections += `│ ⌘ ${cmd}\n`;
        }
        sections += `└──────────────⊷\n\n`;
        categoryList.push(`${emoji} ${cat}`);
    }

    return `╔════════════════════════╗
║     *⎋Voltaria DASHBOARD⎋*
╚════════════════════════╝
 » 👤 *USER:* ${pushName || 'Guest'}
 » 🚀 *UPTIME:* ${days}d ${hours}h ${minutes}m
 » 🏷️ *PREFIX:* §
 » 📦 *VERSION:* 3.4.0
══════════════════════════

${sections}━━━━━━━━━━━━━━━━━━━━━━━━━━
📂 *View a category:*
  §menu <category>

  ${categoryList.join('  •  ')}

━━━━━━━━━━━━━━━━━━━━━━━━━━
> ©ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴠᴏʟᴛᴀʀɪᴀ ɴᴇxᴜꜱ`;
}

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

        const menu = buildMenu(msg.pushName, days, hours, minutes);
        const menuImagePath = path.join(__dirname, '../../assets/menu.png');

        if (fs.existsSync(menuImagePath)) {
            try {
                let imageBuffer = fs.readFileSync(menuImagePath);

                // Compress if sharp is available (reduces size for WhatsApp)
                try {
                    const sharp = require('sharp');
                    imageBuffer = await sharp(imageBuffer)
                        .resize({ width: 800, withoutEnlargement: true })
                        .jpeg({ quality: 80 })
                        .toBuffer();
                    await sock.sendMessage(msg.chat, {
                        image: imageBuffer,
                        caption: menu,
                        mimetype: 'image/jpeg'
                    });
                } catch (sharpErr) {
                    // Fallback: send original PNG
                    await sock.sendMessage(msg.chat, {
                        image: imageBuffer,
                        caption: menu,
                        mimetype: 'image/png'
                    });
                }
                return;
            } catch (err) {
                console.error('Menu image error:', err.message);
            }
        }

        // Final fallback: text only
        await extra.reply(menu);
    }
};
