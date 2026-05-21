/**
 * Arena Text Effect
 */

const mumaker = require('mumaker');
const config = require('../../config');

module.exports = {
  name: 'arena',
  aliases: [],
  category: 'textmaker',
  description: 'Create arena text effect',
  usage: '.arena <text>',
  
  async execute(sock, msg, args, extra) {
    try {
      const text = args.join(' ');
      const chatId = msg.chat;
      
      if (!text) {
        return await sock.sendMessage(chatId, { 
          text: 'Please provide text to generate\nExample: .arena Nick' 
        }, { quoted: msg });
      }
      
      const result = await mumaker.ephoto('https://en.ephoto360.com/create-cover-arena-of-valor-by-mastering-360.html', text);
      
      if (!result || !result.image) {
        throw new Error('No image URL received from the API');
      }
      
      await sock.sendMessage(chatId, {
        image: { url: result.image },
        caption: `━━━━━━━━━━━━━━━━━━━━━━━━━━
> ©𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 𝙽£𝚇𝚄$`
      }, { quoted: msg });
      
    } catch (error) {
      console.error('Error in arena command:', error);
      await sock.sendMessage(msg.chat, { 
        text: `Error: ${error.message}` 
      }, { quoted: msg });
    }
  }
};
