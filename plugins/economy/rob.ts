import type { CommandModule } from '../../lib/types.js';
import { EconomyEngine } from '../../lib/economy.js';
import { formatCurrency, createBorderedMessage } from '../../config.js';

export default {
  aliases: ['rob', 'mug', 'thief'],
  description: '🏴‍☠️ Rob another user',
  category: 'economy',
  minArgs: 1,
  usage: '@user',
  example: '@254123456789',
  
  callback: async ({ client, sender, args }) => {
    const victim = args[0]?.replace('@', '');
    
    if (!victim || victim === sender) {
      const lines = [
        `🏴‍☠️ *✦ ROBBERY GUIDE ✦* 🏴‍☠️`,
        ``,
        `📝 Usage: !rob @user`,
        `💡 Example: !rob @254123456789`,
        ``,
        `⚠️ 35% base success rate`,
        `💪 Stealth Gloves: +15% success`,
        `👑 VIP: -10% chance to be robbed`
      ];
      await client.sendMessage(sender, { text: createBorderedMessage(lines) });
      return;
    }
    
    const result = await EconomyEngine.rob(sender, victim);
    
    if (result.success) {
      const lines = [
        `🏴‍☠️ *✦ ROBBERY SUCCESSFUL ✦* 🏴‍☠️`,
        ``,
        `💰 Stolen: ${formatCurrency(result.stolen)}`,
        `👤 From: ${result.victim}`,
        ``,
        `🏃‍♂️ You got away clean!`
      ];
      await client.sendMessage(sender, { text: createBorderedMessage(lines) });
    } else if (result.penalty) {
      const lines = [
        `🚨 *✦ ROBBERY FAILED ✦* 🚨`,
        ``,
        `💸 Penalty: ${formatCurrency(result.penalty)}`,
        `👮 Victim: ${result.victim}`,
        ``,
        `😵 You got caught!`
      ];
      await client.sendMessage(sender, { text: createBorderedMessage(lines) });
    } else {
      const lines = [
        `⏰ *✦ ROBBERY COOLDOWN ✦* ⏰`,
        ``,
        `⚠️ ${result.message}`
      ];
      await client.sendMessage(sender, { text: createBorderedMessage(lines) });
    }
  }
} satisfies CommandModule;