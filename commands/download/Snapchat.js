const axios = require('axios');
const fs = require('fs');

module.exports = {
    name: 'snapchat',
    category: 'download',
    description: 'Download Snapchat media',
    usage: '§snapchat <Snapchat URL>',
    async execute(sock, msg, args, extra) {
        const url = args[0];
        
        if (!url || !url.includes('snapchat.com')) {
            return extra.reply('❌ Please provide a valid Snapchat URL.\n\nUsage: §snapchat <Snapchat Story/Spotlight URL>');
        }
        
        await extra.reply('⏳ Downloading Snapchat media...');
        
        try {
            const response = await axios.get(`https://snapdownloader.com/api/download?url=${encodeURIComponent(url)}`);
            const videoUrl = response.data.video_url;
            
            const videoResponse = await axios.get(videoUrl, { responseType: 'arraybuffer' });
            const videoBuffer = Buffer.from(videoResponse.data);
            
            await sock.sendMessage(extra.from, {
                video: videoBuffer,
                caption: '👻 *Snapchat Media*'
            }, { quoted: msg });
        } catch (error) {
            extra.reply('❌ Failed to download Snapchat media.');
        }
    }
};