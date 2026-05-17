const axios = require('axios');
const fs = require('fs');

module.exports = {
    name: 'tiktok',
    category: 'download',
    description: 'Download TikTok video',
    usage: '§tiktok <TikTok URL>',
    async execute(sock, msg, args, extra) {
        const url = args[0];
        
        if (!url || !url.includes('tiktok.com')) {
            return extra.reply('❌ Please provide a valid TikTok URL.\n\nUsage: §tiktok <TikTok URL>');
        }
        
        await extra.reply('⏳ Downloading TikTok video...');
        
        try {
            const response = await axios.get(`https://tikdown.org/api/ajaxSearch?q=${encodeURIComponent(url)}`);
            const data = response.data;
            
            const videoUrl = data.images || data.video;
            const videoResponse = await axios.get(videoUrl, { responseType: 'arraybuffer' });
            const videoBuffer = Buffer.from(videoResponse.data);
            
            await sock.sendMessage(extra.from, {
                video: videoBuffer,
                caption: '📱 *TikTok Video*'
            }, { quoted: msg });
        } catch (error) {
            extra.reply('❌ Failed to download TikTok video.');
        }
    }
};