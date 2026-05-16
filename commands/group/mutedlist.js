const fs = require('fs');
const mutedPath = './database/mutedusers.json';

module.exports = {
    name: 'mutedlist',
    aliases: ['mutelist', 'listmuted'],
    category: 'group',
    description: 'List all muted users in this group',
    isGroup: true,
    isAdmin: true,
    async execute(sock, msg, args, extra) {
        let muted = {};
        if (fs.existsSync(mutedPath)) muted = JSON.parse(fs.readFileSync(mutedPath));
        
        const groupMuted = muted[extra.from] || {};
        const mutedList = Object.entries(groupMuted);
        
        if (mutedList.length === 0) {
            return extra.reply('📝 *No muted users* in this group.');
        }
        
        let listText = `🔇 *Muted Users in this Group*\n\n`;
        
        for (const [userId, data] of mutedList) {
            const remaining = data.expiresAt - Date.now();
            const remainingText = remaining > 0 ? formatDuration(remaining) : 'Expired';
            listText += `👤 @${userId.split('@')[0]}\n`;
            listText += `   ⏰ Remaining: ${remainingText}\n`;
            listText += `   📝 Reason: ${data.reason}\n\n`;
        }
        
        await sock.sendMessage(extra.from, {
            text: listText,
            mentions: mutedList.map(m => m[0])
        }, { quoted: msg });
    }
};

function formatDuration(ms) {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days} day${days > 1 ? 's' : ''}`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''}`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''}`;
    return `${seconds} second${seconds !== 1 ? 's' : ''}`;
}