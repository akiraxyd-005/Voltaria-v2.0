/**
 * Snow Text Effect
 */

const mumaker = require('mumaker');
const config = require('../../config');

module.exports = {
  name: 'snow',
  aliases: [],
  category: 'textmaker',
  description: 'Create snow text effect',
  usage: '.snow <text>',
  
  async execute(sock, msg, args, extra) {
    try {
      const text = args.join(' ');
      if (!text) {
        return await sock.sendMessage(msg.chat, { 
          text: 'Please provide text to generate\nExample: .snow Nick' 
        }, { quoted: msg });
      }
      
      const result = await mumaker.ephoto('https://en.ephoto360.com/create-a-snow-3d-text-effect-free-online-621.html', text);
      
      if (!result || !result.image) {
        throw new Error('No image URL received from the API');
      }
      
      await sock.sendMessage(msg.chat, {
        image: { url: result.image },
        caption: `━━━━━━━━━━━━━━━━━━━━━━━━━━
> ©𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 𝙽£𝚇𝚄$`
      }, { quoted: msg });
      
    } catch (error) {
      console.error('Error in snow command:', error);
      await sock.sendMessage(msg.chat, { 
        text: `Error: ${error.message}` 
      }, { quoted: msg });
    }
  }
};
