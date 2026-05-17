const axios = require('axios');
const fs = require('fs');

module.exports = {
    name: 'instagram',
    category: 'download',
    description: 'Download Instagram media',
    usage: '§instagram <Instagram URL>',
    async execute(sock, msg, args, extra) {
        const url = args[0];
        
        if (!url || !url.includes('instagram.com')) {
            return extra.reply('❌ Please provide a valid Instagram URL.\n\nUsage: §instagram <Instagram Post/Reel URL>');
        }
        
        await extra.reply('⏳ Downloading Instagram media...');
        
        try {
            const response = await axios.get(`https://api.instadownloader.io/api/convert?url=${encodeURIComponent(url)}`);
            const data = response.data;
            
            if (data.media_type === 'video') {
                const videoResponse = await axios.get(data.download_url, { responseType: 'arraybuffer' });
                const videoBuffer = Buffer.from(videoResponse.data);
                await sock.sendMessage(extra.from, {
                    video: videoBuffer,
                    caption: '📸 *Instagram Reel/Video*'
                }, { quoted: msg });
            } else {
                const imageResponse = await axios.get(data.download_url, { responseType: 'arraybuffer' });
                const imageBuffer = Buffer.from(imageResponse.data);
                await sock.sendMessage(extra.from, {
                    image: imageBuffer,
                    caption: '📸 *Instagram Image*'
                }, { quoted: msg });
            }
        } catch (error) {
            extra.reply('❌ Failed to download Instagram media.');
        }
    }
};