const fs = require('fs');
const sudoPath = './database/sudo.json';

module.exports = {
    name: 'delsudo',
    category: 'owner',
    description: 'Remove a sudo user',
    usage: '§delsudo @user',
    isOwner: true,
    async execute(sock, msg, args, extra) {
        const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;
        
        if (!mentioned || mentioned.length === 0) {
            return extra.reply('❌ Mention a user to remove from sudo.\nUsage: §delsudo @user');
        }
        
        const target = mentioned[0];
        const targetName = target.split('@')[0];
        
        let sudo = {};
        if (fs.existsSync(sudoPath)) sudo = JSON.parse(fs.readFileSync(sudoPath));
        
        if (!sudo[target]) {
            return extra.reply(`⚠️ @${targetName} is not a sudo user.`);
        }
        
        delete sudo[target];
        fs.writeFileSync(sudoPath, JSON.stringify(sudo, null, 2));
        
        await sock.sendMessage(extra.from, {
            text: `❌ *Sudo User Removed*\n\n@${targetName} no longer has admin privileges.`,
            mentions: [target]
        }, { quoted: msg });
    }
};