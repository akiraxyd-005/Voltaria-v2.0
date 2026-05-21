const axios = require('axios');
const FOOTER = '\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n> ©𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 𝙽£𝚇𝚄$';
const gif = async (r) => { const {data}=await axios.get(`https://api.otakugifs.xyz/gif?reaction=${r}`,{timeout:8000}); return data.url; };
module.exports = {
    name: 'handhold', category: 'reactions', description: 'Hold someone\'s hand', usage: '§handhold @user',
    async execute(sock, msg, args, extra) {
        const t = msg.mentionedJid?.[0]||null;
        if(!t) return extra.reply('❌ Mention someone!\nUsage: §handhold @user');
        try {
            const url = await gif('handhold');
            await sock.sendMessage(msg.chat,{video:{url},gifPlayback:true,caption:`@${extra.sender.split('@')[0]} holds hands with @${t.split('@')[0]} 🤝${FOOTER}`,mentions:[extra.sender,t]},{quoted:msg});
        } catch(e){await extra.reply('❌ Failed to fetch GIF.');}
    }
};
