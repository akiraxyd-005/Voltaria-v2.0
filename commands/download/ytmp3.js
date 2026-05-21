const ytdl = require('@distube/ytdl-core');
const fs = require('fs');

module.exports = {
    name: 'ytmp3',
    category: 'download',
    description: 'Download YouTube audio as MP3',
    usage: '§ytmp3 <YouTube URL>',
    async execute(sock, msg, args, extra) {
        const url = args[0];
        
        if (!url || !url.includes('youtube.com') && !url.includes('youtu.be')) {
            return extra.reply('❌ Please provide a valid YouTube URL.\n\nUsage: §ytmp3 <YouTube URL>');
        }
        
        await extra.reply('⏳ Downloading audio...');
        
        try {
            const info = await ytdl.getInfo(url);
            const title = info.videoDetails.title.replace(/[^\w\s]/gi, '');
            const duration = info.videoDetails.lengthSeconds;
            
            if (duration > 600) {
                return extra.reply('❌ Audio is too long! Maximum duration is 10 minutes.');
            }
            
            const audioStream = ytdl(url, { quality: 'highestaudio', filter: 'audioonly' });
            const fileName = `temp/${Date.now()}.mp3`;
            const writeStream = fs.createWriteStream(fileName);
            audioStream.pipe(writeStream);
            
            writeStream.on('finish', async () => {
                const audioBuffer = fs.readFileSync(fileName);
                await sock.sendMessage(extra.from, {
                    audio: audioBuffer,
                    mimetype: 'audio/mpeg',
                    fileName: `${title}.mp3`,
                    caption: `🎵 *${title}*\n⏱️ Duration: ${Math.floor(duration / 60)}:${duration % 60}`
                }, { quoted: msg });
                fs.unlinkSync(fileName);
            });
        } catch (error) {
            extra.reply('❌ Failed to download audio. Make sure the URL is valid.');
        }
    }
};