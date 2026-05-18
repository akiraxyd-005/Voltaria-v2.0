module.exports = {
    name: 'demote',
    aliases: ['removeadmin'],
    category: 'admin',
    description: 'Demote user from admin',
    usage: '§demote @user',
    isGroup: true,
    isAdmin: true,
    botAdmin: true,
    async execute(sock, msg, args, extra) {
        const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;
        
        if (!mentioned || mentioned.length === 0) {
            return extra.reply(`❌ *𝑈𝑠𝑎𝑔𝑒:* §𝑑𝑒𝑚𝑜𝑡𝑒 @𝑢𝑠𝑒𝑟`);
        }
        
        const target = mentioned[0];
        
        try {
            await sock.groupParticipantsUpdate(extra.from, [target], 'demote');
            await sock.sendMessage(extra.from, {
                text: `❌ *𝑈𝑆𝐸𝑅 𝐷𝐸𝑀𝑂𝑇𝐸𝐷* ❌\n\n@${target.split('@')[0]} ℎ𝑎𝑠 𝑏𝑒𝑒𝑛 𝑑𝑒𝑚𝑜𝑡𝑒𝑑 𝑓𝑟𝑜𝑚 𝑎𝑑𝑚𝑖𝑛.`,
                mentions: [target]
            }, { quoted: msg });
        } catch (error) {
            await extra.reply(`❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑑𝑒𝑚𝑜𝑡𝑒 𝑢𝑠𝑒𝑟.`);
        }
    }
};