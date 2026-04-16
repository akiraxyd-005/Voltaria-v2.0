import { User, Group, ShopItem, MarketListing } from './database.js';
import { config, formatCurrency } from '../config.js';
import mongoose from 'mongoose';

export class EconomyEngine {
  
  // ============================================
  // USER MANAGEMENT
  // ============================================
  
  static async getUser(jid: string, name?: string, phoneNumber?: string) {
    let user = await User.findOne({ jid });
    if (!user) {
      user = await User.create({ 
        jid, 
        name: name || 'Unknown',
        phoneNumber: phoneNumber || jid.split('@')[0],
        wallet: config.defaultWallet,
        bank: config.defaultBank,
        bankCapacity: config.defaultBankCapacity
      });
    } else {
      // Update name if changed
      if (name && user.name === 'Unknown') {
        user.name = name;
        await user.save();
      }
    }
    return user;
  }
  
  static async getAllUsers() {
    return await User.find({});
  }
  
  static async getTotalUsers(): Promise<number> {
    return await User.countDocuments();
  }
  
  // ============================================
  // XP & LEVELING SYSTEM
  // ============================================
  
  static async addXP(jid: string, amount: number, name?: string, phoneNumber?: string) {
    const user = await this.getUser(jid, name, phoneNumber);
    const oldLevel = user.level;
    let leveledUp = false;
    let levelUpReward = 0;
    
    // Apply XP boosts
    let finalAmount = amount;
    const now = new Date();
    const xpBoost = user.activeBuffs.find(b => 
      b.type === 'xp_boost' && b.expiresAt > now
    );
    if (xpBoost) {
      finalAmount = Math.floor(amount * xpBoost.multiplier);
    }
    
    user.xp += finalAmount;
    user.totalXp += finalAmount;
    
    // Calculate required XP for current level
    const getRequiredXP = (level: number): number => {
      return Math.floor(config.levelBaseXp * Math.pow(config.levelMultiplier, level - 1));
    };
    
    let requiredXP = getRequiredXP(user.level);
    
    // Handle multiple level ups
    while (user.xp >= requiredXP) {
      user.xp -= requiredXP;
      user.level++;
      leveledUp = true;
      levelUpReward = 5000 * user.level;
      user.wallet += levelUpReward;
      user.totalEarned += levelUpReward;
      requiredXP = getRequiredXP(user.level);
    }
    
    await user.save();
    
    if (leveledUp) {
      return { 
        leveledUp: true, 
        newLevel: user.level, 
        reward: levelUpReward, 
        oldLevel 
      };
    }
    
    return { 
      leveledUp: false, 
      xp: user.xp, 
      xpNeeded: requiredXP, 
      level: user.level,
      progress: (user.xp / requiredXP) * 100
    };
  }
  
  static async getLevelInfo(level: number): number {
    return Math.floor(config.levelBaseXp * Math.pow(config.levelMultiplier, level - 1));
  }
  
  // ============================================
  // DAILY & WEEKLY REWARDS
  // ============================================
  
  static async daily(jid: string, name?: string, phoneNumber?: string) {
    const user = await this.getUser(jid, name, phoneNumber);
    const now = new Date();
    
    if (user.lastDaily) {
      const hoursSince = (now.getTime() - user.lastDaily.getTime()) / 3600000;
      if (hoursSince < 24) {
        const remaining = 24 - hoursSince;
        return { success: false, remaining: Math.ceil(remaining) };
      }
    }
    
    let reward = config.dailyReward;
    let streak = 0;
    
    // Check for streak
    const lastDailyDate = user.lastDaily ? new Date(user.lastDaily) : null;
    if (lastDailyDate) {
      const dayDiff = Math.floor((now.getTime() - lastDailyDate.getTime()) / 86400000);
      if (dayDiff === 1) {
        streak = 1;
        reward = Math.floor(reward * 1.1);
      }
    }
    
    // VIP bonus
    if (user.vip.active) {
      const bonus = user.vip.tier === 'gold' ? 2 : user.vip.tier === 'silver' ? 1.5 : 1.2;
      reward = Math.floor(reward * bonus);
    }
    
    user.wallet += reward;
    user.totalEarned += reward;
    user.lastDaily = now;
    await user.save();
    
    return { success: true, reward, streak };
  }
  
