const axios = require('axios');
const fs = require('fs');

module.exports = {
    name: 'threads',
    category: 'download',
    description: 'Download Threads media',
    usage: '§threads <Threads URL>',
    async execute(sock, msg, args, extra) {
        const url = args[0];
        
        if (!url || !url.includes('threads.net')) {
            return extra.reply('❌ Please provide a valid Threads URL.\n\nUsage: §threads <Threads Post URL>');
        }
        
        await extra.reply('⏳ Downloading Threads media...');
        
        try {
            const response = await axios.get(`https://threadsdownloader.com/api/download?url=${encodeURIComponent(url)}`);
            const mediaUrl = response.data.media_url;
            
            const mediaResponse = await axios.get(mediaUrl, { responseType: 'arraybuffer' });
            const mediaBuffer = Buffer.from(mediaResponse.data);
            
            await sock.sendMessage(extra.from, {
                video: mediaBuffer,
                caption: '🧵 *Threads Media*'
            }, { quoted: msg });
        } catch (error) {
            extra.reply('❌ Failed to download Threads media.');
        }
    }
};