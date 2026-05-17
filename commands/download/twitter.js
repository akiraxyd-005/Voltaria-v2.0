const axios = require('axios');
const fs = require('fs');

module.exports = {
    name: 'twitter',
    category: 'download',
    description: 'Download Twitter/X video',
    usage: '§twitter <Twitter URL>',
    async execute(sock, msg, args, extra) {
        const url = args[0];
        
        if (!url || (!url.includes('twitter.com') && !url.includes('x.com'))) {
            return extra.reply('❌ Please provide a valid Twitter/X URL.\n\nUsage: §twitter <Tweet URL>');
        }
        
        await extra.reply('⏳ Downloading Twitter video...');
        
        try {
            const response = await axios.get(`https://twitsave.com/info?url=${encodeURIComponent(url)}`);
            const videoUrl = response.data.video_url;
            
            const videoResponse = await axios.get(videoUrl, { responseType: 'arraybuffer' });
            const videoBuffer = Buffer.from(videoResponse.data);
            
            await sock.sendMessage(extra.from, {
                video: videoBuffer,
                caption: '🐦 *Twitter/X Video*'
            }, { quoted: msg });
        } catch (error) {
            extra.reply('❌ Failed to download Twitter video.');
        }
    }
};