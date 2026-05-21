const ytSearch = require('yt-search');
const ytdl = require('@distube/ytdl-core');

// Store active searches
const activeSearches = new Map();

module.exports = {
    name: 'play',
    aliases: ['song', 'music', 'yt'],
    category: 'download',
    description: 'Search and play music from YouTube',
    usage: '§play song name',
    async execute(sock, msg, args, extra) {
        // Check if this is a number reply to an active search
        const num = parseInt(args[0]);
        const searchData = activeSearches.get(msg.sender);
        
        if (searchData && !isNaN(num) && num >= 1 && num <= searchData.videos.length) {
            // User selected a number - send the audio
            const selected = searchData.videos[num - 1];
            
            // Delete the results message
            try {
                await sock.sendMessage(msg.chat, { delete: searchData.messageId });
            } catch (err) {}
            
            await extra.reply(`🎵 *Downloading:* ${selected.title}...`);
            
            try {
                const audioStream = ytdl(selected.url, { filter: 'audioonly', quality: 'highestaudio' });
                
                await sock.sendMessage(msg.chat, {
                    audio: audioStream,
                    mimetype: 'audio/mpeg',
                    fileName: `${selected.title}.mp3`
                });
                
                await extra.reply(`✅ *Sent!*\n🔗 ${selected.url}`);
                activeSearches.delete(msg.sender);
            } catch (error) {
                await extra.reply(`❌ Download failed: ${error.message}`);
            }
            return;
        }
        
        // Normal search flow
        if (!args.length) return await extra.reply('❌ Provide a song name.\nUsage: §play Shape of You');

        const query = args.join(' ');
        await extra.reply(`🔍 *Searching* for "${query}"...`);

        try {
            const result = await ytSearch(query);
            const videos = result.videos.slice(0, 10);

            if (!videos.length) return await extra.reply('❌ No results found.');

            let resultsList = `◆ *RESULTS FOR* ${query.toUpperCase()}\n\n*Reply with the number of the desired search result to get the audio.*\n\n`;
            
            videos.forEach((video, index) => {
                const num = index + 1;
                const duration = video.timestamp || 'Unknown';
                const title = video.title.length > 50 ? video.title.substring(0, 47) + '...' : video.title;
                resultsList += `*${num}:* ${title} (${duration})\n`;
            });
            
            resultsList += `\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n> ©𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 𝙽£𝚇𝚄$`;

            const sentMsg = await extra.reply(resultsList);
            
            // Store search results
            activeSearches.set(msg.sender, {
                videos: videos,
                messageId: { id: sentMsg.key?.id, remoteJid: msg.chat, fromMe: true },
                chatId: msg.chat,
                timestamp: Date.now()
            });

            // Auto-cleanup after 2 minutes
            setTimeout(() => {
                if (activeSearches.get(msg.sender)?.timestamp === searchData?.timestamp) {
                    activeSearches.delete(msg.sender);
                }
            }, 120000);

        } catch (error) {
            console.error(error);
            await extra.reply(`❌ Error: ${error.message}`);
        }
    }
};