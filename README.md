# ✦⚡ VOLTARIA NEXUS ⚡✦
### *A Powerful WhatsApp Bot with Economy, Games & Moderation*

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Node](https://img.shields.io/badge/node-%3E%3D20.0-green)
![WhatsApp](https://img.shields.io/badge/WhatsApp-Multi--Device-brightgreen)
![License](https://img.shields.io/badge/license-MIT-yellow)

---

## 🌟 Features

### 💰 **Economy System**
- Complete virtual currency system (V-Coins ¢)
- Daily & Weekly rewards with streak bonuses
- Work & Crime commands for earning
- Bank system with interest and capacity upgrades
- Shop with permanent items, boosts, and VIP membership
- Transfer money between users
- Rob other users with chance-based system
- Leaderboard rankings (wealth, level, work, robberies)

### 🎮 **Gambling & Games**
- Coinflip (50/50 chance to double your bet)
- Slot machine with multiple winning combinations
- Blackjack card game
- Dice rolling game
- Tic Tac Toe vs AI
- Rock Paper Scissors
- Number guessing game
- Trivia quiz

### ⭐ **Leveling System**
- Earn XP for every message
- Level up rewards
- XP boosts from shop items
- Custom level progression formula
- Profile with detailed stats

### 👥 **Group Moderation**
- Welcome & Goodbye messages with custom images
- Anti-link protection (blocks WhatsApp, Telegram, Discord, Instagram links)
- Anti-spam system (auto-warns spammers)
- Anti-raid protection
- Warn & Kick system
- Group mute/unmute
- Group settings persistence

### 🤖 **AI Integration**
- OpenAI GPT-powered chat
- Context-aware conversations
- Multiple AI personalities
- Configurable model selection

### 🎨 **Media & Fun**
- Sticker creator (images & videos)
- Media downloader (YouTube, Instagram, TikTok, Twitter)
- Anonymous confession system
- Random inspirational quotes
- Anime image generator (100+ categories)
- Weather forecast
- Calculator & Unit converter
- Text translator (100+ languages)

### 👑 **Owner Controls**
- Economy management (add/remove money)
- User data management
- Broadcast messages to all groups
- Bot statistics monitoring
- Database backup & restore
- Remote restart capability

---

## 📋 Command List

### 💰 **Economy Commands**
| Command | Aliases | Description |
|---------|---------|-------------|
| `!profile` | `!me`, `!stats` | View your detailed profile |
| `!daily` | `!claim` | Claim daily reward |
| `!weekly` | `!week` | Claim weekly reward |
| `!work` | `!job` | Work to earn money |
| `!crime` | `!heist` | Commit a crime |
| `!rob @user` | `!mug` | Rob another user |
| `!transfer @user <amount>` | `!pay`, `!send` | Send money to user |
| `!bank` | - | Check bank balance |
| `!deposit <amount>` | `!dep` | Deposit money to bank |
| `!withdraw <amount>` | `!with` | Withdraw from bank |
| `!shop` | `!store` | View shop items |
| `!buy <item>` | `!purchase` | Buy items from shop |
| `!inventory` | `!inv` | View your items |
| `!leaderboard` | `!lb`, `!top` | View rankings |

### 🎰 **Gambling Commands**
| Command | Aliases | Description |
|---------|---------|-------------|
| `!coinflip <heads/tails> <amount>` | `!cf` | 50/50 chance game |
| `!slots <amount>` | `!slot` | Slot machine |
| `!dice <amount>` | `!roll` | Dice rolling game |
| `!blackjack <amount>` | `!bj` | Play blackjack |

### 🎮 **Game Commands**
| Command | Aliases | Description |
|---------|---------|-------------|
| `!game ttt` | - | Tic Tac Toe vs AI |
| `!game rps <choice>` | - | Rock Paper Scissors |
| `!game number` | - | Guess the number |
| `!game quiz` | - | Trivia quiz |
| `!game memory` | - | Memory card game |

### 🛡️ **Moderation Commands**
| Command | Aliases | Description |
|---------|---------|-------------|
| `!group welcome on/off` | - | Toggle welcome messages |
| `!group antilink on/off` | - | Block links in group |
| `!group antispam on/off` | - | Enable spam protection |
| `!group antiraid on/off` | - | Enable raid protection |
| `!group mute on/off` | - | Mute entire group |
| `!kick @user` | `!remove` | Kick member from group |
| `!warn @user` | - | Warn a member |
| `!warns @user` | - | Check member warnings |
| `!resetwarns @user` | - | Reset member warnings |

### 🤖 **AI & Fun Commands**
| Command | Aliases | Description |
|---------|---------|-------------|
| `!ai <question>` | `!ask`, `!chat` | Chat with AI |
| `!confess <message>` | `!anonymous` | Anonymous confession |
| `!quote` | `!inspire` | Random inspirational quote |
| `!meme` | `!memes` | Random meme |
| `!anime <category>` | `!waifu` | Random anime image |

### 🔧 **Utility Commands**
| Command | Aliases | Description |
|---------|---------|-------------|
| `!sticker` | `!s` | Create sticker from image/video |
| `!dl audio <url>` | - | Download audio |
| `!dl video <url>` | - | Download video |
| `!dl ig <url>` | - | Download Instagram |
| `!dl tiktok <url>` | - | Download TikTok (no watermark) |
| `!weather <city>` | `!temp` | Weather forecast |
| `!calc <expression>` | `!math` | Calculator |
| `!translate <lang> <text>` | `!tr` | Text translator |
| `!ping` | `!latency` | Check bot response time |
| `!info` | `!botinfo` | Bot information |
| `!help` | `!commands`, `!menu` | Show all commands |

---

## 🚀 Installation

### Prerequisites
- Node.js 20.0 or higher
- MongoDB Atlas account (free tier works)
- WhatsApp account
- Git

### Step 1: Clone Repository
```bash
git clone https://github.com/yourusername/voltaria-nexus.git
cd voltaria-nexus

voltaria-nexus/
├── 📄 index.ts                 # Main entry point
├── 📄 config.ts                # Configuration management
├── 📄 package.json             # Dependencies
├── 📄 tsconfig.json            # TypeScript config
├── 📄 .env                     # Environment variables
├── 📁 plugins/                 # Command modules (62+ files)
│   ├── 📁 economy/             # Economy system commands
│   │   ├── profile.ts
│   │   ├── daily.ts
│   │   ├── weekly.ts
│   │   ├── work.ts
│   │   ├── crime.ts
│   │   ├── rob.ts
│   │   ├── transfer.ts
│   │   ├── bank.ts
│   │   ├── shop.ts
│   │   ├── buy.ts
│   │   ├── inventory.ts
│   │   └── leaderboard.ts
│   ├── 📄 ai.ts                # AI chat commands
│   ├── 📄 confess.ts           # Anonymous confession
│   ├── 📄 games.ts             # Interactive games
│   ├── 📄 group.ts             # Group moderation
│   ├── 📄 downloader.ts        # Media downloaders
│   ├── 📄 sticker.ts           # Sticker creator
│   ├── 📄 anime.ts             # Anime images
│   ├── 📄 weather.ts           # Weather forecast
│   ├── 📄 calculator.ts        # Calculator
│   ├── 📄 translate.ts         # Translator
│   ├── 📄 quote.ts             # Inspirational quotes
│   ├── 📄 meme.ts              # Random memes
│   ├── 📄 info.ts              # Bot information
│   ├── 📄 help.ts              # Help menu
│   ├── 📄 ping.ts              # Latency check
│   └── 📄 owner.ts             # Owner commands
├── 📁 lib/                     # Core libraries
│   ├── 📄 database.ts          # MongoDB models
│   ├── 📄 economy.ts           # Economy engine
│   ├── 📄 groupMeta.ts         # Group metadata
│   ├── 📄 antiRaid.ts          # Anti-raid protection
│   ├── 📄 antiSpam.ts          # Anti-spam system
│   ├── 📄 antiLink.ts          # Anti-link protection
│   ├── 📄 welcomeHandler.ts    # Welcome/goodbye cards
│   ├── 📄 cooldown.ts          # Command cooldowns
│   ├── 📄 logger.ts            # Logging system
│   ├── 📄 utils.ts             # Utility functions
│   └── 📄 types.ts             # TypeScript interfaces
├── 📁 data/                    # Data utilities
├── 📁 store/                   # Runtime data storage
├── 📁 session/                 # WhatsApp auth credentials
└── 📁 tmp/                     # Temporary media files

Step 2: Install Dependencies

```bash
npm install
```

Step 3: Configure Environment

Create a .env file in the root directory:

```env
# Required
MONGODB_URI=mongodb+srv://username:password@cluster.xxxxx.mongodb.net/voltaria
OWNER_NUMBER=xxxxxxxxxxx
OWNER_NAME=⚜️𝓐𝓻𝓪𝓼𝓱𝓲⚜️

# Optional (for AI features)
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Optional (for weather)
WEATHER_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Optional (for media download)
YOUTUBE_API_KEY=AIzaSyxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

Step 4: Build & Run

```bash
# Development mode
npm run dev

# Production build
npm run build
npm start

# Using PM2 (recommended for production)
npm run pm2:start
npm run pm2:logs
```

Step 5: Connect WhatsApp

1. Run the bot
2. QR code will appear in terminal
3. Open WhatsApp on your phone
4. Go to Settings → Linked Devices → Link a Device
5. Scan the QR code
6. Wait for "Bot Connected Successfully" message

