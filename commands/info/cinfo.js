// commands/info/cinfo.js (Enhanced Version)

/**
 * Extract invite code from WhatsApp channel link
 */
function getChannelInviteCode(link) {
  try {
    let cleanLink = link.trim();
    cleanLink = cleanLink.split('?')[0].split('#')[0];
    
    try {
      const url = new URL(cleanLink);
      const parts = url.pathname.split('/').filter(Boolean);
      const code = parts[parts.length - 1];
      if (code && code.length > 0) return code;
    } catch (urlError) {}
    
    const patterns = [
      /(?:whatsapp\.com|wa\.me)\/channel\/([A-Za-z0-9]+)/i,
      /\/channel\/([A-Za-z0-9]+)/i,
      /channel\/([A-Za-z0-9]+)/i
    ];
    
    for (const pattern of patterns) {
      const match = cleanLink.match(pattern);
      if (match && match[1]) return match[1];
    }
    
    if (/^[A-Za-z0-9]+$/.test(cleanLink)) return cleanLink;
    
    return null;
  } catch (error) {
    return null;
  }
}

module.exports = {
  name: 'cinfo',
  aliases: ['channel', 'channelinfo', 'nl'],
  category: 'info',
  description: 'Get WhatsApp channel/newsletter info',
  usage: '§cinfo <channel link or JID>',
  async execute(sock, msg, args, extra) {
    try {
      const text = msg.message?.conversation || 
                   msg.message?.extendedTextMessage?.text ||
                   args.join(' ');
      
      if (!text || text.trim().length === 0) {
        return extra.reply('✖ Provide a channel link or reply to one.\n\nUsage:\n• *§cinfo https://whatsapp.com/channel/xxxxx*\n• Reply to a channel link with *§cinfo*');
      }
      
      let link = text.replace(/^§(cinfo|channel|channelinfo|nl)\s+/i, '').trim() || args.join(' ').trim();
      
      if (!link || link.length === 0) {
        return extra.reply('✖ Provide a channel link or reply to one.\n\nUsage:\n• *§cinfo https://whatsapp.com/channel/xxxxx*\n• Reply to a channel link with *§cinfo*');
      }
      
      const inviteCode = getChannelInviteCode(link);
      
      if (!inviteCode) {
        return extra.reply('❌ Could not extract invite code from the link!\n\nPlease provide a valid WhatsApp channel link.\nExample: https://whatsapp.com/channel/0029VaAbCdEfGhIJkL');
      }
      
      try {
        const meta = await sock.newsletterMetadata('invite', inviteCode);
        
        if (!meta) {
          throw new Error('Newsletter not found');
        }
        
        let infoText = `◆ *Channel Information*\n\n*Name:* ${meta.name || 'Unknown'}\n*Subscribers:* ${meta.subscriberCount?.toLocaleString() || '0'}\n*Verified:* ${meta.verified ? '✅ Verified' : '✖ Not Verified'}\n*Created:* ${meta.creationTime ? new Date(meta.creationTime * 1000).toLocaleString() : 'Unknown'}\n*Link:* https://whatsapp.com/channel/${inviteCode}\n\n*Description:*\n${meta.description || 'No description'}\n\n> ©𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 𝙽£𝚇𝚄$`;
        
        if (meta.image) {
          await sock.sendMessage(extra.from, {
            image: { url: meta.image },
            caption: infoText
          }, { quoted: msg });
        } else {
          await extra.reply(infoText);
        }
        
      } catch (error) {
        if (error.message.includes('Invalid channel link')) {
          await extra.reply('❌ Invalid channel link format!\n\nPlease provide a valid WhatsApp channel link.');
        } else if (error.message.includes('Newsletter not found')) {
          await extra.reply('❌ Newsletter not found!\n\nThe channel link might be invalid or the newsletter might not exist.');
        } else {
          await extra.reply(`❌ Failed to get channel information: ${error.message}`);
        }
      }
      
    } catch (error) {
      await extra.reply(`❌ An error occurred: ${error.message}`);
    }
  }
};