  static async weekly(jid: string, name?: string, phoneNumber?: string) {
    const user = await this.getUser(jid, name, phoneNumber);
    const now = new Date();
    
    if (user.lastWeekly) {
      const daysSince = (now.getTime() - user.lastWeekly.getTime()) / 86400000;
      if (daysSince < 7) {
        const remaining = 7 - daysSince;
        return { success: false, remaining: Math.ceil(remaining) };
      }
    }
    
    let reward = config.weeklyReward;
    
    // VIP bonus
    if (user.vip.active) {
      const bonus = user.vip.tier === 'gold' ? 2 : user.vip.tier === 'silver' ? 1.5 : 1.2;
      reward = Math.floor(reward * bonus);
    }
    
    user.wallet += reward;
    user.totalEarned += reward;
    user.lastWeekly = now;
    await user.save();
    
    return { success: true, reward };
  }
  
  // ============================================
  // WORK SYSTEM
  // ============================================
  
  static async work(jid: string, name?: string, phoneNumber?: string) {
    const user = await this.getUser(jid, name, phoneNumber);
    const now = new Date();
    
    if (user.lastWork) {
      const minutesSince = (now.getTime() - user.lastWork.getTime()) / 60000;
      if (minutesSince < 5) {
        const remaining = 5 - minutesSince;
        return { success: false, remaining: Math.ceil(remaining) };
      }
    }
    
    const jobs = [
      { name: '💻 Programmer', min: 5000, max: 15000, emoji: '💻' },
      { name: '🚗 Uber Driver', min: 3000, max: 10000, emoji: '🚗' },
      { name: '🍕 Pizza Delivery', min: 2000, max: 8000, emoji: '🍕' },
      { name: '📚 Teacher', min: 4000, max: 12000, emoji: '📚' },
      { name: '🏥 Doctor', min: 8000, max: 20000, emoji: '🏥' },
      { name: '🎨 Artist', min: 3000, max: 15000, emoji: '🎨' },
      { name: '🔧 Mechanic', min: 3500, max: 11000, emoji: '🔧' },
      { name: '💪 Gym Trainer', min: 4000, max: 10000, emoji: '💪' },
      { name: '🎵 Musician', min: 5000, max: 18000, emoji: '🎵' },
      { name: '📝 Writer', min: 3000, max: 12000, emoji: '📝' },
      { name: '🛒 Cashier', min: 2500, max: 7000, emoji: '🛒' },
      { name: '📦 Warehouse', min: 3000, max: 9000, emoji: '📦' }
    ];
    
    const job = jobs[Math.floor(Math.random() * jobs.length)];
    const earnings = Math.floor(Math.random() * (job.max - job.min + 1) + job.min);
    
    user.wallet += earnings;
    user.totalEarned += earnings;
    user.workCompleted++;
    user.lastWork = now;
    await user.save();
    
    return { success: true, job: job.name, earnings, emoji: job.emoji };
  }
  
  // ============================================
  // CRIME SYSTEM
  // ============================================
  
  static async crime(jid: string, name?: string, phoneNumber?: string) {
    const user = await this.getUser(jid, name, phoneNumber);
    const now = new Date();
    
    if (user.lastCrime) {
      const secondsSince = (now.getTime() - user.lastCrime.getTime()) / 1000;
      if (secondsSince < 60) {
        const remaining = 60 - secondsSince;
        return { success: false, remaining: Math.ceil(remaining) };
      }
    }
    
    const crimes = [
      { name: '🏦 Bank Heist', min: 10000, max: 50000, failPenalty: 15000, rate: 0.4 },
      { name: '💰 Pickpocket', min: 1000, max: 5000, failPenalty: 2000, rate: 0.7 },
      { name: '💎 Jewelry Store', min: 8000, max: 30000, failPenalty: 10000, rate: 0.5 },
      { name: '🚗 Car Theft', min: 5000, max: 20000, failPenalty: 8000, rate: 0.55 },
      { name: '🏪 Convenience Store', min: 2000, max: 8000, failPenalty: 300