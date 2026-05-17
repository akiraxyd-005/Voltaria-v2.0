module.exports = {
    name: 'restart',
    aliases: ['reboot'],
    category: 'owner',
    description: 'Restart the bot',
    usage: '§restart',
    isOwner: true,
    async execute(sock, msg, args, extra) {
        await extra.reply('🔄 *Restarting bot...*');
        process.exit(0);
    }
};