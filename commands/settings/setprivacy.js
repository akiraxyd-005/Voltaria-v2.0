module.exports = {
    name: 'setprivacy',
    category: 'settings',
    description: 'Update a bot number privacy setting',
    usage: '§setprivacy <setting> <value>',
    isOwner: true,
    async execute(sock, msg, args, extra) {
        const setting = args[0]?.toLowerCase();
        const value = args[1]?.toLowerCase();
        
        const validSettings = ['lastseen', 'profilephoto', 'about', 'status', 'readreceipts', 'groups'];
        const validValues = ['everyone', 'contacts', 'contactblacklist', 'nobody', 'on', 'off'];
        
        if (!setting || !validSettings.includes(setting)) {
            return extra.reply(`❌ Invalid setting.\n\nValid settings: ${validSettings.join(', ')}\n\nExample: §setprivacy lastseen contacts`);
        }
        
        if (!value || !validValues.includes(value)) {
            return extra.reply(`❌ Invalid value.\n\nValid values: ${validValues.join(', ')}\n\nExample: §setprivacy lastseen contacts`);
        }
        
        try {
            const privacyMap = {
                'lastseen': 'lastseen',
                'profilephoto': 'profilepicture',
                'about': 'about',
                'status': 'status',
                'readreceipts': 'readreceipts',
                'groups': 'groups'
            };
            
            const valueMap = {
                'everyone': 'all',
                'contacts': 'contacts',
                'nobody': 'none',
                'on': true,
                'off': false
            };
            
            await sock.updatePrivacySettings({
                [privacyMap[setting]]: valueMap[value] || value
            });
            
            await extra.reply(`✅ *Privacy Setting Updated*\n\n${setting} → ${value.toUpperCase()}`);
        } catch (error) {
            await extra.reply('❌ Failed to update privacy setting.');
        }
    }
};