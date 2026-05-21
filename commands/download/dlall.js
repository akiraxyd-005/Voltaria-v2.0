const axios = require('axios');
const fs = require('fs');

module.exports = {
    name: 'dlall',
    category: 'download',
    description: 'Universal downloader',
    usage: '§dlall <URL>',
    async execute(sock, msg, args, extra) {
        const url = args[0];
        
        if (!url) {
            return extra.reply('❌ Please provide a URL to download.\n\nUsage: §dlall <URL>\n\nSupported platforms:\nYouTube, TikTok, Twitter, Instagram, Facebook, Spotify');
        }
        
        await extra.reply('⏳ Detecting platform and downloading...');
        
        try {
            let videoUrl = null;
            
            if (url.includes('youtube.com') || url.includes('youtu.be')) {
                const ytdl = require('@distube/ytdl-core');
                const info = await ytdl.getInfo(url);
                videoUrl = info.videoDetails.video_url;
            } else if (url.includes('tiktok.com')) {
                const response = await axios.get(`https://tikdown.org/api/ajaxSearch?q=${encodeURIComponent(url)}`);
                videoUrl = response.data.video;
            } else if (url.includes('twitter.com') || url.includes('x.com')) {
                const response = await axios.get(`https://twitsave.com/info?url=${encodeURIComponent(url)}`);
                videoUrl = response.data.video_url;
            } else if (url.includes('instagram.com')) {
                const response = await axios.get(`https://api.instadownloader.io/api/convert?url=${encodeURIComponent(url)}`);
                videoUrl = response.data.download_url;
            } else {
                return extra.reply('❌ Unsupported platform or invalid URL.');
            }
            
            const videoResponse = await axios.get(videoUrl, { responseType: 'arraybuffer' });
            const videoBuffer = Buffer.from(videoResponse.data);
            
            await sock.sendMessage(extra.from, {
                video: videoBuffer,
                caption: '📥 *Downloaded Media*'
            }, { quoted: msg });
        } catch (error) {
            extra.reply('❌ Failed to download media from the provided URL.');
        }
    }
};