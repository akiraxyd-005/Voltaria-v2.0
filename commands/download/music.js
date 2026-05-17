const yts = require('yt-search');
const ytdl = require('ytdl-core');
const fs = require('fs');

module.exports = {
    name: 'music',
    category: 'download',
    description: 'Search and download music with audio/document options',
    usage: '§music <song name>',
    async execute(sock, msg, args, extra) {
        const query = args.join(' ');
        
        if (!query) {
            return extra.reply('❌ Please provide a song name.\n\nUsage: §music <song name>');
        }
        
        await extra.reply('🔍 Searching for music...');
        
        try {
            const results = await yts(query);
            const videos = results.videos;
            
            if (!videos || videos.length === 0) {
                return extra.reply('❌ No results found.');
            }
            
            const song = videos[0];
            
            const buttons = [
                { buttonId: `§song ${query}`, buttonText: { displayText: '🎵 Download Audio' }, type: 1 },
                { buttonId: `§ytmp4 ${song.url}`, buttonText: { displayText: '🎬 Download Video' }, type: 1 }
            ];
            
            await sock.sendMessage(extra.from, {
                text: `🎵 *Found:* ${song.title}\n👤 ${song.author.name}\n⏱️ ${song.duration.timestamp}\n\nSelect download option:`,
                buttons: buttons,
                headerType: 1
            }, { quoted: msg });
        } catch (error) {
            extra.reply('❌ Failed to search music.');
        }
    }
};