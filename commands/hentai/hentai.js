const hmtai = require('hmtai');

const TYPE_MAP = {
    random:      () => { const m = ['hentai','ass','cum','blowjob','boobjob','vagina','thighs','foot','ero','pantsu','ahegao','nsfwNeko','yuri','tentacles','gangbang','uniform','bdsm','femdom','orgy']; return hmtai.nsfw[m[Math.floor(Math.random()*m.length)]](); },
    hentai:      () => hmtai.nsfw.hentai(),
    hanime:      () => hmtai.nsfw.hentai(),
    h_anime:     () => hmtai.nsfw.hentai(),
    nsfw:        () => hmtai.nsfw.hentai(),
    nsfw_mobile: () => hmtai.nsfw.nsfwMobileWallpaper(),
    nsfw_avatar: () => hmtai.nsfw.nsfwNeko(),
    pussy:       () => hmtai.nsfw.vagina(),
    boobs:       () => hmtai.nsfw.boobjob(),
    ass:         () => hmtai.nsfw.ass(),
    cuckold:     () => hmtai.nsfw.cuckold(),
    cum:         () => hmtai.nsfw.cum(),
    blowjob:     () => hmtai.nsfw.blowjob(),
    sologirl:    () => hmtai.nsfw.ero(),
    thighs:      () => hmtai.nsfw.thighs(),
    feet:        () => hmtai.nsfw.foot(),
    gif:         () => hmtai.nsfw.gif(),
    hentaigif:   () => hmtai.nsfw.gif(),
    neko:        () => hmtai.nsfw.nsfwNeko(),
    waifu:       () => hmtai.nsfw.nsfwNeko(),
    trap:        () => hmtai.nsfw.thighs(),
    lewd:        () => hmtai.nsfw.ero(),
    gecg:        () => hmtai.nsfw.ero(),
    eron:        () => hmtai.nsfw.ero(),
    erofeet:     () => hmtai.nsfw.foot(),
    hololewd:    () => hmtai.nsfw.ero(),
    lewdkemo:    () => hmtai.nsfw.ero(),
    panties:     () => hmtai.nsfw.pantsu(),
};

module.exports = {
    name: 'hentai',
    aliases: ['h', 'nsfw'],
    category: 'hentai',
    description: 'Get random hentai/NSFW images',
    usage: '§hentai <type>',
    async execute(sock, msg, args, extra) {
        if (!msg.isGroup) return await extra.reply('❌ NSFW commands are only available in groups.');

        const type = args[0]?.toLowerCase() || 'random';

        if (!TYPE_MAP[type]) {
            return await extra.reply(`❌ Available types: random, hentai, boobs, ass, blowjob, pussy, cum, thighs, feet, gif, neko, waifu, trap, lewd, panties, hentaigif`);
        }

        try {
            const imageUrl = TYPE_MAP[type]();
            if (type === 'gif' || type === 'hentaigif') {
                await sock.sendMessage(msg.chat, { video: { url: imageUrl }, gifPlayback: true, caption: '◆ *Hentai GIF*' });
            } else {
                await sock.sendMessage(msg.chat, { image: { url: imageUrl }, caption: `◆ *Hentai — ${type}*` });
            }
        } catch (error) {
            await extra.reply(`❌ Error: ${error.message}`);
        }
    }
};
