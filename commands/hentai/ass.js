const hmtai = require('hmtai');

module.exports = {
    name: 'ass',
    aliases: ['butt', 'booty'],
    category: 'hentai',
    description: 'Get random anime ass images',
    usage: '§ass',
    async execute(sock, msg, args, extra) {
        if (!msg.isGroup) return await extra.reply('❌ NSFW commands are only available in groups.');
        try {
            let imageUrl = hmtai.nsfw.ass();
            await sock.sendMessage(msg.chat, { image: { url: imageUrl }, caption: '◆ *Ass*' });
        } catch (error) {
            await extra.reply(`❌ Error: ${error.message}`);
        }
    }
};
