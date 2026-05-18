module.exports = {
    name: 'kick',
    aliases: ['remove', 'boot'],
    category: 'admin',
    description: 'Kick mentioned or replied user',
    usage: '§kick @user | Reply to a message with §kick',
    isGroup: true,
    isAdmin: true,
    botAdmin: true,
    async execute(sock, msg, args, extra) {
        let target = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
        
        // Check if replying to a message
        const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        if (!target && quoted) {
            target = msg.message?.extendedTextMessage?.contextInfo?.participant;
        }
        
        if (!target) {
            return extra.reply(`❌ *𝑈𝑠𝑎𝑔𝑒:* §𝑘𝑖𝑐𝑘 @𝑢𝑠𝑒𝑟\n\n𝑂𝑟 𝑟𝑒𝑝𝑙𝑦 𝑡𝑜 𝑎 𝑚𝑒𝑠𝑠𝑎𝑔𝑒 𝑤𝑖𝑡ℎ §𝑘𝑖𝑐𝑘`);
        }
        
        if (target === extra.sender) {
            return extra.reply(`❌ *𝑌𝑜𝑢 𝑐𝑎𝑛𝑛𝑜𝑡 𝑘𝑖𝑐𝑘 𝑦𝑜𝑢𝑟𝑠𝑒𝑙𝑓!*`);
        }
        
        // Check if target is admin
        const metadata = await sock.groupMetadata(extra.from);
        const isTargetAdmin = metadata.participants.find(p => p.id === target)?.admin === 'admin' || 
                              metadata.participants.find(p => p.id === target)?.admin === 'superadmin';
        
        if (isTargetAdmin) {
            return extra.reply(`❌ *𝐶𝑎𝑛𝑛𝑜𝑡 𝑘𝑖𝑐𝑘 𝑎𝑛 𝑎𝑑𝑚𝑖𝑛!* 𝐷𝑒𝑚𝑜𝑡𝑒 𝑡ℎ𝑒𝑚 𝑓𝑖𝑟𝑠𝑡.`);
        }
        
        try {
            await sock.groupParticipantsUpdate(extra.from, [target], 'remove');
            await sock.sendMessage(extra.from, {
                text: `👢 *𝑈𝑆𝐸𝑅 𝐾𝐼𝐶𝐾𝐸𝐷* 👢\n\n@${target.split('@')[0]} ℎ𝑎𝑠 𝑏𝑒𝑒𝑛 𝑟𝑒𝑚𝑜𝑣𝑒𝑑 𝑓𝑟𝑜𝑚 𝑡ℎ𝑒 𝑔𝑟𝑜𝑢𝑝.`,
                mentions: [target]
            }, { quoted: msg });
        } catch (error) {
            await extra.reply(`❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑘𝑖𝑐𝑘 𝑢𝑠𝑒𝑟. 𝑀𝑎𝑘𝑒 𝑠𝑢𝑟𝑒 𝐼'𝑚 𝑎𝑛 𝑎𝑑𝑚𝑖𝑛.`);
        }
    }
};