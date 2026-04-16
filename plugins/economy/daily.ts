import type { CommandModule } from '../../lib/types.js';
import { EconomyEngine } from '../../lib/economy.js';
import { formatCurrency, createBorderedMessage } from '../../config.js';

export default {
  aliases: ['daily', 'claim', 'dailies'],
  description: '🎁 Claim your daily reward',
  category: 'economy',
  
  callback: async ({ client, sender }) => {
    const result = await EconomyEngine.daily(sender);
    
    if (result.success) {
      const lines = [
        `🎁 *✦ DAILY REWARD CLAIMED ✦* 🎁`,
        ``,
        `💰 Reward: ${formatCurrency(result.reward)}`,
        result.streak > 0 ? `🔥 Streak Bonus: ${result.streak}x multiplier!` : '',
        ``,
        `✨ Come back tomorrow for more!`,
        `💡 Keep streak for bigger rewards!`
      ].filter(Boolean);
      
      await client.sendMessage(sender, { text: createBorderedMessage(lines) });
    } else {
      const lines = [
        `⏰ *✦ DAILY REWARD ✦* ⏰`,
        ``,
        `⚠️ You already claimed today!`,
        ``,
        `🕐 Try again in *${result.remaining} hours*`
      ];
      
      await client.sendMessage(sender, { text: createBorderedMessage(lines) });
    }
  }
} satisfies CommandModule;