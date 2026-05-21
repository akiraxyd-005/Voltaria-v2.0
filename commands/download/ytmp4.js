const ytdl = require('@distube/ytdl-core');
const fs = require('fs');

module.exports = {
    name: 'ytmp4',
    category: 'download',
    description: 'Download YouTube video as MP4',
    usage: '§ytmp4 <YouTube URL>',
    async execute(sock, msg, args, extra) {
        const url = args[0];
        
        if (!url || !url.includes('youtube.com') && !url.includes('youtu.be')) {
            return extra.reply('❌ Please provide a valid YouTube URL.\n\nUsage: §ytmp4 <YouTube URL>');
        }
        
        await extra.reply('⏳ Downloading video...');
        
        try {
            const info = await ytdl.getInfo(url);
            const title = info.videoDetails.title.replace(/[^\w\s]/gi, '');
            const duration = info.videoDetails.lengthSeconds;
            
            if (duration > 600) {
                return extra.reply('❌ Video is too long! Maximum duration is 10 minutes.');
            }
            
            const videoStream = ytdl(url, { quality: '18' });
            const fileName = `temp/${Date.now()}.mp4`;
            const writeStream = fs.createWriteStream(fileName);
            videoStream.pipe(writeStream);
            
            writeStream.on('finish', async () => {
                const videoBuffer = fs.readFileSync(fileName);
                await sock.sendMessage(extra.from, {
                    video: videoBuffer,
                    caption: `🎬 *${title}*\n⏱️ Duration: ${Math.floor(duration / 60)}:${duration % 60}`
                }, { quoted: msg });
                fs.unlinkSync(fileName);
            });
        } catch (error) {
            extra.reply('❌ Failed to download video. Make sure the URL is valid.');
        }
    }
};