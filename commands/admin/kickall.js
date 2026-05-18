module.exports = {
    name: 'kickall',
    category: 'admin',
    description: 'Kick all members or members with specific country codes',
    usage: '§kickall <country code (optional)>',
    isGroup: true,
    isOwner: true,
    botAdmin: true,
    async execute(sock, msg, args, extra) {
        const metadata = await sock.groupMetadata(extra.from);
        let participants = metadata.participants;
        
        const countryCode = args[0];
        
        if (countryCode) {
            participants = participants.filter(p => p.id.startsWith(countryCode));
        }
        
        // Exclude admins and bot itself
        const toKick = participants.filter(p => 
            !p.admin && 
            p.id !== sock.user.id
        );
        
        if (toKick.length === 0) {
            return extra.reply(`📝 *𝑁𝑜 𝑚𝑒𝑚𝑏𝑒𝑟𝑠 𝑡𝑜 𝑘𝑖𝑐𝑘.*`);
        }
        
        await extra.reply(`⏳ *𝐾𝑖𝑐𝑘𝑖𝑛𝑔 ${toKick.length} 𝑚𝑒𝑚𝑏𝑒𝑟𝑠...*`);
        
        let kicked = 0;
        for (const user of toKick.slice(0, 30)) { // Limit to 30 per batch
            try {
                await sock.groupParticipantsUpdate(extra.from, [user.id], 'remove');
                kicked++;
            } catch (e) {}
            
            // Small delay to avoid rate limits
            await new Promise(r => setTimeout(r, 500));
        }
        
        await extra.reply(`👢 *𝐾𝑖𝑐𝑘𝑒𝑑 ${kicked} 𝑚𝑒𝑚𝑏𝑒𝑟𝑠*${countryCode ? ` (${countryCode} 𝑐𝑜𝑑𝑒𝑠)` : ''}.`);
        
        if (toKick.length > 30) {
            await extra.reply(`⚠️ *𝑂𝑛𝑙𝑦 ${kicked}/${toKick.length} 𝑚𝑒𝑚𝑏𝑒𝑟𝑠 𝑤𝑒𝑟𝑒 𝑘𝑖𝑐𝑘𝑒𝑑 𝑑𝑢𝑒 𝑡𝑜 𝑟𝑎𝑡𝑒 𝑙𝑖𝑚𝑖𝑡𝑠.*`);
        }
    }
};