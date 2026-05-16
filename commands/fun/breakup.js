const fs = require('fs');
const relationshipsPath = './database/relationships.json';

module.exports = {
    name: 'breakup',
    category: 'fun',
    description: 'End your current dating relationship',
    usage: '§breakup',
    async execute(sock, msg, args, extra) {
        let relationships = {};
        if (fs.existsSync(relationshipsPath)) relationships = JSON.parse(fs.readFileSync(relationshipsPath));
        
        const userData = relationships[extra.sender];
        
        if (!userData || !userData.dating) {
            return extra.reply('❌ You are not dating anyone! Use §date to ask someone out.');
        }
        
        const ex = userData.dating;
        
        delete relationships[extra.sender].dating;
        delete relationships[extra.sender].datingSince;
        if (relationships[ex]) {
            delete relationships[ex].dating;
            delete relationships[ex].datingSince;
        }
        
        fs.writeFileSync(relationshipsPath, JSON.stringify(relationships, null, 2));
        
        await sock.sendMessage(extra.from, {
            text: `💔 *BREAKUP* 💔\n\n@${extra.sender.split('@')[0]} and @${ex.split('@')[0]} have ended their relationship.\n\nSometimes love isn't enough. 💀`,
            mentions: [extra.sender, ex]
        }, { quoted: msg });
    }
};