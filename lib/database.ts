import mongoose from 'mongoose';

// ============================================
// USER SCHEMA
// ============================================
const UserSchema = new mongoose.Schema({
  // Basic Info
  jid: { type: String, unique: true, required: true, index: true },
  name: { type: String, default: 'Unknown' },
  phoneNumber: { type: String, default: '' },
  
  // Economy
  wallet: { type: Number, default: 50000 },
  bank: { type: Number, default: 0 },
  bankCapacity: { type: Number, default: 200000 },
  
  // Leveling
  level: { type: Number, default: 1, index: true },
  xp: { type: Number, default: 0 },
  totalXp: { type: Number, default: 0 },
  
  // Statistics
  messages: { type: Number, default: 0 },
  commandsUsed: { type: Number, default: 0 },
  workCompleted: { type: Number, default: 0 },
  crimesCommitted: { type: Number, default: 0 },
  crimesSuccess: { type: Number, default: 0 },
  robSuccess: { type: Number, default: 0 },
  robFailed: { type: Number, default: 0 },
  gambleWins: { type: Number, default: 0 },
  gambleLosses: { type: Number, default: 0 },
  totalGambled: { type: Number, default: 0 },
  totalEarned: { type: Number, default: 0 },
  totalSpent: { type: Number, default: 0 },
  
  // Inventory
  inventory: [{
    itemId: { type: String, required: true },
    name: { type: String, required: true },
    quantity: { type: Number, default: 1 },
    acquiredAt: { type: Date, default: Date.now },
    expiresAt: { type: Date },
    used: { type: Boolean, default: false }
  }],
  
  // Active Buffs
  activeBuffs: [{
    type: { type: String, required: true },
    multiplier: { type: Number, default: 1 },
    expiresAt: { type: Date, required: true }
  }],
  
  // Permanent Upgrades
  upgrades: {
    xpBoost: { type: Boolean, default: false },
    luckyCharm: { type: Boolean, default: false },
    stealthGloves: { type: Boolean, default: false },
    bankUpgrades: { type: Number, default: 0 }
  },
  
  // VIP Status
  vip: {
    active: { type: Boolean, default: false },
    expiresAt: { type: Date },
    tier: { type: String, enum: ['none', 'silver', 'gold', 'platinum'], default: 'none' }
  },
  
  // Achievements
  achievements: [{
    id: { type: String, required: true },
    name: { type: String, required: true },
    unlockedAt: { type: Date, default: Date.now }
  }],
  
  // Cooldown Timestamps
  lastDaily: { type: Date },
  lastWeekly: { type: Date },
  lastWork: { type: Date },
  lastCrime: { type: Date },
  lastRob: { type: Date },
  lastGamble: { type: Date },
  lastSlots: { type: Date },
  lastDice: { type: Date },
  lastMessage: { type: Date },
  lastConfess: { type: Date },
  lastTransfer: { type: Date },
  lastShop: { type: Date },
  lastAI: { type: Date },
  
  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// Indexes for faster queries
UserSchema.index({ wallet: -1 });
UserSchema.index({ level: -1, totalXp: -1 });
UserSchema.index({ workCompleted: -1 });
UserSchema.index({ robSuccess: -1 });

// ============================================
// GROUP SCHEMA
// ============================================
const GroupSchema = new mongoose.Schema({
  jid: { type: String, unique: true, required: true, index: true },
  name: { type: String, default: '' },
  description: { type: String, default: '' },
  owner: { type: String, default: '' },
  admins: [{ type: String }],
  members: [{ type: String }],
  memberCount: { type: Number, default: 0 },
  
  // Moderation Settings
  welcomeEnabled: { type: Boolean, default: false },
  welcomeMessage: { type: String, default: '🎉 Welcome {name} to {group}! 🎉' },
  goodbyeEnabled: { type: Boolean, default: false },
  goodbyeMessage: { type: String, default: '👋 {name} left the group!' },
  antiLink: { type: Boolean, default: false },
  antiSpam: { type: Boolean, default: false },
  antiRaid: { type: Boolean, default: false },
  antiToxic: { type: Boolean, default: false },
  muted: { type: Boolean, default: false },
  nsfw: { type: Boolean, default: false },
  levelingEnabled: { type: Boolean, default: true },
  
  // Banned Users
  bannedUsers: [{
    jid: { type: String, required: true },
    reason: { type: String, default: 'No reason provided' },
    bannedAt: { type: Date, default: Date.now },
    bannedBy: { type: String }
  }],
  
  // Warnings
  warnings: [{
    jid: { type: String, required: true },
    reason: { type: String, default: 'No reason provided' },
    warnedAt: { type: Date, default: Date.now },
    warnedBy: { type: String }
  }],
  
  // Economy Settings
  groupBank: { type: Number, default: 0 },
  groupLevel: { type: Number, default: 1 },
  groupXp: { type: Number, default: 0 },
  
  // Settings
  settings: {
    onlyAdmins: { type: Boolean, default: false },
    onlyOwner: { type: Boolean, default: false },
    botMuted: { type: Boolean, default: false }
  },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// ============================================
// SHOP ITEM SCHEMA
// ============================================
const ShopItemSchema = new mongoose.Schema({
  itemId: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  type: { type: String, enum: ['boost', 'upgrade', 'permanent', 'vip', 'role', 'lottery', 'insurance'], required: true },
  value: { type: mongoose.Schema.Types.Mixed },
  duration: { type: Number },
  emoji: { type: String, default: '📦' },
  stock: { type: Number, default: -1 },
  limited: { type: Boolean, default: false },
  role: { type: String },
  requiresLevel: { type: Number, default: 1 }
});

// ============================================
// MARKET LISTING SCHEMA
// ============================================
const MarketListingSchema = new mongoose.Schema({
  listingId: { type: String, unique: true, required: true },
  sellerJid: { type: String, required: true, index: true },
  sellerName: { type: String, required: true },
  itemId: { type: String, required: true },
  itemName: { type: String, required: true },
  quantity: { type: Number, default: 1 },
  price: { type: Number, required: true },
  listedAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true }
});

// ============================================
// CONFESSION SCHEMA
// ============================================
const ConfessionSchema = new mongoose.Schema({
  confessionId: { type: String, unique: true, required: true },
  message: { type: String, required: true },
  groupJid: { type: String, required: true, index: true },
  senderJid: { type: String },
  timestamp: { type: Date, default: Date.now },
  anonymous: { type: Boolean, default: true }
});

// ============================================
// LOTTERY SCHEMA
// ============================================
const LotteryTicketSchema = new mongoose.Schema({
  ticketId: { type: String, unique: true, required: true },
  round: { type: Number, required: true, index: true },
  ticketNumber: { type: String, required: true },
  buyerJid: { type: String, required: true, index: true },
  buyerName: { type: String, required: true },
  purchasedAt: { type: Date, default: Date.now },
  isWinner: { type: Boolean, default: false },
  prizeAmount: { type: Number, default: 0 }
});

const LotteryRoundSchema = new mongoose.Schema({
  round: { type: Number, unique: true, required: true },
  startTime: { type: Date, default: Date.now },
  endTime: { type: Date, required: true },
  totalTickets: { type: Number, default: 0 },
  prizePool: { type: Number, default: 0 },
  winnerJid: { type: String },
  winnerName: { type: String },
  winningTicket: { type: String },
  isCompleted: { type: Boolean, default: false }
});

// ============================================
// BLACKLIST SCHEMA
// ============================================
const BlacklistSchema = new mongoose.Schema({
  jid: { type: String, unique: true, required: true },
  reason: { type: String, required: true },
  blacklistedAt: { type: Date, default: Date.now },
  blacklistedBy: { type: String, required: true }
});

// ============================================
// EXPORT MODELS
// ============================================
export const User = mongoose.model('User', UserSchema);
export const Group = mongoose.model('Group', GroupSchema);
export const ShopItem = mongoose.model('ShopItem', ShopItemSchema);
export const MarketListing = mongoose.model('MarketListing', MarketListingSchema);
export const Confession = mongoose.model('Confession', ConfessionSchema);
export const LotteryTicket = mongoose.model('LotteryTicket', LotteryTicketSchema);
export const LotteryRound = mongoose.model('LotteryRound', LotteryRoundSchema);
export const Blacklist = mongoose.model('Blacklist', BlacklistSchema);