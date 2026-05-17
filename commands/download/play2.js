const yts = require('yt-search');
const ytdl = require('ytdl-core');
const fs = require('fs');

module.exports = {
    name: 'play2',
    category: 'download',
    description: 'Download audio from a YouTube URL or search query via SaveTube',
    usage: '§play2 <song name or URL>',
    async execute(sock, msg, args, extra) {
        const query = args.join(' ');
        
        if (!query) {
            return extra.reply('❌ Please provide a song name or URL.\n\nUsage: §play2 <song name or URL>');
        }
        
        await extra.reply('🔍 Processing audio...');
        
        let videoUrl = query;
        
        if (!query.includes('youtube.com') && !query.includes('youtu.be')) {
            const results = await yts(query);
            if (!results.videos || results.videos.length === 0) {
                return extra.reply('❌ No results found.');
            }
            videoUrl = results.videos[0].url;
        }
        
        try {
            const info = await ytdl.getInfo(videoUrl);
            const title = info.videoDetails.title.replace(/[^\w\s]/gi, '');
            const duration = info.videoDetails.lengthSeconds;
            
            if (duration > 600) {
                return extra.reply('❌ Audio is too long! Maximum duration is 10 minutes.');
            }
            
            await extra.reply(`🎵 *Downloading:* ${title}\n⏱️ Duration: ${Math.floor(duration / 60)}:${duration % 60}`);
            
            const audioStream = ytdl(videoUrl, { quality: 'highestaudio', filter: 'audioonly' });
            const fileName = `temp/${Date.now()}.mp3`;
            const writeStream = fs.createWriteStream(fileName);
            audioStream.pipe(writeStream);
            
            writeStream.on('finish', async () => {
                const audioBuffer = fs.readFileSync(fileName);
                await sock.sendMessage(extra.from, {
                    audio: audioBuffer,
                    mimetype: 'audio/mpeg',
                    fileName: `${title}.mp3`,
                    caption: `🎵 *${title}*\n⏱️ ${Math.floor(duration / 60)}:${duration % 60}`
                }, { quoted: msg });
                fs.unlinkSync(fileName);
            });
        } catch (error) {
            extra.reply('❌ Failed to download audio.');
        }
    }
};