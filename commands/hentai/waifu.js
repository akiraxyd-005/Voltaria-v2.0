const hmtai = require('hmtai');

module.exports = {
    name: 'waifu',
    aliases: ['nsfwwaifu'],
    category: 'hentai',
    description: 'Get random NSFW waifu images',
    usage: '§waifu',
    async execute(sock, msg, args, extra) {
        if (!msg.isGroup) return await extra.reply('❌ NSFW commands are only available in groups.');
        try {
            let imageUrl = hmtai.nsfw.nsfwNeko();
            await sock.sendMessage(msg.chat, { image: { url: imageUrl }, caption: '◆ *NSFW Waifu*' });
        } catch (error) {
            await extra.reply(`❌ Error: ${error.message}`);
        }
    }
};