const fs = require('fs');
const relationshipsPath = './database/relationships.json';

module.exports = {
    name: 'adoptlist',
    aliases: ['family', 'myfamily'],
    category: 'fun',
    description: 'View your family (spouse and adopted children)',
    usage: '§adoptlist',
    isGroup: true,
    async execute(sock, msg, args, extra) {
        let relationships = {};
        if (fs.existsSync(relationshipsPath)) relationships = JSON.parse(fs.readFileSync(relationshipsPath));
        
        const userData = relationships[extra.sender];
        
        let spouse = 'Single';
        let spouseId = null;
        
        if (userData && userData.status === 'married') {
            spouse = `@${userData.partner.split('@')[0]}`;
            spouseId = userData.partner;
        }
        
        // Find adopted children
        const adoptions = relationships.adoptions || {};
        let children = [];
        let childIds = [];
        
        // Check if user is part of a couple
        for (const [coupleKey, childList] of Object.entries(adoptions)) {
            const [parent1, parent2] = coupleKey.split(':');
            if (parent1 === extra.sender || parent2 === extra.sender) {
                children = childList;
                childIds = childList;
                break;
            }
        }
        
        let childList = '';
        if (children.length === 0) {
            childList = '   *No adopted children yet*';
        } else {
            for (let i = 0; i < children.length; i++) {
                childList += `  ${i+1}. @${children[i].split('@')[0]}\n`;
            }
        }
        
        const box = `╔═══════════════════════╗
║  👨‍👩‍👧  *YOUR FAMILY*  👨‍👩‍👧  ║
╚═══════════════════════╝

💔 *Spouse:* ${spouse}

👶 *Adopted Children (${children.length}/2):*
${childList}`;
        
        const mentions = [spouseId, ...childIds].filter(Boolean);
        
        await sock.sendMessage(extra.from, {
            text: box,
            mentions: mentions
        }, { quoted: msg });
    }
};