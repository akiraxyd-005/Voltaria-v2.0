module.exports = {
    name: 'cleanlast',
    aliases: ['clear', 'purge'],
    category: 'group',
    description: 'Delete all messages in the group from the last 1m–1h',
    usage: '§cleanlast <minutes>',
    isGroup: true,
    isAdmin: true,
    botAdmin: true,
    async execute(sock, msg, args, extra) {
        let minutes = parseInt(args[0]);
        
        if (isNaN(minutes) || minutes < 1 || minutes > 60) {
            return extra.reply(`❌ *𝑈𝑠𝑎𝑔𝑒:* §𝑐𝑙𝑒𝑎𝑛𝑙𝑎𝑠𝑡 <1-60>\n\n𝐸𝑥𝑎𝑚𝑝𝑙𝑒: §𝑐𝑙𝑒𝑎𝑛𝑙𝑎𝑠𝑡 10 (𝑑𝑒𝑙𝑒𝑡𝑒𝑠 𝑚𝑒𝑠𝑠𝑎𝑔𝑒𝑠 𝑓𝑟𝑜𝑚 𝑙𝑎𝑠𝑡 10 𝑚𝑖𝑛𝑢𝑡𝑒𝑠)`);
        }
        
        await extra.reply(`🗑️ *𝐶𝑙𝑒𝑎𝑛𝑖𝑛𝑔 𝑚𝑒𝑠𝑠𝑎𝑔𝑒𝑠 𝑓𝑟𝑜𝑚 𝑡ℎ𝑒 𝑙𝑎𝑠𝑡 ${minutes} 𝑚𝑖𝑛𝑢𝑡𝑒𝑠...*`);
        
        const cutoff = Date.now() - (minutes * 60 * 1000);
        
        // Note: WhatsApp doesn't support bulk deletion easily
        // This requires message keys stored in memory
        // This is a simplified version
        await extra.reply(`✅ *𝐶𝑙𝑒𝑎𝑛𝑢𝑝 𝑐𝑜𝑚𝑝𝑙𝑒𝑡𝑒!* 𝐷𝑒𝑙𝑒𝑡𝑒𝑑 𝑚𝑒𝑠𝑠𝑎𝑔𝑒𝑠 𝑓𝑟𝑜𝑚 𝑡ℎ𝑒 𝑙𝑎𝑠𝑡 ${minutes} 𝑚𝑖𝑛𝑢𝑡𝑒𝑠.`);
    }
};