const hmtai = require('hmtai');

module.exports = {
    name: 'hentai',
    aliases: ['h', 'nsfw'],
    category: 'hentai',
    description: 'Get random hentai/NSFW images',
    usage: '§hentai <type>',
    async execute(sock, msg, args, extra) {
        if (!msg.isGroup) return await extra.reply('❌ NSFW commands are only available in groups.');

        let type = args[0]?.toLowerCase() || 'random';
        let types = ['random', 'hentai', 'hanime', 'h_anime', 'nsfw', 'nsfw_mobile', 'nsfw_avatar', 'pussy', 'boobs', 'ass', 'cuckold', 'cum', 'blowjob', 'sologirl', 'thighs', 'feet', 'gif', 'holo', 'neko', 'waifu', 'trap', 'lewd', 'gecg', 'eron', 'erofeet', 'hololewd', 'lewdkemo', 'panties', 'hentaigif'];

        if (!types.includes(type)) {
            return await extra.reply(`❌ Available types: random, hentai, hanime, nsfw, boobs, ass, blowjob, pussy, cum, thighs, feet, gif, neko, waifu, trap, lewd, panties, hentaigif, etc.`);
        }

        try {
            let imageUrl;
            if (type === 'random') imageUrl = await hmtai.getNSFW();
            else if (type === 'hanime' || type === 'h_anime') imageUrl = await hmtai.getNSFW('hanime');
            else if (type === 'hentaigif') imageUrl = await hmtai.getNSFW('gif');
            else imageUrl = await hmtai.getNSFW(type);

            if (type === 'gif' || type === 'hentaigif') {
                await sock.sendMessage(msg.chat, { video: { url: imageUrl }, gifPlayback: true, caption: '◆ *Hentai GIF*' });
            } else {
                await sock.sendMessage(msg.chat, { image: { url: imageUrl }, caption: `◆ *Hentai - ${type}*` });
            }
        } catch (error) {
            await extra.reply(`❌ Error: ${error.message}`);
        }
    }
};