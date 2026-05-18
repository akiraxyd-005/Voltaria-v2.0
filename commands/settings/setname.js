module.exports = {
    name: 'setname',
    category: 'settings',
    description: 'Update bot number display name',
    usage: '§setname <name>',
    isOwner: true,
    async execute(sock, msg, args, extra) {
        const name = args.join(' ');
        
        if (!name) {
            return extra.reply('❌ Please provide a name.\n\nUsage: §setname Voltaria Bot');
        }
        
        if (name.length > 25) {
            return extra.reply('❌ Name too long! Maximum 25 characters.');
        }
        
        try {
            await sock.updateProfileName(name);
            await extra.reply(`✅ *Name Updated!*\n\nNew name: ${name}`);
        } catch (error) {
            await extra.reply('❌ Failed to update name.');
        }
    }
};