const yts = require('yt-search');
const ytdl = require('ytdl-core');
const fs = require('fs');

module.exports = {
    name: 'ytv',
    category: 'download',
    description: 'Search and download YouTube videos',
    usage: '§ytv <video name>',
    async execute(sock, msg, args, extra) {
        const query = args.join(' ');
        
        if (!query) {
            return extra.reply('❌ Please provide a video name.\n\nUsage: §ytv <video name>');
        }
        
        await extra.reply('🔍 Searching for video...');
        
        try {
            const results = await yts(query);
            const videos = results.videos;
            
            if (!videos || videos.length === 0) {
                return extra.reply('❌ No results found.');
            }
            
            const video = videos[0];
            
            if (video.duration.seconds > 600) {
                return extra.reply('❌ Video is too long! Maximum duration is 10 minutes.');
            }
            
            await extra.reply(`🎬 *Found:* ${video.title}\n⏱️ Duration: ${video.duration.timestamp}\n⬇️ Downloading video...`);
            
            const videoStream = ytdl(video.url, { quality: '18' });
            const fileName = `temp/${Date.now()}.mp4`;
            const writeStream = fs.createWriteStream(fileName);
            videoStream.pipe(writeStream);
            
            writeStream.on('finish', async () => {
                const videoBuffer = fs.readFileSync(fileName);
                await sock.sendMessage(extra.from, {
                    video: videoBuffer,
                    caption: `🎬 *${video.title}*\n👤 ${video.author.name}\n⏱️ ${video.duration.timestamp}`
                }, { quoted: msg });
                fs.unlinkSync(fileName);
            });
        } catch (error) {
            extra.reply('❌ Failed to download video.');
        }
    }
};