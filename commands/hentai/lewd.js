const hmtai = require('hmtai');

module.exports = {
    name: 'lewd',
    aliases: ['lewdneko', 'ecchi'],
    category: 'hentai',
    description: 'Get random lewd images',
    usage: '§lewd',
    async execute(sock, msg, args, extra) {
        if (!msg.isGroup) return await extra.reply('❌ NSFW commands are only available in groups.');
        try {
            let imageUrl = hmtai.nsfw.ero();
            await sock.sendMessage(msg.chat, { image: { url: imageUrl }, caption: '◆ *Lewd*' });
        } catch (error) {
            await extra.reply(`❌ Error: ${error.message}`);
        }
    }
};