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

module.exports = {
    name: 'menu',
    aliases: ['help', 'commands'],
    category: 'general',
    description: 'Show bot menu',
    async execute(sock, msg, args, extra) {
        const uptime = process.uptime();
        const days = Math.floor(uptime / 86400);
        const hours = Math.floor((uptime % 86400) / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        const senderName = msg.pushName || 'Guest';

        // Dynamically scan all command folders
        const commandsDir = path.join(__dirname, '../../commands');
        const categories = fs.readdirSync(commandsDir)
            .filter(c => !SKIP_CATEGORIES.has(c) && fs.statSync(path.join(commandsDir, c)).isDirectory())
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
            for (const cmd of cmds) sections += `│ ⌘ ${cmd}\n`;
            sections += `└──────────────⊷\n\n`;
            categoryList.push(`${emoji} ${cat}`);
        }

        const menuText = `╔════════════════════════╗
║     *⎋Voltaria DASHBOARD⎋*
╚════════════════════════╝
 » 👤 *USER:* ${senderName}
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

        const menuImagePath = path.join(__dirname, '../../assets/menu.png');

        if (fs.existsSync(menuImagePath)) {
            try {
                const sharp = require('sharp');
                const imageBuffer = await sharp(menuImagePath)
                    .resize({ width: 800, withoutEnlargement: true })
                    .jpeg({ quality: 80 })
                    .toBuffer();
                await sock.sendMessage(msg.chat, {
                    image: imageBuffer,
                    caption: menuText,
                    mimetype: 'image/jpeg'
                });
                return;
            } catch (err) {
                console.error('Menu image error:', err.message);
                // Fallback to raw PNG
                try {
                    await sock.sendMessage(msg.chat, {
                        image: fs.readFileSync(menuImagePath),
                        caption: menuText,
                        mimetype: 'image/png'
                    });
                    return;
                } catch (e) { /* fall through to text */ }
            }
        }

        await extra.reply(menuText);
    }
};
