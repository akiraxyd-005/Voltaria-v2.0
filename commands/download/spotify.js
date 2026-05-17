const axios = require('axios');
const fs = require('fs');

module.exports = {
    name: 'spotify',
    category: 'download',
    description: 'Download Spotify track',
    usage: '§spotify <Spotify URL>',
    async execute(sock, msg, args, extra) {
        const url = args[0];
        
        if (!url || !url.includes('spotify.com')) {
            return extra.reply('❌ Please provide a valid Spotify URL.\n\nUsage: §spotify <Spotify Track URL>');
        }
        
        await extra.reply('⏳ Processing Spotify track...');
        
        try {
            const trackId = url.split('/track/')[1].split('?')[0];
            const response = await axios.get(`https://api.spotifydown.com/track/${trackId}`);
            const data = response.data;
            
            const downloadUrl = data.downloadLink;
            const audioResponse = await axios.get(downloadUrl, { responseType: 'arraybuffer' });
            const audioBuffer = Buffer.from(audioResponse.data);
            
            await sock.sendMessage(extra.from, {
                audio: audioBuffer,
                mimetype: 'audio/mpeg',
                fileName: `${data.title}.mp3`,
                caption: `🎵 *${data.title}*\n👤 Artist: ${data.artist}`
            }, { quoted: msg });
        } catch (error) {
            extra.reply('❌ Failed to download Spotify track.');
        }
    }
};