const fs = require('fs');
const relationshipsPath = './database/relationships.json';

module.exports = {
    name: 'contestdivorce',
    category: 'fun',
    description: 'Contest your divorce in court — 50/50 outcome',
    usage: '§contestdivorce',
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
            return extra.reply('❌ You have no pending divorce to contest.');
        }
        
        const outcome = Math.random() < 0.5;
        relationships.divorces[pendingDivorce.initiator].contested = true;
        
        if (outcome) {
            // Divorce granted
            delete relationships[pendingDivorce.initiator];
            delete relationships[extra.sender];
            delete relationships.divorces[pendingDivorce.initiator];
            
            await sock.sendMessage(extra.from, {
                text: `⚖️ *COURT DECISION* ⚖️\n\nAfter reviewing the case, the judge has GRANTED the divorce.\n\nThe marriage between @${pendingDivorce.initiator.split('@')[0]} and @${extra.sender.split('@')[0]} is officially over.\n\nCase closed. 💔`,
                mentions: [pendingDivorce.initiator, extra.sender]
            }, { quoted: msg });
        } else {
            // Divorce denied
            delete relationships.divorces[pendingDivorce.initiator];
            
            await sock.sendMessage(extra.from, {
                text: `⚖️ *COURT DECISION* ⚖️\n\nAfter reviewing the case, the judge has DENIED the divorce.\n\nThe marriage between @${pendingDivorce.initiator.split('@')[0]} and @${extra.sender.split('@')[0]} must continue.\n\nTry counseling! 💕`,
                mentions: [pendingDivorce.initiator, extra.sender]
            }, { quoted: msg });
        }
        
        fs.writeFileSync(relationshipsPath, JSON.stringify(relationships, null, 2));
    }
};