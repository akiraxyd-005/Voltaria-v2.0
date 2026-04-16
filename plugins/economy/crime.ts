import type { CommandModule } from '../../lib/types.js';
import { EconomyEngine } from '../../lib/economy.js';
import { formatCurrency, createBorderedMessage } from '../../config.js';

export default {
  aliases: ['crime', 'heist', 'steal'],
  description: '🔫 Commit a crime for quick money',
  category: 'economy',
  
  callback: async ({ client, sender }) => {
    const result = await EconomyEngine.crime(sender);
    
    if (result.success) {
      const lines = [
        `🔫 *✦ CRIME SUCCESSFUL ✦* 🔫`,
        ``,
        `🎯 Crime: ${result.crime}`,
        `💰 Loot: ${formatCurrency(result.earnings)}`,
        ``,
        `🏃‍♂️ You got away!`
      ];
      
      await client.sendMessage(sender, { text: createBorderedMessage(lines) });
    } else if (result.penalty) {
      const lines = [
        `🚔 *✦ CRIME FAILED ✦* 🚔`,
        ``,
        `🎯 Crime: ${result.crime}`,
        `💸 Penalty: ${formatCurrency(result.penalty)}`,
        ``,
        `👮‍♂️ You got caught!`
      ];
      
      await client.sendMessage(sender, { text: createBorderedMessage(lines) });
    } else {
      const lines = [
        `⏰ *✦ CRIME COOLDOWN ✦* ⏰`,
        ``,
        `⚠️ Wait before committing another crime!`,
        ``,
        `🕐 Available in *${result.remaining} seconds*`
      ];
      
      await client.sendMessage(sender, { text: createBorderedMessage(lines) });
    }
  }
} satisfies CommandModule;