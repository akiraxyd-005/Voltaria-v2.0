const axios = require('axios');
const FOOTER = '\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n> ©𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 𝙽£𝚇𝚄$';
const gif = async (r) => { const {data}=await axios.get(`https://api.otakugifs.xyz/gif?reaction=${r}`,{timeout:8000}); return data.url; };
module.exports = {
    name: 'wave', category: 'reactions', description: 'Wave at someone', usage: '§wave @user',
    async execute(sock, msg, args, extra) {
        const t = msg.mentionedJid?.[0]||null;
        try {
            const url = await gif('wave');
            const cap = t ? `@${extra.sender.split('@')[0]} waves at @${t.split('@')[0]} 👋${FOOTER}` : `@${extra.sender.split('@')[0]} waves 👋${FOOTER}`;
            await sock.sendMessage(msg.chat,{video:{url},gifPlayback:true,caption:cap,mentions:t?[extra.sender,t]:[extra.sender]},{quoted:msg});
        } catch(e){await extra.reply('❌ Failed to fetch GIF.');}
    }
};
