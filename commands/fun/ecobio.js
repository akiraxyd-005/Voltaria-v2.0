const fs = require('fs');
const biosPath = './database/bios.json';

module.exports = {
    name: 'ecobio',
    category: 'fun',
    description: 'Set your economy profile bio',
    usage: '§ecobio <bio>',
    async execute(sock, msg, args, extra) {
        const bio = args.join(' ');
        
        if (!bio) {
            return extra.reply('❌ Please provide a bio.\nUsage: *§ecobio Your awesome bio here*');
        }
        
        let bios = {};
        if (fs.existsSync(biosPath)) bios = JSON.parse(fs.readFileSync(biosPath));
        
        bios[extra.sender] = bio;
        fs.writeFileSync(biosPath, JSON.stringify(bios, null, 2));
        
        await extra.reply(`📝 *Profile Bio Set*\n\n"${bio}"\n\nYour economy profile has been updated!`);
    }
};