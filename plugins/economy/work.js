import type { CommandModule } from '../../lib/types.js';
import { EconomyEngine } from '../../lib/economy.js';
import { formatCurrency, createBorderedMessage } from '../../config.js';

export default {
  aliases: ['work', 'job', 'earn'],
  description: '💼 Work to earn V-Coins',
  category: 'economy',
  
  callback: async ({ client, sender }) => {
    const result = await EconomyEngine.work(sender);
    
    if (result.success) {
      const lines = [
        `${result.emoji} *✦ WORK COMPLETED ✦* ${result.emoji}`,
        ``,
        `📋 Job: ${result.job}`,
        `💰 Earnings: ${formatCurrency(result.earnings)}`,
        ``,
        `⏰ Next work available in 5 minutes`
      ];
      
      await client.sendMessage(sender, { text: createBorderedMessage(lines) });
    } else {
      const lines = [
        `⏰ *✦ WORK COOLDOWN ✦* ⏰`,
        ``,
        `⚠️ You're still working!`,
        ``,
        `🕐 Available in *${result.remaining} minutes*`
      ];
      
      await client.sendMessage(sender, { text: createBorderedMessage(lines) });
    }
  }
} satisfies CommandModule;