const fs = require('fs');
const relationshipsPath = './database/relationships.json';

module.exports = {
    name: 'unadopt',
    aliases: ['disown'],
    category: 'fun',
    description: 'Remove an adopted child from your family',
    usage: '§unadopt <child number>',
    isGroup: true,
    async execute(sock, msg, args, extra) {
        const childNum = parseInt(args[0]) - 1;
        
        if (isNaN(childNum)) {
            return extra.reply('❌ Please specify which child to unadopt.\nUsage: *§unadopt 1*');
        }
        
        let relationships = {};
        if (fs.existsSync(relationshipsPath)) relationships = JSON.parse(fs.readFileSync(relationshipsPath));
        
        const userData = relationships[extra.sender];
        
        if (!userData || userData.status !== 'married') {
            return extra.reply('❌ You must be married to have adopted children!');
        }
        
        const spouse = userData.partner;
        const coupleKey = [extra.sender, spouse].sort().join(':');
        
        const adoptions = relationships.adoptions || {};
        const children = adoptions[coupleKey] || [];
        
        if (!children[childNum]) {
            return extra.reply('❌ Invalid child number. Use §adoptlist to see your children.');
        }
        
        const removedChild = children[childNum];
        children.splice(childNum, 1);
        
        if (children.length === 0) {
            delete adoptions[coupleKey];
        } else {
            adoptions[coupleKey] = children;
        }
        
        relationships.adoptions = adoptions;
        
        // Remove child-parent relationship
        let childParents = {};
        if (fs.existsSync('./database/childparents.json')) childParents = JSON.parse(fs.readFileSync('./database/childparents.json'));
        delete childParents[removedChild];
        fs.writeFileSync('./database/childparents.json', JSON.stringify(childParents, null, 2));
        
        fs.writeFileSync(relationshipsPath, JSON.stringify(relationships, null, 2));
        
        await sock.sendMessage(extra.from, {
            text: `💔 *CHILD REMOVED FROM FAMILY* 💔\n\n@${extra.sender.split('@')[0]} and @${spouse.split('@')[0]} have disowned @${removedChild.split('@')[0]}.\n\nThis decision was not made lightly. 🥀`,
            mentions: [extra.sender, spouse, removedChild]
        }, { quoted: msg });
    }
};