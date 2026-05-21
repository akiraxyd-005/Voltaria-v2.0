const axios = require('axios');
const FOOTER = '\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n> ©𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 𝙽£𝚇𝚄$';
const gif = async (r) => { const {data}=await axios.get(`https://api.otakugifs.xyz/gif?reaction=${r}`,{timeout:8000}); return data.url; };
module.exports = {
    name: 'nom', category: 'reactions', description: 'Nom someone', usage: '§nom @user',
    async execute(sock, msg, args, extra) {
        const t = msg.mentionedJid?.[0]||null;
        try {
            const url = await gif('nom');
            const cap = t ? `@${extra.sender.split('@')[0]} noms @${t.split('@')[0]} 😋${FOOTER}` : `@${extra.sender.split('@')[0]} noms 😋${FOOTER}`;
            await sock.sendMessage(msg.chat,{video:{url},gifPlayback:true,caption:cap,mentions:t?[extra.sender,t]:[extra.sender]},{quoted:msg});
        } catch(e){await extra.reply('❌ Failed to fetch GIF.');}
    }
};
