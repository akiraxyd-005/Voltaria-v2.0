const yts = require('yt-search');
const ytdl = require('ytdl-core');
const fs = require('fs');

module.exports = {
    name: 'video',
    category: 'download',
    description: 'Download a YouTube video via SaveTube (720p max)',
    usage: '§video <video name or URL>',
    async execute(sock, msg, args, extra) {
        const query = args.join(' ');
        
        if (!query) {
            return extra.reply('❌ Please provide a video name or URL.\n\nUsage: §video <video name or URL>');
        }
        
        await extra.reply('🔍 Processing video...');
        
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
                return extra.reply('❌ Video is too long! Maximum duration is 10 minutes.');
            }
            
            await extra.reply(`🎬 *Downloading:* ${title}\n⏱️ Duration: ${Math.floor(duration / 60)}:${duration % 60}`);
            
            const videoStream = ytdl(videoUrl, { quality: '18' });
            const fileName = `temp/${Date.now()}.mp4`;
            const writeStream = fs.createWriteStream(fileName);
            videoStream.pipe(writeStream);
            
            writeStream.on('finish', async () => {
                const videoBuffer = fs.readFileSync(fileName);
                await sock.sendMessage(extra.from, {
                    video: videoBuffer,
                    caption: `🎬 *${title}*\n⏱️ ${Math.floor(duration / 60)}:${duration % 60}`
                }, { quoted: msg });
                fs.unlinkSync(fileName);
            });
        } catch (error) {
            extra.reply('❌ Failed to download video.');
        }
    }
};