const axios = require('axios');

module.exports = {
    name: 'ss',
    aliases: ['screenshot', 'webshot'],
    category: 'tools',
    description: 'Take a screenshot of a website',
    usage: '§ss <url>',
    async execute(sock, msg, args, extra) {
        const url = args[0];
        
        if (!url) {
            return extra.reply(`❌ *Usage:* §ss <url>\n\nExample: §ss https://google.com`);
        }
        
        if (!url.startsWith('http')) url = 'https://' + url;
        await extra.reply(`📸 *Taking screenshot...*`);

        const tryScreenshot = async (screenshotUrl) => {
            const res = await axios.get(screenshotUrl, { responseType: 'arraybuffer', timeout: 20000 });
            return Buffer.from(res.data);
        };

        try {
            let imageBuffer;
            try {
                const apiRes = await axios.get(`https://api.microlink.io/?url=${encodeURIComponent(url)}&screenshot=true&meta=false&embed=screenshot.url`, { timeout: 15000 });
                if (typeof apiRes.data === 'string' && apiRes.data.startsWith('http')) {
                    imageBuffer = await tryScreenshot(apiRes.data);
                } else { throw new Error('no url'); }
            } catch {
                imageBuffer = await tryScreenshot(`https://image.thum.io/get/width/1280/crop/720/noanimate/${url}`);
            }

            await sock.sendMessage(extra.from, {
                image: imageBuffer,
                caption: `📸 *Screenshot of ${url}*\n\n> ©POWERED BY NEXUS`
            }, { quoted: msg });
        } catch (error) {
            await extra.reply(`❌ Screenshot failed. URL may be unreachable.\n\n> ©POWERED BY NEXUS`);
        }
    }
};