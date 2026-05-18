module.exports = {
    name: 'setbio',
    category: 'settings',
    description: 'Update bot number bio',
    usage: '§setbio <bio text>',
    isOwner: true,
    async execute(sock, msg, args, extra) {
        const bio = args.join(' ');
        
        if (!bio) {
            return extra.reply('❌ Please provide a bio.\n\nUsage: §setbio Your bot bio here');
        }
        
        if (bio.length > 139) {
            return extra.reply('❌ Bio too long! Maximum 139 characters.');
        }
        
        try {
            await sock.updateProfileStatus(bio);
            await extra.reply(`✅ *Bio Updated!*\n\nNew bio: ${bio}`);
        } catch (error) {
            await extra.reply('❌ Failed to update bio.');
        }
    }
};