const axios = require('axios');
const fs = require('fs');

module.exports = {
    name: 'capcut',
    category: 'download',
    description: 'Download CapCut template video',
    usage: '§capcut <CapCut Template URL>',
    async execute(sock, msg, args, extra) {
        const url = args[0];
        
        if (!url || !url.includes('capcut.com')) {
            return extra.reply('❌ Please provide a valid CapCut Template URL.\n\nUsage: §capcut <CapCut Template URL>');
        }
        
        await extra.reply('⏳ Downloading CapCut template...');
        
        try {
            const templateId = url.split('/template/')[1].split('?')[0];
            const response = await axios.get(`https://ssscapcut.com/api/template/${templateId}`);
            const videoUrl = response.data.video_url;
            
            const videoResponse = await axios.get(videoUrl, { responseType: 'arraybuffer' });
            const videoBuffer = Buffer.from(videoResponse.data);
            
            await sock.sendMessage(extra.from, {
                video: videoBuffer,
                caption: '✂️ *CapCut Template Video*'
            }, { quoted: msg });
        } catch (error) {
            extra.reply('❌ Failed to download CapCut template.');
        }
    }
};