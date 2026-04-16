import type { CommandModule } from '../../lib/types.js';
import { EconomyEngine } from '../../lib/economy.js';
import { formatCurrency, createBorderedMessage } from '../../config.js';

export default {
  aliases: ['leaderboard', 'lb', 'top'],
  description: '🏆 Top players',
  category: 'economy',
  
  callback: async ({ client, sender }) => {
    const users = await EconomyEngine.getLeaderboard(10);
    
    const lines = [
      `🏆 *Richest Users* 🏆`,
      ``,
      ...users.map((user, i) => {
        const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : '📌';
        return `${medal} #${i+1} *${user.name}* - ${formatCurrency(user.wallet)}`;
      }),
      ``,
      `✨ Use !work and !daily to earn!`
    ];
    
    await client.sendMessage(sender, { text: createBorderedMessage(lines) });
  }
} satisfies CommandModule;