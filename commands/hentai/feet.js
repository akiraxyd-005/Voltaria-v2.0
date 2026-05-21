const hmtai = require('hmtai');

module.exports = {
    name: 'feet',
    aliases: ['foot', 'erofeet'],
    category: 'hentai',
    description: 'Get random feet images',
    usage: '§feet',
    async execute(sock, msg, args, extra) {
        if (!msg.isGroup) return await extra.reply('❌ NSFW commands are only available in groups.');
        try {
            let imageUrl = hmtai.nsfw.foot();
            await sock.sendMessage(msg.chat, { image: { url: imageUrl }, caption: '◆ *Feet*' });
        } catch (error) {
            await extra.reply(`❌ Error: ${error.message}`);
        }
    }
};