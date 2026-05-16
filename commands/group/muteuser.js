const fs = require('fs');
const mutedPath = './database/mutedusers.json';

module.exports = {
    name: 'muteuser',
    aliases: ['mute', 'shutup'],
    category: 'group',
    description: 'Mute a specific user from sending messages',
    isGroup: true,
    isAdmin: true,
    botAdmin: false, // Bot doesn't need to be admin for this feature
    async execute(sock, msg, args, extra) {
        const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;
        const target = mentioned?.[0];
        
        if (!target) {
            return extra.reply('❌ Please mention the user to mute.\n\n📝 *Usage:* §mute @user <duration>\n\n⏰ *Durations:*\n• 30s, 1m, 5m, 1h, 1d, 1w\n• Or just §mute @user (default 10 minutes)\n\n*Examples:*\n§mute @user 5m\n§mute @user 1h\n§mute @user --reason spamming');
        }
        
        // Check if target is an admin (admins can't be muted)
        const metadata = await sock.groupMetadata(extra.from);
        const isTargetAdmin = metadata.participants.find(p => p.id === target)?.admin === 'admin' || 
                              metadata.participants.find(p => p.id === target)?.admin === 'superadmin';
        
        if (isTargetAdmin) {
            return extra.reply(`❌ Cannot mute an admin. Demote them first with §demote @${target.split('@')[0]}`);
        }
        
        // Parse duration
        let duration = args.find(arg => /^\d+[smhdw]$/i.test(arg));
        let reason = args.filter(arg => arg !== duration && !arg.startsWith('@')).join(' ');
        
        let durationMs = 10 * 60 * 1000; // Default 10 minutes
        
        if (duration) {
            const value = parseInt(duration);
            const unit = duration.slice(-1).toLowerCase();
            
            switch(unit) {
                case 's': durationMs = value * 1000; break;
                case 'm': durationMs = value * 60 * 1000; break;
                case 'h': durationMs = value * 60 * 60 * 1000; break;
                case 'd': durationMs = value * 24 * 60 * 60 * 1000; break;
                case 'w': durationMs = value * 7 * 24 * 60 * 60 * 1000; break;
                default: durationMs = 10 * 60 * 1000;
            }
        }
        
        // Remove --reason flag if present
        reason = reason.replace('--reason', '').trim();
        if (!reason) reason = 'No reason provided';
        
        // Load muted users database
        let muted = {};
        if (fs.existsSync(mutedPath)) muted = JSON.parse(fs.readFileSync(mutedPath));
        
        if (!muted[extra.from]) muted[extra.from] = {};
        
        const expiresAt = Date.now() + durationMs;
        
        muted[extra.from][target] = {
            expiresAt: expiresAt,
            reason: reason,
            mutedBy: extra.sender,
            mutedAt: new Date().toISOString()
        };
        
        fs.writeFileSync(mutedPath, JSON.stringify(muted, null, 2));
        
        // Format duration text
        const durationText = formatDuration(durationMs);
        
        // Send confirmation
        await sock.sendMessage(extra.from, {
            text: `🔇 *User Muted*\n\n👤 User: @${target.split('@')[0]}\n⏰ Duration: ${durationText}\n📝 Reason: ${reason}\n👑 Muted by: Admin\n\n⚠️ This user cannot send messages for the specified duration.`,
            mentions: [target, extra.sender]
        }, { quoted: msg });
        
        // Auto-unmute after duration
        setTimeout(async () => {
            let current = {};
            if (fs.existsSync(mutedPath)) current = JSON.parse(fs.readFileSync(mutedPath));
            
            if (current[extra.from]?.[target]) {
                delete current[extra.from][target];
                fs.writeFileSync(mutedPath, JSON.stringify(current, null, 2));
                await sock.sendMessage(extra.from, {
                    text: `🔊 @${target.split('@')[0]} has been automatically unmuted after ${durationText}.`,
                    mentions: [target]
                });
            }
        }, durationMs);
    }
};

function formatDuration(ms) {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    
    if (weeks > 0) return `${weeks} week${weeks > 1 ? 's' : ''}`;
    if (days > 0) return `${days} day${days > 1 ? 's' : ''}`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''}`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''}`;
    return `${seconds} second${seconds !== 1 ? 's' : ''}`;
}