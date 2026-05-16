const fs = require('fs');
const relationshipsPath = './database/relationships.json';

module.exports = {
    name: 'date',
    category: 'fun',
    description: 'Ask someone to date you',
    usage: '§date @user',
    async execute(sock, msg, args, extra) {
        const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;
        
        if (!mentioned || mentioned.length === 0) {
            return extra.reply('❌ Mention someone to ask out.\nUsage: *§date @user*');
        }
        
        const target = mentioned[0];
        if (target === extra.sender) {
            return extra.reply('❌ You cannot date yourself!');
        }
        
        let relationships = {};
        if (fs.existsSync(relationshipsPath)) relationships = JSON.parse(fs.readFileSync(relationshipsPath));
        
        // Check if already dating
        if (relationships[extra.sender]?.dating) {
            return extra.reply(`❌ You are already dating someone! Use §breakup first.`);
        }
        
        if (relationships[target]?.dating) {
            return extra.reply(`❌ @${target.split('@')[0]} is already dating someone!`, { mentions: [target] });
        }
        
        // Create date request
        relationships.proposals = relationships.proposals || {};
        relationships.proposals[Date.now()] = {
            from: extra.sender,
            to: target,
            type: 'date',
            time: Date.now(),
            expires: Date.now() + 86400000
        };
        
        fs.writeFileSync(relationshipsPath, JSON.stringify(relationships, null, 2));
        
        await sock.sendMessage(extra.from, {
            text: `💌 *DATE REQUEST* 💌\n\n@${extra.sender.split('@')[0]} is asking @${target.split('@')[0]} out!\n\n_"🎲 Built on risk, powered by luck 🎰"_\n\nType *§accept* to say yes 💕\nType *§reject* to decline 🚫`,
            mentions: [extra.sender, target]
        }, { quoted: msg });
    }
};