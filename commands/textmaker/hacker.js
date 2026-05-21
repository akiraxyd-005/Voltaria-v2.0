/**
 * Hacker Text Effect
 */

const mumaker = require('mumaker');
const config = require('../../config');

module.exports = {
  name: 'hacker',
  aliases: [],
  category: 'textmaker',
  description: 'Create hacker text effect',
  usage: '.hacker <text>',
  
  async execute(sock, msg, args, extra) {
    try {
      const text = args.join(' ');
      const chatId = msg.chat;
      
      if (!text) {
        return await sock.sendMessage(chatId, { 
          text: 'Please provide text to generate\nExample: .hacker Nick' 
        }, { quoted: msg });
      }
      
      const result = await mumaker.ephoto('https://en.ephoto360.com/create-anonymous-hacker-avatars-cyan-neon-677.html', text);
      
      if (!result || !result.image) {
        throw new Error('No image URL received from the API');
      }
      
      await sock.sendMessage(chatId, {
        image: { url: result.image },
        caption: `━━━━━━━━━━━━━━━━━━━━━━━━━━
> ©𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 𝙽£𝚇𝚄$`
      }, { quoted: msg });
      
    } catch (error) {
      console.error('Error in hacker command:', error);
      await sock.sendMessage(msg.chat, { 
        text: `Error: ${error.message}` 
      }, { quoted: msg });
    }
  }
};
