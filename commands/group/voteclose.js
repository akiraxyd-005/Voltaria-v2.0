const fs = require('fs');
const votesPath = './database/votes.json';

module.exports = {
    name: 'voteclose',
    category: 'group',
    description: 'Start a democracy vote to kick a user',
    usage: '§voteclose @user',
    isGroup: true,
    isAdmin: true,
    async execute(sock, msg, args, extra) {
        const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;
        
        if (!mentioned || mentioned.length === 0) {
            return extra.reply(`❌ *𝑈𝑠𝑎𝑔𝑒:* §𝑣𝑜𝑡𝑒𝑐𝑙𝑜𝑠𝑒 @𝑢𝑠𝑒𝑟`);
        }
        
        const target = mentioned[0];
        const metadata = await sock.groupMetadata(extra.from);
        const totalMembers = metadata.participants.length;
        const requiredVotes = Math.ceil(totalMembers * 0.5);
        
        let votes = {};
        if (fs.existsSync(votesPath)) votes = JSON.parse(fs.readFileSync(votesPath));
        
        const voteId = `${extra.from}_${target}`;
        
        if (votes[voteId] && votes[voteId].active) {
            return extra.reply(`⚠️ *𝐴 𝑣𝑜𝑡𝑒 𝑖𝑠 𝑎𝑙𝑟𝑒𝑎𝑑𝑦 𝑎𝑐𝑡𝑖𝑣𝑒 𝑓𝑜𝑟 @${target.split('@')[0]}*`, { mentions: [target] });
        }
        
        votes[voteId] = {
            target: target,
            groupId: extra.from,
            yes: [],
            no: [],
            active: true,
            startTime: Date.now(),
            endTime: Date.now() + 300000, // 5 minutes
            requiredVotes: requiredVotes
        };
        
        fs.writeFileSync(votesPath, JSON.stringify(votes, null, 2));
        
        await sock.sendMessage(extra.from, {
            text: `🗳️ *𝐷𝐸𝑀𝑂𝐶𝑅𝐴𝐶𝑌 𝑉𝑂𝑇𝐸* 🗳️\n\n𝐴 𝑣𝑜𝑡𝑒 ℎ𝑎𝑠 𝑏𝑒𝑒𝑛 𝑠𝑡𝑎𝑟𝑡𝑒𝑑 𝑡𝑜 𝑘𝑖𝑐𝑘 @${target.split('@')[0]}.\n\n📊 *𝑅𝑒𝑞𝑢𝑖𝑟𝑒𝑑 𝑣𝑜𝑡𝑒𝑠:* ${requiredVotes}/${totalMembers}\n⏱️ *𝑇𝑖𝑚𝑒 𝑙𝑖𝑚𝑖𝑡:* 5 𝑚𝑖𝑛𝑢𝑡𝑒𝑠\n\n𝑅𝑒𝑝𝑙𝑦 𝑤𝑖𝑡ℎ *𝑦𝑒𝑠* 𝑜𝑟 *𝑛𝑜* 𝑡𝑜 𝑣𝑜𝑡𝑒!`,
            mentions: [target]
        }, { quoted: msg });
        
        // Auto-end after 5 minutes
        setTimeout(async () => {
            const currentVote = votes[voteId];
            if (currentVote && currentVote.active) {
                currentVote.active = false;
                const yesCount = currentVote.yes.length;
                const noCount = currentVote.no.length;
                
                if (yesCount >= requiredVotes) {
                    await sock.groupParticipantsUpdate(extra.from, [target], 'remove');
                    await sock.sendMessage(extra.from, { text: `✅ *𝑉𝑜𝑡𝑒 𝑝𝑎𝑠𝑠𝑒𝑑!* @${target.split('@')[0]} ℎ𝑎𝑠 𝑏𝑒𝑒𝑛 𝑟𝑒𝑚𝑜𝑣𝑒𝑑.\n\n𝑌𝑒𝑠: ${yesCount} | 𝑁𝑜: ${noCount}`, mentions: [target] });
                } else {
                    await sock.sendMessage(extra.from, { text: `❌ *𝑉𝑜𝑡𝑒 𝑓𝑎𝑖𝑙𝑒𝑑.* @${target.split('@')[0]} 𝑤𝑖𝑙𝑙 𝑟𝑒𝑚𝑎𝑖𝑛 𝑖𝑛 𝑡ℎ𝑒 𝑔𝑟𝑜𝑢𝑝.\n\n𝑌𝑒𝑠: ${yesCount} | 𝑁𝑜: ${noCount}`, mentions: [target] });
                }
                
                fs.writeFileSync(votesPath, JSON.stringify(votes, null, 2));
            }
        }, 300000);
    }
};