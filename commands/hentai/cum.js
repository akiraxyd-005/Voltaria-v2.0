const hmtai = require('hmtai');

module.exports = {
    name: 'cum',
    aliases: ['creampie', 'semen'],
    category: 'hentai',
    description: 'Get random cum related images',
    usage: '§cum',
    async execute(sock, msg, args, extra) {
        if (!msg.isGroup) return await extra.reply('❌ NSFW commands are only available in groups.');
        try {
            let imageUrl = hmtai.nsfw.cum();
            await sock.sendMessage(msg.chat, { image: { url: imageUrl }, caption: '◆ *Cum*' });
        } catch (error) {
            await extra.reply(`❌ Error: ${error.message}`);
        }
    }
};