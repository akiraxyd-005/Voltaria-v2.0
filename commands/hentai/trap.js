const hmtai = require('hmtai');

module.exports = {
    name: 'trap',
    aliases: ['femboy', 'crossdress'],
    category: 'hentai',
    description: 'Get random trap/femboy images',
    usage: '§trap',
    async execute(sock, msg, args, extra) {
        if (!msg.isGroup) return await extra.reply('❌ NSFW commands are only available in groups.');
        try {
            let imageUrl = await hmtai.getNSFW('trap');
            await sock.sendMessage(msg.chat, { image: { url: imageUrl }, caption: '◆ *Trap*' });
        } catch (error) {
            await extra.reply(`❌ Error: ${error.message}`);
        }
    }
};