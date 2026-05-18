const axios = require('axios');

module.exports = {
    name: 'checkupdate',
    category: 'owner',
    description: 'Check for new updates from GitHub',
    usage: '§checkupdate',
    isOwner: true,
    async execute(sock, msg, args, extra) {
        await extra.reply('🔍 *Checking for updates...*');
        
        try {
            const repoUrl = 'https://api.github.com/repos/akiraxyd-005/Voltaria-v2.0/commits/main';
            const response = await axios.get(repoUrl);
            const lastCommit = response.data;
            
            await extra.reply(`✅ *Update Check Complete*\n\n📦 Latest version: ${lastCommit.sha.substring(0, 7)}\n📝 Message: ${lastCommit.commit.message.split('\n')[0]}\n🕐 Date: ${new Date(lastCommit.commit.author.date).toLocaleDateString()}\n\nUse §update to apply updates.`);
        } catch (error) {
            await extra.reply('❌ Failed to check for updates.');
        }
    }
};