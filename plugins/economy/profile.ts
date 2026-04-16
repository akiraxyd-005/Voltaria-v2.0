import type { CommandModule } from '../../lib/types.js';
import { EconomyEngine } from '../../lib/economy.js';
import { formatCurrency, createBorderedMessage, createProgressBar } from '../../config.js';

export default {
  aliases: ['profile', 'me', 'stats', 'my'],
  description: '📊 View your detailed profile and statistics',
  category: 'economy',
  
  callback: async ({ client, sender }) => {
    const profile = await EconomyEngine.getProfile(sender);
    
    const progressBar = createProgressBar(profile.xp, profile.xpNeeded, 20);
    
    const lines = [
      `🌟 *✦ ${profile.name}'s Profile ✦* 🌟`,
      ``,
      `📊 *LEVEL & XP*`,
      `⭐ Level: ${profile.level}`,
      `✨ XP: ${profile.xp.toLocaleString()} / ${profile.xpNeeded.toLocaleString()}`,
      `📈 Progress: ${progressBar} ${profile.progress}%`,
      ``,
      `💰 *BALANCE*`,
      `👛 Wallet: ${formatCurrency(profile.wallet)}`,
      `🏦 Bank: ${formatCurrency(profile.bank)} / ${formatCurrency(profile.bankCapacity)}`,
      ``,
      `📈 *STATISTICS*`,
      `💬 Messages: ${profile.totalMessages.toLocaleString()}`,
      `⚡ Commands: ${profile.commandsUsed.toLocaleString()}`,
      `🔨 Work: ${profile.workCompleted.toLocaleString()}`,
      `🔫 Crimes: ${profile.crimesSuccess}/${profile.crimesCommitted}`,
      `🏴‍☠️ Robs: ${profile.robSuccess}/${profile.robFailed}`,
      `🎰 Gambling: ${profile.gambleWins}W/${profile.gambleLosses}L`,
      `💰 Total Earned: ${formatCurrency(profile.totalEarned)}`,
      `💸 Total Spent: ${formatCurrency(profile.totalSpent)}`,
      ``,
      `👑 *VIP*: ${profile.vip}`,
      `🏆 Achievements: ${profile.achievements}`,
      `📦 Inventory: ${profile.inventory} items`,
      `⚡ Active Buffs: ${profile.activeBuffs}`,
      ``,
      `✨ *Creator:* ⚜️𝓐𝓻𝓪𝓼𝓱𝓲⚜️`
    ];
    
    await client.sendMessage(sender, { text: createBorderedMessage(lines) });
  }
} satisfies CommandModule;