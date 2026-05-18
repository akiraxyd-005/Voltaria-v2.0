const fs = require('fs');
const sudoPath = './database/sudo.json';

module.exports = {
    name: 'setsudo',
    category: 'owner',
    description: 'Add a sudo user',
    usage: '§setsudo @user',
    isOwner: true,
    async execute(sock, msg, args, extra) {
        const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;
        
        if (!mentioned || mentioned.length === 0) {
            return extra.reply('❌ Mention a user to add as sudo.\nUsage: §setsudo @user');
        }
        
        const target = mentioned[0];
        const targetName = target.split('@')[0];
        
        let sudo = {};
        if (fs.existsSync(sudoPath)) sudo = JSON.parse(fs.readFileSync(sudoPath));
        
        if (sudo[target]) {
            return extra.reply(`⚠️ @${targetName} is already a sudo user.`);
        }
        
        sudo[target] = {
            addedAt: new Date().toISOString(),
            addedBy: extra.sender
        };
        
        fs.writeFileSync(sudoPath, JSON.stringify(sudo, null, 2));
        
        await sock.sendMessage(extra.from, {
            text: `✅ *Sudo User Added*\n\n@${targetName} can now use admin commands.`,
            mentions: [target]
        }, { quoted: msg });
    }
};