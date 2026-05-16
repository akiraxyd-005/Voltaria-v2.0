const fs = require('fs');
const relationshipsPath = './database/relationships.json';

module.exports = {
    name: 'divorce',
    category: 'fun',
    description: 'File for divorce — your spouse must sign or contest',
    usage: '§divorce',
    async execute(sock, msg, args, extra) {
        let relationships = {};
        if (fs.existsSync(relationshipsPath)) relationships = JSON.parse(fs.readFileSync(relationshipsPath));
        
        const userData = relationships[extra.sender];
        
        if (!userData || userData.status !== 'married') {
            return extra.reply('❌ You are not married! Use §engage to propose first.');
        }
        
        const spouse = userData.partner;
        
        // Create divorce request
        relationships.divorces = relationships.divorces || {};
        relationships.divorces[extra.sender] = {
            spouse: spouse,
            initiatedBy: extra.sender,
            time: Date.now(),
            expires: Date.now() + 86400000,
            signed: false,
            contested: false
        };
        
        fs.writeFileSync(relationshipsPath, JSON.stringify(relationships, null, 2));
        
        await sock.sendMessage(extra.from, {
            text: `📋 *DIVORCE FILED* 📋\n\n@${extra.sender.split('@')[0]} has filed for divorce from @${spouse.split('@')[0]}.\n\n📜 *Options for @${spouse.split('@')[0]}:*\n• Type *§signdivorcepaper* to sign and end the marriage\n• Type *§contestdivorce* to contest (50/50 outcome)`,
            mentions: [extra.sender, spouse]
        }, { quoted: msg });
    }
};