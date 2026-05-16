const fs = require('fs');
const relationshipsPath = './database/relationships.json';

module.exports = {
    name: 'reject',
    category: 'fun',
    description: 'Reject a marriage proposal or date request',
    usage: '§reject',
    async execute(sock, msg, args, extra) {
        let relationships = {};
        if (fs.existsSync(relationshipsPath)) relationships = JSON.parse(fs.readFileSync(relationshipsPath));
        
        const proposals = relationships.proposals || {};
        
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
        
        delete relationships.proposals[pendingProposal.id];
        fs.writeFileSync(relationshipsPath, JSON.stringify(relationships, null, 2));
        
        await sock.sendMessage(extra.from, {
            text: `💔 *REJECTED* 💔\n\n@${extra.sender.split('@')[0]} said NO to @${proposer.split('@')[0]}.\n\nMaybe next time... 🥀`,
            mentions: [extra.sender, proposer]
        }, { quoted: msg });
    }
};