const fs = require('fs');
const relationshipsPath = './database/relationships.json';

module.exports = {
    name: 'mixedfeelings',
    category: 'fun',
    description: 'Set your relationship status to Mixed Feelings',
    usage: '§mixedfeelings',
    async execute(sock, msg, args, extra) {
        let relationships = {};
        if (fs.existsSync(relationshipsPath)) relationships = JSON.parse(fs.readFileSync(relationshipsPath));
        
        relationships[extra.sender] = relationships[extra.sender] || {};
        relationships[extra.sender].status = 'mixed_feelings';
        
        fs.writeFileSync(relationshipsPath, JSON.stringify(relationships, null, 2));
        
        await extra.reply(`💭 *Mixed Feelings* 💭\n\nYour relationship status has been set to *Mixed Feelings*.\n\nYou're not sure what you want right now... and that's okay. 🫤`);
    }
};