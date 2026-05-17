const axios = require('axios');
const fs = require('fs');

module.exports = {
    name: 'facebook',
    category: 'download',
    description: 'Download Facebook video',
    usage: '§facebook <Facebook URL>',
    async execute(sock, msg, args, extra) {
        const url = args[0];
        
        if (!url || (!url.includes('facebook.com') && !url.includes('fb.com'))) {
            return extra.reply('❌ Please provide a valid Facebook URL.\n\nUsage: §facebook <Facebook Video URL>');
        }
        
        await extra.reply('⏳ Downloading Facebook video...');
        
        try {
            const response = await axios.post('https://getvideo.cc/api/getvideo', { url });
            const videoUrl = response.data.video_url;
            
            const videoResponse = await axios.get(videoUrl, { responseType: 'arraybuffer' });
            const videoBuffer = Buffer.from(videoResponse.data);
            
            await sock.sendMessage(extra.from, {
                video: videoBuffer,
                caption: '📘 *Facebook Video*'
            }, { quoted: msg });
        } catch (error) {
            extra.reply('❌ Failed to download Facebook video.');
        }
    }
};