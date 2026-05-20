const fs = require('fs');
const path = require('path');

module.exports = async (sock, msg, extra, prefix, botName) => {
    try {
        let body = msg.message?.conversation || msg.message?.extendedTextMessage?.text || '';
        if (!body) return;

        let command = body.slice(prefix.length).trim().split(' ')[0].toLowerCase();
        let args = body.slice(prefix.length).trim().split(' ').slice(1);

        if (!body.startsWith(prefix)) return;

        // All command categories
        const categories = [
            'admin', 'ai', 'anime', 'audio', 'debug', 'download', 'economy', 
            'fun', 'games', 'general', 'group', 'hentai', 'info', 'owner', 
            'reactions', 'religion', 'search', 'settings', 'session', 'text', 
            'textmaker', 'tools', 'whatsapp'
        ];
        
        let commandFile = null;
        let categoryFound = null;

        // Search for command in all categories
        for (const category of categories) {
            const cmdPath = path.join(__dirname, '../commands', category, `${command}.js`);
            if (fs.existsSync(cmdPath)) {
                commandFile = require(cmdPath);
                categoryFound = category;
                break;
            }
        }

        if (!commandFile) return;

        // Check if bot is disabled in this group
        const disabledGroups = global.disabledGroups || [];
        if (disabledGroups.includes(msg.chat) && command !== 'on' && command !== 'enable') {
            return await extra.reply('❌ Bot is disabled in this group. Contact owner to enable.');
        }

        // Check if NSFW is disabled in this group
        const nsfwDisabledGroups = global.nsfwDisabledGroups || [];
        if (nsfwDisabledGroups.includes(msg.chat) && commandFile.category === 'hentai') {
            return await extra.reply('❌ NSFW commands are disabled in this group.');
        }

        // Check if user is banned from reporting
        if (command === 'report' && global.bannedReporters && global.bannedReporters.includes(msg.sender)) {
            return await extra.reply(`❌ You are banned from using the report command.\n\nReason: False reporting.\nContact owner: ${global.owner[0]}`);
        }

        // Execute command
        await commandFile.execute(sock, msg, args, extra);

    } catch (error) {
        console.error('Command handler error:', error);
        await extra.reply(`❌ Error: ${error.message}`);
    }
};