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
        
        await extra.reply(`📸 *Taking screenshot...*`);
        
        try {
            const response = await axios.get(`https://api.screenshotmachine.com/?key=${process.env.SCREENSHOT_API_KEY}&url=${encodeURIComponent(url)}&dimension=1024x768`);
            const imageBuffer = Buffer.from(response.data, 'binary');
            
            await sock.sendMessage(extra.from, {
                image: imageBuffer,
                caption: `📸 *Screenshot of ${url}*\n\n> ©POWERED BY NEXUS`
            }, { quoted: msg });
        } catch (error) {
            await extra.reply(`❌ Screenshot failed. Make sure the URL is valid.\n\n> ©POWERED BY NEXUS`);
        }
    }
};