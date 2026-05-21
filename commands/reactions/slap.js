const axios = require('axios');
const FOOTER = '\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n> ©𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 𝙽£𝚇𝚄$';
const gif = async (r) => { const {data}=await axios.get(`https://api.otakugifs.xyz/gif?reaction=${r}`,{timeout:8000}); return data.url; };
module.exports = {
    name: 'slap', category: 'reactions', description: 'Slap someone', usage: '§slap @user',
    async execute(sock, msg, args, extra) {
        const t = msg.mentionedJid?.[0]||null;
        try {
            const url = await gif('slap');
            const cap = t ? `@${extra.sender.split('@')[0]} slaps @${t.split('@')[0]} 👋${FOOTER}` : `@${extra.sender.split('@')[0]} slaps the air 👋${FOOTER}`;
            await sock.sendMessage(msg.chat,{video:{url},gifPlayback:true,caption:cap,mentions:t?[extra.sender,t]:[extra.sender]},{quoted:msg});
        } catch(e){await extra.reply('❌ Failed to fetch GIF.');}
    }
};
