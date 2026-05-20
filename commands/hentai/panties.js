const hmtai = require('hmtai');

module.exports = {
    name: 'panties',
    aliases: ['underwear', 'lingerie'],
    category: 'hentai',
    description: 'Get random panties images',
    usage: '§panties',
    async execute(sock, msg, args, extra) {
        if (!msg.isGroup) return await extra.reply('❌ NSFW commands are only available in groups.');
        try {
            let imageUrl = await hmtai.getNSFW('panties');
            await sock.sendMessage(msg.chat, { image: { url: imageUrl }, caption: '◆ *Panties*' });
        } catch (error) {
            await extra.reply(`❌ Error: ${error.message}`);
        }
    }
};