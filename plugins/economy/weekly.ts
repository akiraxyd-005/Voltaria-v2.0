import type { CommandModule } from '../../lib/types.js';
import { EconomyEngine } from '../../lib/economy.js';
import { formatCurrency, createBorderedMessage } from '../../config.js';

export default {
  aliases: ['weekly', 'week'],
  description: '📅 Claim your weekly reward',
  category: 'economy',
  
  callback: async ({ client, sender }) => {
    const result = await EconomyEngine.weekly(sender);
    
    if (result.success) {
      const lines = [
        `📅 *✦ WEEKLY REWARD CLAIMED ✦* 📅`,
        ``,
        `💰 Reward: ${formatCurrency(result.reward)}`,
        ``,
        `✨ See you next week!`,
        `💡 VIP members get double rewards!`
      ];
      
      await client.sendMessage(sender, { text: createBorderedMessage(lines) });
    } else {
      const lines = [
        `📅 *✦ WEEKLY REWARD ✦* 📅`,
        ``,
        `⚠️ Already claimed this week!`,
        ``,
        `🕐 Next reward in *${result.remaining} days*`
      ];
      
      await client.sendMessage(sender, { text: createBorderedMessage(lines) });
    }
  }
} satisfies CommandModule;