const fs = require('fs');
const relationshipsPath = './database/relationships.json';
const economyPath = './database/economy.json';
const adoptionFee = 5000;
const maxAdoptions = 2;

module.exports = {
    name: 'adopt',
    category: 'fun',
    description: 'Adopt a group member (married couples only, max 2 children)',
    usage: '§adopt @user',
    isGroup: true,
    async execute(sock, msg, args, extra) {
        const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;
        
        if (!mentioned || mentioned.length === 0) {
            return extra.reply('❌ Mention someone to adopt!\nUsage: *§adopt @user*');
        }
        
        const child = mentioned[0];
        
        if (child === extra.sender) {
            return extra.reply('❌ You cannot adopt yourself!');
        }
        
        // Check if user is married
        let relationships = {};
        if (fs.existsSync(relationshipsPath)) relationships = JSON.parse(fs.readFileSync(relationshipsPath));
        
        const userData = relationships[extra.sender];
        
        if (!userData || userData.status !== 'married') {
            return extra.reply('❌ You must be married to adopt a child! Use §engage to propose first.');
        }
        
        const spouse = userData.partner;
        
        // Create couple key
        const coupleKey = [extra.sender, spouse].sort().join(':');
        
        // Check adoption limit
        let adoptions = {};
        if (fs.existsSync(relationshipsPath)) adoptions = relationships.adoptions || {};
        
        if (!adoptions[coupleKey]) adoptions[coupleKey] = [];
        
        if (adoptions[coupleKey].length >= maxAdoptions) {
            return extra.reply(`❌ You already have the maximum of ${maxAdoptions} adopted children!`);
        }
        
        // Check if child is already adopted by someone else
        let alreadyAdopted = false;
        for (const [key, children] of Object.entries(adoptions)) {
            if (children.includes(child)) {
                alreadyAdopted = true;
                break;
            }
        }
        
        if (alreadyAdopted) {
            return extra.reply(`❌ @${child.split('@')[0]} is already adopted by another family!`, { mentions: [child] });
        }
        
        // Check if user has enough money
        let economy = {};
        if (fs.existsSync(economyPath)) economy = JSON.parse(fs.readFileSync(economyPath));
        
        const userMoney = economy[extra.sender]?.balance || 0;
        
        if (userMoney < adoptionFee) {
            return extra.reply(`❌ Not enough XYLO.\nAdoption fee: *◈ ${adoptionFee.toLocaleString()}*\nYour wallet: *◈ ${userMoney.toLocaleString()}*`);
        }
        
        // Deduct adoption fee
        economy[extra.sender].balance -= adoptionFee;
        fs.writeFileSync(economyPath, JSON.stringify(economy, null, 2));
        
        // Add child to family
        adoptions[coupleKey].push(child);
        relationships.adoptions = adoptions;
        
        // Track child's parents for adoptlist
        let childParents = {};
        if (fs.existsSync('./database/childparents.json')) childParents = JSON.parse(fs.readFileSync('./database/childparents.json'));
        childParents[child] = { parents: [extra.sender, spouse], adoptedAt: Date.now() };
        fs.writeFileSync('./database/childparents.json', JSON.stringify(childParents, null, 2));
        
        fs.writeFileSync(relationshipsPath, JSON.stringify(relationships, null, 2));
        
        const remainingSlots = maxAdoptions - adoptions[coupleKey].length;
        
        await sock.sendMessage(extra.from, {
            text: `🎉 *ADOPTION COMPLETE!*\n\n👶 Welcome *@${child.split('@')[0]}* to the family!\n💍 Parents: @${extra.sender.split('@')[0]} & @${spouse.split('@')[0]}\n💸 Adoption fee: *◈ ${adoptionFee.toLocaleString()}*\n\n_${remainingSlots} adoption slot(s) remaining._`,
            mentions: [child, extra.sender, spouse]
        }, { quoted: msg });
    }
};