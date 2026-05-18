module.exports = {
    name: 'totalmember',
    aliases: ['membercount', 'total'],
    category: 'group',
    description: 'Show total members in the group',
    usage: '§totalmember',
    isGroup: true,
    async execute(sock, msg, args, extra) {
        const metadata = await sock.groupMetadata(extra.from);
        const total = metadata.participants.length;
        const admins = metadata.participants.filter(p => p.admin === 'admin' || p.admin === 'superadmin').length;
        const bots = metadata.participants.filter(p => p.id.includes('bot') || p.id.includes('whatsapp')).length;
        
        await extra.reply(`┏━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  👥 *𝑀𝐸𝑀𝐵𝐸𝑅 𝑆𝑇𝐴𝑇𝑆* 👥
┗━━━━━━━━━━━━━━━━━━━━━━━━┛

📊 *𝑇𝑜𝑡𝑎𝑙:* ${total}
👑 *𝐴𝑑𝑚𝑖𝑛𝑠:* ${admins}
🤖 *𝐵𝑜𝑡𝑠:* ${bots}
👤 *𝑀𝑒𝑚𝑏𝑒𝑟𝑠:* ${total - admins - bots}

━━━━━━━━━━━━━━━━━━━━━━━━━━
> ©𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 𝙽£𝚇𝚄$`);
    }
};