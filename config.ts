import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

export const config = {
  // Bot Info
  botName: process.env.BOT_NAME || '✦⚡ Voltaria Nexus ⚡✦',
  botPrefix: process.env.BOT_PREFIX || '!',
  ownerNumber: process.env.OWNER_NUMBER || '254108720384',
  ownerName: process.env.OWNER_NAME || '⚜️𝓐𝓻𝓪𝓼𝓱𝓲⚜️',
  
  // Currency
  currency: {
    name: 'V-Coin',
    symbol: '¢',
    icon: '🪙',
    fullSymbol: '¢ V-Coin'
  },
  
  // Database
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/voltaria',
  
  // API Keys
  openaiApiKey: process.env.OPENAI_API_KEY || '',
  weatherApiKey: process.env.WEATHER_API_KEY || '',
  youtubeApiKey: process.env.YOUTUBE_API_KEY || '',
  geniusAccessToken: process.env.GENIUS_ACCESS_TOKEN || '',
  
  // Economy Defaults
  defaultWallet: parseInt(process.env.DEFAULT_WALLET || '50000'),
  defaultBank: parseInt(process.env.DEFAULT_BANK || '0'),
  defaultBankCapacity: parseInt(process.env.DEFAULT_BANK_CAPACITY || '200000'),
  
  // Rewards
  dailyReward: parseInt(process.env.DAILY_REWARD || '10000'),
  weeklyReward: parseInt(process.env.WEEKLY_REWARD || '50000'),
  workMin: 2000,
  workMax: 8000,
  crimeMin: 1000,
  crimeMax: 15000,
  crimeFailPenalty: 3000,
  crimeSuccessRate: 0.65,
  
  // Leveling
  levelBaseXp: 100,
  levelMultiplier: 1.5,
  xpPerMessage: { min: 10, max: 25 },
  
  // Cooldowns (milliseconds)
  cooldowns: {
    daily: 86400000,      // 24 hours
    weekly: 604800000,    // 7 days
    work: 300000,         // 5 minutes
    crime: 60000,         // 1 minute
    rob: 3600000,         // 1 hour
    gamble: 5000,         // 5 seconds
    slots: 5000,          // 5 seconds
    dice: 3000,           // 3 seconds
    ai: 10000,            // 10 seconds
    confess: 60000,       // 1 minute
    transfer: 60000,      // 1 minute
    shop: 5000            // 5 seconds
  },
  
  // Shop Items
  shopItems: {
    'xp_boost': { 
      price: 50000, 
      description: '2x XP for 1 hour', 
      type: 'boost', 
      duration: 3600000, 
      emoji: '⚡',
      value: 2
    },
    'bank_upgrade': { 
      price: 100000, 
      description: '+100k bank capacity', 
      type: 'upgrade', 
      value: 100000, 
      emoji: '🏦',
      permanent: true
    },
    'lucky_charm': { 
      price: 75000, 
      description: '+10% gambling luck', 
      type: 'permanent', 
      value: 0.1, 
      emoji: '🍀',
      permanent: true
    },
    'stealth_gloves': { 
      price: 50000, 
      description: '+15% rob success rate', 
      type: 'permanent', 
      value: 0.15, 
      emoji: '🥷',
      permanent: true
    },
    'vip_membership': { 
      price: 500000, 
      description: 'VIP benefits for 30 days', 
      type: 'vip', 
      duration: 2592000000, 
      emoji: '👑',
      value: 'silver'
    },
    'gold_role': { 
      price: 1000000, 
      description: 'Gold role + special perks', 
      type: 'role', 
      duration: 864000000, 
      emoji: '⭐',
      value: 'gold'
    },
    'lottery_ticket': { 
      price: 1000, 
      description: 'Lottery entry', 
      type: 'lottery', 
      value: 1, 
      emoji: '🎫',
      duration: 604800000
    },
    'bank_insurance': { 
      price: 25000, 
      description: 'Protects 50% bank from rob', 
      type: 'insurance', 
      duration: 86400000, 
      emoji: '🛡️',
      value: 0.5
    }
  },
  
  // Gambling Settings
  gambling: {
    slotsMultipliers: [0, 0.5, 1, 2, 5, 10],
    slotsSymbols: ['🍒', '🍋', '🍊', '🍉', '⭐', '💎', '7️⃣', '🎰'],
    blackjackBaseReward: 1.5,
    diceMaxBet: 1000000,
    coinflipMinBet: 100,
    coinflipMaxBet: 1000000,
    slotsMinBet: 100,
    slotsMaxBet: 100000
  },
  
  // Borders
  borders: {
    top: '╔══════════════════════════════════════════════════════════╗',
    bottom: '╚══════════════════════════════════════════════════════════╝',
    divider: '╠══════════════════════════════════════════════════════════╣',
    line: '║'
  },
  
  // Session
  sessionName: 'voltaria-session'
};

// Format currency with emoji
export function formatCurrency(amount: number): string {
  const formatted = amount.toLocaleString();
  return `${config.currency.icon} ${formatted} ${config.currency.symbol}`;
}

// Format number with commas
export function formatNumber(num: number): string {
  return num.toLocaleString();
}

// Create bordered message
export function createBorderedMessage(lines: string[]): string {
  const border = config.borders;
  const maxLength = Math.max(...lines.map(l => {
    // Remove ANSI color codes and emojis for length calculation
    const clean = l.replace(/\x1b\[\d+m/g, '').replace(/[^\x00-\x7F]/g, '  ');
    return clean.length;
  })) + 2;
  
  const topBorder = '╔' + '═'.repeat(maxLength) + '╗';
  const bottomBorder = '╚' + '═'.repeat(maxLength) + '╝';
  
  const borderedLines = lines.map(line => {
    const cleanLength = line.replace(/\x1b\[\d+m/g, '').replace(/[^\x00-\x7F]/g, '  ').length;
    const padding = maxLength - cleanLength;
    return `║ ${line}${' '.repeat(padding)} ║`;
  });
  
  return [topBorder, ...borderedLines, bottomBorder].join('\n');
}

// Create progress bar
export function createProgressBar(current: number, max: number, length: number = 20): string {
  const percentage = Math.min(100, (current / max) * 100);
  const filled = Math.floor((percentage / 100) * length);
  const empty = length - filled;
  return '█'.repeat(filled) + '░'.repeat(empty);
}

// Connect to MongoDB
export async function connectDB() {
  try {
    await mongoose.connect(config.mongoUri);
    console.log('✅ MongoDB Connected Successfully');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error);
    process.exit(1);
  }
}

// Get time remaining string
export function getTimeRemaining(timestamp: Date, cooldownMs: number): string {
  const now = new Date();
  const elapsed = now.getTime() - timestamp.getTime();
  const remaining = cooldownMs - elapsed;
  
  if (remaining <= 0) return 'Ready!';
  
  const hours = Math.floor(remaining / 3600000);
  const minutes = Math.floor((remaining % 3600000) / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000);
  
  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m ${seconds}s`;
  return `${seconds}s`;
}