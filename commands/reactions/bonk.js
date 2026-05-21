const axios = require('axios');
const FOOTER = '\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n> ©𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 𝙽£𝚇𝚄$';
const gif = async (r) => { const {data}=await axios.get(`https://api.otakugifs.xyz/gif?reaction=${r}`,{timeout:8000}); return data.url; };
module.exports = {
    name: 'bonk', category: 'reactions', description: 'Bonk someone', usage: '§bonk @user',
    async execute(sock, msg, args, extra) {
        const t = msg.mentionedJid?.[0]||null;
        if(!t) return extra.reply('❌ Mention someone to bonk!\nUsage: §bonk @user');
        try {
            const url = await gif('slap');
            await sock.sendMessage(msg.chat,{video:{url},gifPlayback:true,caption:`@${extra.sender.split('@')[0]} bonks @${t.split('@')[0]} 🔨 Go to horny jail!${FOOTER}`,mentions:[extra.sender,t]},{quoted:msg});
        } catch(e){await extra.reply('❌ Failed to fetch GIF.');}
    }
};
