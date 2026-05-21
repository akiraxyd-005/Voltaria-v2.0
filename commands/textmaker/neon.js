/**
 * Neon Text Effect
 */

const mumaker = require('mumaker');
const config = require('../../config');

module.exports = {
  name: 'neon',
  aliases: [],
  category: 'textmaker',
  description: 'Create neon text effect',
  usage: '.neon <text>',
  
  async execute(sock, msg, args, extra) {
    try {
      const text = args.join(' ');
      const chatId = msg.chat;
      
      if (!text) {
        return await sock.sendMessage(chatId, { 
          text: 'Please provide text to generate\nExample: .neon Nick' 
        }, { quoted: msg });
      }
      
      const result = await mumaker.ephoto('https://en.ephoto360.com/create-colorful-neon-light-text-effects-online-797.html', text);
      
      if (!result || !result.image) {
        throw new Error('No image URL received from the API');
      }
      
      await sock.sendMessage(chatId, {
        image: { url: result.image },
        caption: `━━━━━━━━━━━━━━━━━━━━━━━━━━
> ©𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 𝙽£𝚇𝚄$`
      }, { quoted: msg });
      
    } catch (error) {
      console.error('Error in neon command:', error);
      await sock.sendMessage(msg.chat, { 
        text: `Error: ${error.message}` 
      }, { quoted: msg });
    }
  }
};
