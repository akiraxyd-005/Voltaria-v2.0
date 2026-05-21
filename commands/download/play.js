const ytSearch = require('yt-search');
const ytdl = require('@distube/ytdl-core');
const fs = require('fs');
const path = require('path');

const FOOTER = '\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n> ©𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 𝙽£𝚇𝚄$';
const activeSearches = new Map();

async function downloadAudio(videoUrl, tmpFile) {
    return new Promise((resolve, reject) => {
        const stream = ytdl(videoUrl, { filter: 'audioonly', quality: 'highestaudio' });
        const ws = fs.createWriteStream(tmpFile);
        stream.pipe(ws);
        ws.on('finish', resolve);
        ws.on('error', reject);
        stream.on('error', reject);
    });
}

module.exports = {
    name: 'play',
    aliases: ['song', 'yt'],
    category: 'download',
    description: 'Search and play music from YouTube',
    usage: '§play <song name>',
    async execute(sock, msg, args, extra) {
        const num = parseInt(args[0]);
        const searchData = activeSearches.get(msg.sender);

        // USER REPLIED WITH A NUMBER — DOWNLOAD & SEND AUDIO
        if (searchData && !isNaN(num) && num >= 1 && num <= searchData.videos.length) {
            const selected = searchData.videos[num - 1];
            activeSearches.delete(msg.sender);

            // Try to delete the results message
            try {
                if (searchData.messageKey) {
                    await sock.sendMessage(msg.chat, { delete: searchData.messageKey });
                }
            } catch (_) {}

            await extra.reply(`🎵 *Downloading:* ${selected.title}...`);

            const tmpFile = path.join('./temp', `play_${Date.now()}.mp3`);
            try {
                if (!fs.existsSync('./temp')) fs.mkdirSync('./temp', { recursive: true });
                await downloadAudio(selected.url, tmpFile);

                const audioBuffer = fs.readFileSync(tmpFile);
                fs.unlinkSync(tmpFile);

                const title = selected.title.substring(0, 60);
                await sock.sendMessage(msg.chat, {
                    audio: audioBuffer,
                    mimetype: 'audio/mpeg',
                    fileName: `${title}.mp3`
                }, { quoted: msg });

                await extra.reply(`✅ *Sent:* ${title}\n🔗 ${selected.url}${FOOTER}`);
            } catch (err) {
                if (fs.existsSync(tmpFile)) fs.unlinkSync(tmpFile);
                await extra.reply(`❌ Download failed: ${err.message}\n\nTry §ytmp3 <URL> directly.${FOOTER}`);
            }
            return;
        }

        // NORMAL SEARCH — SHOW RESULTS LIST
        const query = args.join(' ');
        if (!query) return await extra.reply(`❌ Provide a song name.\n\nUsage: §play Shape of You${FOOTER}`);

        await extra.reply(`🔍 *Searching for* "${query}"...`);

        try {
            const result = await ytSearch(query);
            const videos = result.videos.slice(0, 10);
            if (!videos.length) return await extra.reply(`❌ No results found.${FOOTER}`);

            let list = `◆ *RESULTS FOR* ${query.toUpperCase()}\n\n*Reply with the number to get the audio.*\n\n`;
            videos.forEach((v, i) => {
                const title = v.title.length > 50 ? v.title.substring(0, 47) + '...' : v.title;
                list += `*${i + 1}:* ${title} _(${v.timestamp || '?'})_\n`;
            });
            list += FOOTER;

            const sentMsg = await extra.reply(list);

            activeSearches.set(msg.sender, {
                videos,
                messageKey: sentMsg?.key || null,
                chatId: msg.chat,
                timestamp: Date.now()
            });

            // Auto-cleanup after 3 minutes
            setTimeout(() => {
                const cur = activeSearches.get(msg.sender);
                if (cur?.timestamp === activeSearches.get(msg.sender)?.timestamp) {
                    activeSearches.delete(msg.sender);
                }
            }, 180000);

        } catch (err) {
            await extra.reply(`❌ Search failed: ${err.message}${FOOTER}`);
        }
    }
};
