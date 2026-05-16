const fs = require('fs');
const relationshipsPath = './database/relationships.json';

module.exports = {
    name: 'accept',
    category: 'fun',
    description: 'Accept a marriage proposal or date request',
    usage: '§accept',
    async execute(sock, msg, args, extra) {
        let relationships = {};
        if (fs.existsSync(relationshipsPath)) relationships = JSON.parse(fs.readFileSync(relationshipsPath));
        
        const proposals = relationships.proposals || {};
        
        // Find pending proposal for this user
        let pendingProposal = null;
        for (const [id, proposal] of Object.entries(proposals)) {
            if (proposal.to === extra.sender && proposal.expires > Date.now()) {
                pendingProposal = { id, ...proposal };
                break;
            }
        }
        
        if (!pendingProposal) {
            return extra.reply('❌ You have no pending proposals or requests.');
        }
        
        const proposer = pendingProposal.from;
        
        if (pendingProposal.type === 'marriage') {
            relationships[extra.sender] = { partner: proposer, status: 'married', since: Date.now() };
            relationships[proposer] = { partner: extra.sender, status: 'married', since: Date.now() };
            
            delete relationships.proposals[pendingProposal.id];
            fs.writeFileSync(relationshipsPath, JSON.stringify(relationships, null, 2));
            
            await sock.sendMessage(extra.from, {
                text: `💒 *MARRIAGE ACCEPTED!* 💒\n\n@${extra.sender.split('@')[0]} said YES to @${proposer.split('@')[0]}!\n\n🎉 Congratulations to the happy couple! 🎉\n\nMay your love last forever! 💕`,
                mentions: [extra.sender, proposer]
            }, { quoted: msg });
        } else if (pendingProposal.type === 'date') {
            relationships[extra.sender] = { ...relationships[extra.sender], dating: proposer, datingSince: Date.now() };
            relationships[proposer] = { ...relationships[proposer], dating: extra.sender, datingSince: Date.now() };
            
            delete relationships.proposals[pendingProposal.id];
            fs.writeFileSync(relationshipsPath, JSON.stringify(relationships, null, 2));
            
            await sock.sendMessage(extra.from, {
                text: `💕 *DATE ACCEPTED!* 💕\n\n@${extra.sender.split('@')[0]} said YES to @${proposer.split('@')[0]}!\n\nHave a wonderful time together! 🌹`,
                mentions: [extra.sender, proposer]
            }, { quoted: msg });
        }
    }
};