const fs = require('fs');
const relationshipsPath = './database/relationships.json';

module.exports = {
    name: 'engage',
    category: 'fun',
    description: 'Propose marriage to someone',
    usage: '§engage @user',
    async execute(sock, msg, args, extra) {
        const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;
        
        if (!mentioned || mentioned.length === 0) {
            return extra.reply('❌ Mention someone to propose to.\nUsage: *§engage @user*');
        }
        
        const target = mentioned[0];
        if (target === extra.sender) {
            return extra.reply('❌ You cannot propose to yourself!');
        }
        
        let relationships = {};
        if (fs.existsSync(relationshipsPath)) relationships = JSON.parse(fs.readFileSync(relationshipsPath));
        
        // Check if already married/engaged
        if (relationships[extra.sender]?.partner) {
            return extra.reply(`❌ You are already ${relationships[extra.sender].status === 'married' ? 'married' : 'engaged'} to someone else!`);
        }
        
        if (relationships[target]?.partner) {
            return extra.reply(`❌ @${target.split('@')[0]} is already ${relationships[target].status === 'married' ? 'married' : 'engaged'}!`, { mentions: [target] });
        }
        
        // Create proposal
        const proposalId = Date.now();
        relationships.proposals = relationships.proposals || {};
        relationships.proposals[proposalId] = {
            from: extra.sender,
            to: target,
            type: 'marriage',
            time: Date.now(),
            expires: Date.now() + 86400000 // 24 hours
        };
        
        fs.writeFileSync(relationshipsPath, JSON.stringify(relationships, null, 2));
        
        await sock.sendMessage(extra.from, {
            text: `💍 *MARRIAGE PROPOSAL* 💍\n\n@${extra.sender.split('@')[0]} has gone down on one knee for @${target.split('@')[0]}!\n\n_"I promise to stand by your side through every grind, every loss, every win — will you marry me?"_\n\n📜 **Type *§accept* to say YES 💒\nType *§reject* to decline 💔`,
            mentions: [extra.sender, target]
        }, { quoted: msg });
    }
};