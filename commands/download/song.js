const yts = require('yt-search');
const ytdl = require('@distube/ytdl-core');
const fs = require('fs');

module.exports = {
    name: 'song',
    category: 'download',
    description: 'Search and download a song instantly',
    usage: '§song <song name>',
    async execute(sock, msg, args, extra) {
        const query = args.join(' ');
        
        if (!query) {
            return extra.reply('❌ Please provide a song name.\n\nUsage: §song <song name>');
        }
        
        await extra.reply('🔍 Searching for song...');
        
        try {
            const results = await yts(query);
            const videos = results.videos;
            
            if (!videos || videos.length === 0) {
                return extra.reply('❌ No results found.');
            }
            
            const song = videos[0];
            
            if (song.duration.seconds > 600) {
                return extra.reply('❌ Song is too long! Maximum duration is 10 minutes.');
            }
            
            await extra.reply(`🎵 *Found:* ${song.title}\n⏱️ Duration: ${song.duration.timestamp}\n⬇️ Downloading...`);
            
            const audioStream = ytdl(song.url, { quality: 'highestaudio', filter: 'audioonly' });
            const fileName = `temp/${Date.now()}.mp3`;
            const writeStream = fs.createWriteStream(fileName);
            audioStream.pipe(writeStream);
            
            writeStream.on('finish', async () => {
                const audioBuffer = fs.readFileSync(fileName);
                await sock.sendMessage(extra.from, {
                    audio: audioBuffer,
                    mimetype: 'audio/mpeg',
                    fileName: `${song.title}.mp3`,
                    caption: `🎵 *${song.title}*\n👤 ${song.author.name}\n⏱️ ${song.duration.timestamp}`
                }, { quoted: msg });
                fs.unlinkSync(fileName);
            });
        } catch (error) {
            extra.reply('❌ Failed to download song.');
        }
    }
};