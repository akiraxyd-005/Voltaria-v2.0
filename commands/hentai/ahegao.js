const hmtai = require('hmtai');

module.exports = {
    name: 'ahegao',
    aliases: ['ahe', 'ahego'],
    category: 'hentai',
    description: 'Get random ahegao face images',
    usage: '§ahegao',
    async execute(sock, msg, args, extra) {
        if (!msg.isGroup) return await extra.reply('❌ NSFW commands are only available in groups.');
        try {
            let imageUrl = await hmtai.getNSFW('ahegao');
            await sock.sendMessage(msg.chat, { image: { url: imageUrl }, caption: '◆ *Ahegao*' });
        } catch (error) {
            await extra.reply(`❌ Error: ${error.message}`);
        }
    }
};