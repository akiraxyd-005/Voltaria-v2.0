const hmtai = require('hmtai');

module.exports = {
    name: 'hentaigif',
    aliases: ['hgif', 'h-gif', 'nsfwgif'],
    category: 'hentai',
    description: 'Get random hentai GIFs',
    usage: '§hentaigif',
    async execute(sock, msg, args, extra) {
        if (!msg.isGroup) return await extra.reply('❌ NSFW commands are only available in groups.');
        try {
            let imageUrl = hmtai.nsfw.gif();
            await sock.sendMessage(msg.chat, { video: { url: imageUrl }, gifPlayback: true, caption: '◆ *Hentai GIF*' });
        } catch (error) {
            await extra.reply(`❌ Error: ${error.message}`);
        }
    }
};