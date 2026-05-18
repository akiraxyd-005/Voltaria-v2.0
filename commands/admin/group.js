module.exports = {
    name: 'group',
    category: 'admin',
    description: 'Open or close group',
    usage: '§group open | close',
    isGroup: true,
    isAdmin: true,
    botAdmin: true,
    async execute(sock, msg, args, extra) {
        const action = args[0]?.toLowerCase();
        
        if (action === 'close') {
            await sock.groupSettingUpdate(extra.from, 'announcement');
            await extra.reply(`🔒 *𝐺𝑟𝑜𝑢𝑝 𝐶𝑙𝑜𝑠𝑒𝑑* 🔒\n\n𝑂𝑛𝑙𝑦 𝑎𝑑𝑚𝑖𝑛𝑠 𝑐𝑎𝑛 𝑠𝑒𝑛𝑑 𝑚𝑒𝑠𝑠𝑎𝑔𝑒𝑠 𝑛𝑜𝑤.`);
        } else if (action === 'open') {
            await sock.groupSettingUpdate(extra.from, 'not_announcement');
            await extra.reply(`🔓 *𝐺𝑟𝑜𝑢𝑝 𝑂𝑝𝑒𝑛𝑒𝑑* 🔓\n\n𝐴𝑙𝑙 𝑚𝑒𝑚𝑏𝑒𝑟𝑠 𝑐𝑎𝑛 𝑠𝑒𝑛𝑑 𝑚𝑒𝑠𝑠𝑎𝑔𝑒𝑠 𝑛𝑜𝑤.`);
        } else if (action === 'status') {
            const metadata = await sock.groupMetadata(extra.from);
            const status = metadata.announce ? '🔒 𝐶𝐿𝑂𝑆𝐸𝐷 (𝐴𝑑𝑚𝑖𝑛𝑠 𝑜𝑛𝑙𝑦)' : '🔓 𝑂𝑃𝐸𝑁 (𝐴𝑙𝑙 𝑚𝑒𝑚𝑏𝑒𝑟𝑠)';
            await extra.reply(`📊 *𝐺𝑟𝑜𝑢𝑝 𝑆𝑡𝑎𝑡𝑢𝑠*\n\n${status}`);
        } else {
            await extra.reply(`📝 *𝐺𝑟𝑜𝑢𝑝 𝐶𝑜𝑛𝑡𝑟𝑜𝑙*\n\n§𝑔𝑟𝑜𝑢𝑝 𝑜𝑝𝑒𝑛 - 𝑂𝑝𝑒𝑛 𝑔𝑟𝑜𝑢𝑝 𝑓𝑜𝑟 𝑎𝑙𝑙 𝑚𝑒𝑚𝑏𝑒𝑟𝑠\n§𝑔𝑟𝑜𝑢𝑝 𝑐𝑙𝑜𝑠𝑒 - 𝑅𝑒𝑠𝑡𝑟𝑖𝑐𝑡 𝑡𝑜 𝑎𝑑𝑚𝑖𝑛𝑠 𝑜𝑛𝑙𝑦\n§𝑔𝑟𝑜𝑢𝑝 𝑠𝑡𝑎𝑡𝑢𝑠 - 𝐶ℎ𝑒𝑐𝑘 𝑐𝑢𝑟𝑟𝑒𝑛𝑡 𝑠𝑡𝑎𝑡𝑢𝑠`);
        }
    }
};