const fs = require('fs');
const path = './database/economy.json';
const cooldowns = new Map();
const currencySymbol = '𝑵̶';

function getCardValue(card) {
    if (card === 'A') return 11;
    if (['K', 'Q', 'J', '10'].includes(card)) return 10;
    return parseInt(card);
}

function calculateHand(hand) {
    let sum = 0;
    let aces = 0;
    for (const card of hand) {
        if (card === 'A') aces++;
        sum += getCardValue(card);
    }
    while (sum > 21 && aces > 0) {
        sum -= 10;
        aces--;
    }
    return sum;
}

const suits = ['♠️', '♥️', '♦️', '♣️'];
const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

function drawCard() {
    const value = values[Math.floor(Math.random() * values.length)];
    const suit = suits[Math.floor(Math.random() * suits.length)];
    return value;
}

module.exports = {
    name: 'blackjack',
    aliases: ['bj'],
    category: 'economy',
    description: 'Play Blackjack against the dealer',
    usage: '§blackjack <amount>',
    async execute(sock, msg, args, extra) {
        const sender = extra.sender;
        const amount = parseInt(args[0]);
        
        if (cooldowns.has(sender) && Date.now() - cooldowns.get(sender) < 60000) {
            const remaining = Math.ceil((60000 - (Date.now() - cooldowns.get(sender))) / 1000);
            return extra.reply(`⏳ Slow down! Next game in ${remaining}s`);
        }
        
        if (!amount || isNaN(amount) || amount < 10) {
            return extra.reply(`❌ Enter a valid amount (minimum 10 ${currencySymbol})\n\nUsage: §blackjack 100`);
        }
        
        let economy = {};
        if (fs.existsSync(path)) economy = JSON.parse(fs.readFileSync(path));
        
        if (!economy[sender]) {
            economy[sender] = { balance: 1000, bank: 0 };
            fs.writeFileSync(path, JSON.stringify(economy, null, 2));
        }
        
        if (economy[sender].balance < amount) {
            return extra.reply(`❌ You don't have enough ${currencySymbol}!\n💰 Balance: ${economy[sender].balance.toLocaleString()} ${currencySymbol}`);
        }
        
        const playerHand = [drawCard(), drawCard()];
        const dealerHand = [drawCard(), drawCard()];
        
        let playerScore = calculateHand(playerHand);
        let dealerScore = calculateHand(dealerHand);
        
        const playerBlackjack = playerHand.includes('A') && playerHand.some(c => ['10', 'J', 'Q', 'K'].includes(c));
        const dealerBlackjack = dealerHand.includes('A') && dealerHand.some(c => ['10', 'J', 'Q', 'K'].includes(c));
        
        let winAmount = 0;
        let message = '';
        
        if (playerBlackjack && dealerBlackjack) {
            economy[sender].balance += amount;
            message = `🃏 *BLACKJACK*\n\n🎯 Your hand: ${playerHand.join(' ')} = 21\n🏠 Dealer: ${dealerHand.join(' ')} = 21\n\n🤝 PUSH! Bet returned.`;
        } else if (playerBlackjack) {
            winAmount = Math.floor(amount * 2.5);
            economy[sender].balance += winAmount;
            message = `🃏 *BLACKJACK*\n\n🎯 Your hand: ${playerHand.join(' ')} = 21\n🏠 Dealer: ${dealerHand.join(' ')} = ${dealerScore}\n\n🌟 BLACKJACK! 🌟\n💰 Won: ${winAmount.toLocaleString()} ${currencySymbol} (2.5x)`;
        } else if (dealerBlackjack) {
            economy[sender].balance -= amount;
            message = `🃏 *BLACKJACK*\n\n🎯 Your hand: ${playerHand.join(' ')} = ${playerScore}\n🏠 Dealer: ${dealerHand.join(' ')} = 21\n\n💀 DEALER BLACKJACK!\n💸 Lost: ${amount.toLocaleString()} ${currencySymbol}`;
        } else {
            while (dealerScore < 17) {
                const newCard = drawCard();
                dealerHand.push(newCard);
                dealerScore = calculateHand(dealerHand);
            }
            
            if (playerScore > 21) {
                economy[sender].balance -= amount;
                message = `🃏 *BLACKJACK*\n\n🎯 Your hand: ${playerHand.join(' ')} = ${playerScore}\n🏠 Dealer: ${dealerHand.join(' ')} = ${dealerScore}\n\n💀 BUST! You went over 21.\n💸 Lost: ${amount.toLocaleString()} ${currencySymbol}`;
            } else if (dealerScore > 21) {
                winAmount = Math.floor(amount * 1.8);
                economy[sender].balance += winAmount;
                message = `🃏 *BLACKJACK*\n\n🎯 Your hand: ${playerHand.join(' ')} = ${playerScore}\n🏠 Dealer: ${dealerHand.join(' ')} = ${dealerScore}\n\n🎉 DEALER BUSTS! You win!\n💰 Won: ${winAmount.toLocaleString()} ${currencySymbol} (1.8x)`;
            } else if (playerScore > dealerScore) {
                winAmount = Math.floor(amount * 1.8);
                economy[sender].balance += winAmount;
                message = `🃏 *BLACKJACK*\n\n🎯 Your hand: ${playerHand.join(' ')} = ${playerScore}\n🏠 Dealer: ${dealerHand.join(' ')} = ${dealerScore}\n\n✅ You win!\n💰 Won: ${winAmount.toLocaleString()} ${currencySymbol} (1.8x)`;
            } else if (dealerScore > playerScore) {
                economy[sender].balance -= amount;
                message = `🃏 *BLACKJACK*\n\n🎯 Your hand: ${playerHand.join(' ')} = ${playerScore}\n🏠 Dealer: ${dealerHand.join(' ')} = ${dealerScore}\n\n😫 Dealer wins!\n💸 Lost: ${amount.toLocaleString()} ${currencySymbol}`;
            } else {
                economy[sender].balance += amount;
                message = `🃏 *BLACKJACK*\n\n🎯 Your hand: ${playerHand.join(' ')} = ${playerScore}\n🏠 Dealer: ${dealerHand.join(' ')} = ${dealerScore}\n\n🤝 PUSH! Bet returned.`;
            }
        }
        
        fs.writeFileSync(path, JSON.stringify(economy, null, 2));
        cooldowns.set(sender, Date.now());
        
        message += `\n\n💰 Balance: ${economy[sender].balance.toLocaleString()} ${currencySymbol}\n\n> ©POWERED BY NEXUS`;
        await extra.reply(message);
    }
};