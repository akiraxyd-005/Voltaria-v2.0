const fs = require('fs');
const relationshipsPath = './database/relationships.json';

module.exports = {
    name: 'signdivorcepaper',
    category: 'fun',
    description: 'Sign your divorce papers and part ways',
    usage: '§signdivorcepaper',
    async execute(sock, msg, args, extra) {
        let relationships = {};
        if (fs.existsSync(relationshipsPath)) relationships = JSON.parse(fs.readFileSync(relationshipsPath));
        
        const divorces = relationships.divorces || {};
        
        let pendingDivorce = null;
        for (const [userId, divorce] of Object.entries(divorces)) {
            if (divorce.spouse === extra.sender && !divorce.signed && !divorce.contested && divorce.expires > Date.now()) {
                pendingDivorce = { initiator: userId, ...divorce };
                break;
            }
        }
        
        if (!pendingDivorce) {
            return extra.reply('❌ You have no pending divorce papers to sign.');
        }
        
        // Remove marriage
        delete relationships[pendingDivorce.initiator];
        delete relationships[extra.sender];
        delete relationships.divorces[pendingDivorce.initiator];
        
        fs.writeFileSync(relationshipsPath, JSON.stringify(relationships, null, 2));
        
        await sock.sendMessage(extra.from, {
            text: `📜 *DIVORCE FINALIZED* 📜\n\n@${extra.sender.split('@')[0]} has signed the divorce papers.\n\nThe marriage between @${pendingDivorce.initiator.split('@')[0]} and @${extra.sender.split('@')[0]} is now over.\n\nMay you both find happiness apart. 💔`,
            mentions: [pendingDivorce.initiator, extra.sender]
        }, { quoted: msg });
    }
};