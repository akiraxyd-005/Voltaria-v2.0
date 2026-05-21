const axios = require('axios');
const FOOTER = '\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n> ©𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 𝙽£𝚇𝚄$';
const gif = async (r) => { const {data}=await axios.get(`https://api.otakugifs.xyz/gif?reaction=${r}`,{timeout:8000}); return data.url; };
module.exports = {
    name: 'cringe', category: 'reactions', description: 'Cringe reaction', usage: '§cringe',
    async execute(sock, msg, args, extra) {
        try {
            const url = await gif('cry');
            await sock.sendMessage(msg.chat,{video:{url},gifPlayback:true,caption:`@${extra.sender.split('@')[0]} is cringing 😬${FOOTER}`,mentions:[extra.sender]},{quoted:msg});
        } catch(e){await extra.reply('❌ Failed to fetch GIF.');}
    }
};
