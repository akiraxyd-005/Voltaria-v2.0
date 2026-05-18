const { exec } = require('child_process');

module.exports = {
    name: 'update',
    category: 'owner',
    description: 'Apply latest updates from GitHub and restart bot',
    usage: '§update',
    isOwner: true,
    async execute(sock, msg, args, extra) {
        await extra.reply('🔄 *Updating bot...*\nThis may take a moment.');
        
        exec('git pull', async (error, stdout, stderr) => {
            if (error) {
                await extra.reply(`❌ *Update failed*\n\n${error.message}`);
                return;
            }
            
            await extra.reply(`✅ *Update successful!*\n\n${stdout}\n\nRestarting bot...`);
            process.exit(0);
        });
    }
};