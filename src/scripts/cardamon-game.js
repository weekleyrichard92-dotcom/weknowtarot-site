// Cardamon French Tarot Game
console.log("Cardamon game script loaded");

// Game state
let selectedOpponents = [];
let selectedDeck = '';
let gameState = {
  players: [],
  deck: [],
  hands: [[], [], [], []],
  dog: [],
  currentTrick: [],
  trickLeader: 0,
  currentPlayer: 0,
  bids: [],
  declarer: -1,
  declarerBid: '',
  tricksWon: [0, 0, 0, 0],
  scores: [0, 0, 0, 0],
  trumpBroken: false,
  trickPoints: [0, 0, 0, 0]
};

// Available opponent avatars
const AVATARS = {
// Cardamon Tarot Game - French Tarot trick-taking game
// Based on the import4.py Python implementation

let selectedDeck = '';
let selectedOpponents = [];
let gameState = null;

const AVATAR_NAMES = {
  'hippie': 'Hippie',
  'lady': 'Lady',
  'lady_book': 'Lady Book',
  'moses': 'Moses',
  'old_man': 'Old Man'
};

// Toggle opponent selection
window.toggleOpponent = function(avatar, name) {
  const index = selectedOpponents.findIndex(o => o.avatar === avatar);
// Card ranks and values
const SUITS = ['swords', 'pent', 'cups', 'wands'];
const SUIT_NAMES = {
  'swords': 'Swords',
  'pent': 'Pentacles',
  'cups': 'Cups',
  'wands': 'Wands'
};

const RANKS = {
  suits: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', 'page', 'knight', 'queen', 'king'],
  trumps: ['0Fool', '1Magician', '2High_Priestess', '3Empress', '4Emperor', '5Hierophant',
           '6Lovers', '7Chariot', '8Strength', '9Hermit', '10Wheel_of_Fortune', '11Justice',
           '12Hanged_Man', '13Death', '14Temperance', '15Devil', '16Tower', '17Star',
           '18Moon', '19Sun', '20Judgement', '21World']
};

// Card point values for scoring
const CARD_VALUES = {
  'king': 4.5,
  'queen': 3.5,
  'knight': 2.5,
  'page': 1.5,
  '21World': 4.5,
  '1Magician': 4.5,
  '0Fool': 4.5
};

// Avatar selection
window.toggleOpponent = function(avatar, name) {
  const index = selectedOpponents.findIndex(opp => opp.avatar === avatar);
  const element = document.querySelector(`[data-avatar="${avatar}"] img`);

  if (index >= 0) {
    // Deselect
    selectedOpponents.splice(index, 1);
    document.querySelector(`[data-avatar="${avatar}"]`).querySelector('img').style.borderColor = 'transparent';
  } else if (selectedOpponents.length < 3) {
    // Select
    selectedOpponents.push({ avatar, name });
    document.querySelector(`[data-avatar="${avatar}"]`).querySelector('img').style.borderColor = 'rgba(212, 175, 55, 0.8)';
  } else {
    return; // Already have 3
  }

  // Update UI
  const continueBtn = document.getElementById('continue-to-deck');
  const message = document.getElementById('selection-message');

  if (selectedOpponents.length === 3) {
    continueBtn.disabled = false;
    message.textContent = 'Great! Click continue to select a deck';
    message.style.color = 'rgba(212, 175, 55, 0.8)';
  } else {
    continueBtn.disabled = true;
    message.textContent = `Select ${3 - selectedOpponents.length} more opponent${3 - selectedOpponents.length === 1 ? '' : 's'}`;
    message.style.color = 'rgba(255, 255, 255, 0.6)';
  }
};

// Continue to deck selection
window.continueToDecks = function() {
  if (selectedOpponents.length !== 3) return;

    element.classList.remove('border-gold');
    element.style.borderColor = 'transparent';
  } else {
    // Select (max 3)
    if (selectedOpponents.length < 3) {
      selectedOpponents.push({ avatar, name });
      element.style.borderColor = 'rgba(212, 175, 55, 0.8)';
    }
  }

  // Update UI
  const message = document.getElementById('selection-message');
  const button = document.getElementById('continue-to-deck');

  if (selectedOpponents.length === 3) {
    message.textContent = 'Perfect! Click continue to select your deck.';
    message.classList.add('gold-text');
    button.disabled = false;
  } else {
    message.textContent = `Select ${3 - selectedOpponents.length} more opponent${3 - selectedOpponents.length === 1 ? '' : 's'}`;
    message.classList.remove('gold-text');
    button.disabled = true;
  }
};

window.continueToDecks = function() {
  document.getElementById('avatar-selection').classList.add('hidden');
  document.getElementById('deck-selection').classList.remove('hidden');
};

// Select deck and start game
window.selectDeck = function(deck) {
  selectedDeck = deck;
  console.log("Starting game with deck:", deck);

  // Hide deck selection
  document.getElementById('deck-selection').classList.add('hidden');

  // Initialize game
  initializeGame();
};

// Initialize the game
function initializeGame() {
  console.log("Initializing game...");

  // Set up players (human is player 0)
  gameState.players = [
    { name: 'You', avatar: 'hippie', isHuman: true },
    { name: selectedOpponents[0].name, avatar: selectedOpponents[0].avatar, isHuman: false },
    { name: selectedOpponents[1].name, avatar: selectedOpponents[1].avatar, isHuman: false },
    { name: selectedOpponents[2].name, avatar: selectedOpponents[2].avatar, isHuman: false }
  ];

  // Update player info on board
  for (let i = 0; i < 4; i++) {
    document.getElementById(`player-${i}-name`).textContent = gameState.players[i].name;
    document.getElementById(`player-${i}-avatar`).src = `/images/avatars/${gameState.players[i].avatar}.png`;
  }

  // Create and shuffle deck
  createDeck();

  // Deal cards
  dealCards();

  // Show game board
  document.getElementById('game-board').classList.remove('hidden');

  // Show "Ready to Bid" button instead of auto-starting bidding
  showReadyToBidButton();
}

// Create a 78-card French Tarot deck
function createDeck() {
  gameState.deck = [];

  // Map tarot suits to display names
  const suits = ['cups', 'wands', 'swords', 'pent'];
  const suitNames = {
    cups: 'Cups',
    wands: 'Wands',
    swords: 'Swords',
    pent: 'Pentacles'
  };

  // Map trump numbers to Major Arcana names
  const trumpNames = {
    1: 'Magician',
    2: 'High_Priestess',
    3: 'Empress',
    4: 'Emperor',
    5: 'Hierophant',
    6: 'Lovers',
    7: 'Chariot',
    8: 'Strength',
    9: 'Hermit',
    10: 'Wheel_of_Fortune',
    11: 'Justice',
    12: 'Hanged_Man',
    13: 'Death',
    14: 'Temperance',
    15: 'Devil',
    16: 'Tower',
    17: 'Star',
    18: 'Moon',
    19: 'Sun',
    20: 'Judgement',
    21: 'World'
  };

  // Create minor arcana (suits 1-10, page, knight, queen, king)
  for (const suit of suits) {
    // Number cards 1-10
    for (let rank = 1; rank <= 10; rank++) {
      const rankPadded = rank.toString().padStart(2, '0');
      gameState.deck.push({
        id: `${suit}_${rank}`,
        suit: suit,
        rank: rank,
        name: `${rank} of ${suitNames[suit]}`,
        points: 0.5,
        isTrump: false,
        image: `/tarot-reader/assets/cards/${selectedDeck}/${suit}_${rankPadded}.png`
      });
    }

    // Court cards: Page (11), Knight (12), Queen (13), King (14)
    const courtCards = [
      { rank: 11, name: 'page', display: 'Page', points: 1.5 },
      { rank: 12, name: 'knight', display: 'Knight', points: 2.5 },
      { rank: 13, name: 'queen', display: 'Queen', points: 3.5 },
      { rank: 14, name: 'king', display: 'King', points: 4.5 }
    ];

    for (const court of courtCards) {
      gameState.deck.push({
        id: `${suit}_${court.rank}`,
        suit: suit,
        rank: court.rank,
        name: `${court.display} of ${suitNames[suit]}`,
        points: court.points,
        isTrump: false,
        image: `/tarot-reader/assets/cards/${selectedDeck}/${suit}_${court.name}.png`
      });
    }
  }

  // Create Major Arcana as trumps (1-21)
  for (let i = 1; i <= 21; i++) {
    gameState.deck.push({
      id: `trump_${i}`,
      suit: 'trump',
      rank: i,
      name: `Trump ${i} (${trumpNames[i].replace('_', ' ')})`,
      points: (i === 1 || i === 21) ? 4.5 : 0.5,
      isTrump: true,
      image: `/tarot-reader/assets/cards/${selectedDeck}/${i}${trumpNames[i]}.png`
    });
  }

  // The Excuse (Fool) - rank 0
  gameState.deck.push({
    id: 'excuse',
    suit: 'excuse',
    rank: 0,
    name: 'The Fool (Excuse)',
    points: 4.5,
    isTrump: false,
    isExcuse: true,
    image: `/tarot-reader/assets/cards/${selectedDeck}/0Fool.png`
  });

  // Shuffle
  for (let i = gameState.deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [gameState.deck[i], gameState.deck[j]] = [gameState.deck[j], gameState.deck[i]];
  }
}

// Deal cards to players
function dealCards() {
// Deck selection
window.selectDeck = function(deckName) {
  selectedDeck = deckName;
  document.getElementById('deck-selection').classList.add('hidden');
  document.getElementById('game-board').classList.remove('hidden');
  initializeGame();
};

// Create a full 78-card Tarot deck
function createDeck() {
  const deck = [];

  // Add suited cards (56 cards)
  for (const suit of SUITS) {
    for (const rank of RANKS.suits) {
      deck.push({
        suit: suit,
        rank: rank,
        isTrump: false,
        value: CARD_VALUES[rank] || 0.5,
        image: getCardImage(suit, rank)
      });
    }
  }

  // Add trumps (22 cards)
  for (const trump of RANKS.trumps) {
    deck.push({
      suit: 'trump',
      rank: trump,
      isTrump: true,
      value: CARD_VALUES[trump] || 0.5,
      image: getCardImage('trump', trump)
    });
  }

  return deck;
}

// Get card image path
function getCardImage(suit, rank) {
  if (suit === 'trump') {
    return `/tarot-reader/assets/cards/${selectedDeck}/${rank}.png`;
  } else {
    // Court cards have different naming conventions between decks
    const isCourtCard = ['page', 'knight', 'queen', 'king'].includes(rank);

    if (selectedDeck === 'hippie_tarot' && isCourtCard) {
      // hippie_tarot court cards use: queen_swords.png (rank_suit)
      return `/tarot-reader/assets/cards/${selectedDeck}/${rank}_${suit}.png`;
    } else {
      // Numbered cards (01-10) and best_simple use: swords_10.png (suit_rank)
      return `/tarot-reader/assets/cards/${selectedDeck}/${suit}_${rank}.png`;
    }
  }
}

// Shuffle deck
function shuffleDeck(deck) {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

// Initialize new game
function initializeGame() {
  const deck = shuffleDeck(createDeck());

  // Create players array with human player first, then selected opponents
  const players = [
    { name: 'You', hand: [], tricks: 0, score: 0, isHuman: true, avatar: 'hippie' }
  ];

  // Add selected opponents
  selectedOpponents.forEach(opp => {
    players.push({
      name: opp.name,
      hand: [],
      tricks: 0,
      score: 0,
      isHuman: false,
      avatar: opp.avatar
    });
  });

  gameState = {
    players: players,
    dog: [],
    currentTrick: [],
    trickLeader: 0,
    currentPlayer: 0,
    trickNumber: 0,
    takerIndex: -1,
    trumpBroken: false,  // Track if trump has been played yet
    deck: selectedDeck
  };

  // Deal cards
  dealCards(deck);

  // Start bidding phase
  setTimeout(() => biddingPhase(), 500);
}

// Deal 18 cards to each player, 6 to the dog
function dealCards(deck) {
  let cardIndex = 0;

  // Deal 18 cards to each player
  for (let i = 0; i < 18; i++) {
    for (let player = 0; player < 4; player++) {
      gameState.hands[player].push(gameState.deck[cardIndex++]);
    }
  }

  // Remaining 6 cards go to the dog
  gameState.dog = gameState.deck.slice(cardIndex, cardIndex + 6);

  // Sort hands
  for (let i = 0; i < 4; i++) {
    sortHand(gameState.hands[i]);
  }

  console.log("Cards dealt. Player 0 hand:", gameState.hands[0]);

  // Display player's hand
  displayHand();
    for (let player of gameState.players) {
      player.hand.push(deck[cardIndex++]);
    }
  }

  // Deal 6 cards to the dog
  for (let i = 0; i < 6; i++) {
    gameState.dog.push(deck[cardIndex++]);
  }

  // Sort hands
  gameState.players.forEach(player => sortHand(player.hand));

  updateUI();
}

// Sort hand by suit and rank
function sortHand(hand) {
  hand.sort((a, b) => {
    if (a.isTrump && !b.isTrump) return -1;
    if (!a.isTrump && b.isTrump) return 1;
    if (a.isExcuse) return -1;
    if (b.isExcuse) return 1;
    if (a.suit !== b.suit) return a.suit.localeCompare(b.suit);
    return b.rank - a.rank;
  });
}

// Display player's hand
function displayHand() {
  const handContainer = document.getElementById('player-hand');
  handContainer.innerHTML = '';

  const hand = gameState.hands[0];
  const midpoint = Math.ceil(hand.length / 2);

  // Create two rows
  const row1 = document.createElement('div');
  row1.className = 'hand-row';
  const row2 = document.createElement('div');
  row2.className = 'hand-row';

  // Get legal cards if it's the human player's turn
  const isMyTurn = gameState.players[gameState.currentPlayer]?.isHuman;
  const legalCards = isMyTurn ? getLegalCards(0) : [];

  hand.forEach((card, index) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'card-wrapper';

    const img = document.createElement('img');
    img.src = card.image;
    img.alt = card.name;
    img.className = 'card-in-hand';
    img.dataset.cardId = card.id;

    // Check if this card is legal to play
    const isLegal = !isMyTurn || legalCards.some(c => c.id === card.id);

    if (!isLegal) {
      img.style.opacity = '0.4';
      img.style.cursor = 'not-allowed';
      img.onclick = null;
    } else {
      img.style.opacity = '1';
      img.style.cursor = 'pointer';
      img.onclick = () => playCard(card);
    }

    const tooltip = document.createElement('div');
    tooltip.className = 'card-tooltip';
    tooltip.textContent = card.name;

    wrapper.appendChild(tooltip);
    wrapper.appendChild(img);

    if (index < midpoint) {
      row1.appendChild(wrapper);
    } else {
      row2.appendChild(wrapper);
    }
  });

  handContainer.appendChild(row1);
  handContainer.appendChild(row2);

  // Update card count
  document.getElementById('player-0-cards').textContent = `${hand.length} cards`;
}

// Show "Ready to Bid" button to give user time to review their hand
function showReadyToBidButton() {
  const banner = document.createElement('div');
  banner.id = 'ready-to-bid-banner';
  banner.style.cssText = `
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 9999;
    text-align: center;
    background: linear-gradient(135deg, #1a1625 0%, #2a2040 100%);
    border: 2px solid rgba(212, 175, 55, 0.6);
    border-radius: 16px;
    padding: 20px 40px;
    box-shadow: 0 10px 40px rgba(0,0,0,0.8);
    display: flex;
    align-items: center;
    gap: 20px;
  `;

  banner.innerHTML = `
    <div style="color: rgba(255,255,255,0.9); font-size: 16px;">
      <strong style="color: rgb(212, 175, 55);">Cards Dealt!</strong> Review your hand below
    </div>
    <button id="start-bidding-btn" style="
      padding: 12px 28px;
      border-radius: 10px;
      background: rgba(212, 175, 55, 0.9);
      border: 2px solid rgb(212, 175, 55);
      color: #1a1625;
      font-size: 16px;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.2s;
      white-space: nowrap;
    " onmouseover="this.style.background='rgb(212, 175, 55)'; this.style.transform='scale(1.05)'"
       onmouseout="this.style.background='rgba(212, 175, 55, 0.9)'; this.style.transform='scale(1)'">
      Ready to Bid →
    </button>
  `;

  document.body.appendChild(banner);

  // Add click handler
  document.getElementById('start-bidding-btn').addEventListener('click', () => {
    banner.remove();
    // Start bidding immediately
    startBiddingPhase();
  });
}

// Start the bidding phase
function startBiddingPhase() {
  console.log("=== BIDDING PHASE STARTED ===");

  gameState.bids = [];
  gameState.currentPlayer = 0;

  // Update status
  updateGameStatus("Bidding Phase");

  // Start with first player
  setTimeout(() => promptNextBid(), 800);
}

// Prompt next player to bid
function promptNextBid() {
  if (gameState.currentPlayer >= 4) {
    // Bidding complete
    finishBidding();
    return;
  }

  const player = gameState.players[gameState.currentPlayer];

  if (player.isHuman) {
    // Human player - show bidding UI
    promptHumanBid();
  } else {
    // AI player - auto bid
    setTimeout(() => {
      const bid = getAIBid(gameState.currentPlayer);
      recordBid(gameState.currentPlayer, bid);
    }, 1000 + Math.random() * 1000);
  }
}

// Prompt human player to bid
function promptHumanBid() {
  console.log("promptHumanBid called!");

  // Create overlay
  const overlay = document.createElement('div');
  overlay.id = 'bidding-overlay';
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.85);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
  `;

  const biddingBox = document.createElement('div');
  biddingBox.style.cssText = `
    background: linear-gradient(135deg, #1a1625 0%, #2a2040 100%);
    border: 2px solid rgba(212, 175, 55, 0.6);
    border-radius: 20px;
    padding: 40px;
    max-width: 500px;
    text-align: center;
    box-shadow: 0 20px 60px rgba(0,0,0,0.9);
  `;

  biddingBox.innerHTML = `
    <h2 style="color: rgb(212, 175, 55); font-size: 28px; margin-bottom: 20px; font-family: serif;">
      Your Bid
    </h2>
    <p style="color: rgba(255,255,255,0.8); margin-bottom: 30px;">
      Choose your bidding action:
    </p>
    <div style="display: flex; flex-direction: column; gap: 12px;">
      <button onclick="submitBid('pass')" style="padding: 16px 24px; border-radius: 12px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: white; font-size: 16px; cursor: pointer; transition: all 0.2s;">
        Pass
      </button>
      <button onclick="submitBid('small')" style="padding: 16px 24px; border-radius: 12px; background: rgba(212, 175, 55, 0.2); border: 1px solid rgba(212, 175, 55, 0.4); color: rgb(212, 175, 55); font-size: 16px; cursor: pointer; transition: all 0.2s;">
        Small (Petite)
      </button>
      <button onclick="submitBid('guard')" style="padding: 16px 24px; border-radius: 12px; background: rgba(212, 175, 55, 0.3); border: 1px solid rgba(212, 175, 55, 0.5); color: rgb(212, 175, 55); font-size: 16px; cursor: pointer; font-weight: bold; transition: all 0.2s;">
        Guard (Garde)
      </button>
      <button onclick="submitBid('guard_without')" style="padding: 16px 24px; border-radius: 12px; background: rgba(212, 175, 55, 0.4); border: 1px solid rgba(212, 175, 55, 0.6); color: white; font-size: 16px; cursor: pointer; font-weight: bold; transition: all 0.2s;">
        Guard Without
      </button>
      <button onclick="submitBid('guard_against')" style="padding: 16px 24px; border-radius: 12px; background: rgba(212, 175, 55, 0.5); border: 1px solid rgba(212, 175, 55, 0.7); color: white; font-size: 16px; cursor: pointer; font-weight: bold; transition: all 0.2s;">
        Guard Against
      </button>
    </div>
  `;

  overlay.appendChild(biddingBox);
  document.body.appendChild(overlay);

  // Add hover effects
  const buttons = biddingBox.querySelectorAll('button');
  buttons.forEach(btn => {
    btn.onmouseenter = () => {
      btn.style.transform = 'scale(1.05)';
      btn.style.boxShadow = '0 8px 24px rgba(212, 175, 55, 0.3)';
    };
    btn.onmouseleave = () => {
      btn.style.transform = 'scale(1)';
      btn.style.boxShadow = 'none';
    };
  });
}

// Submit bid
window.submitBid = function(bid) {
  console.log("Human bid:", bid);

  // Remove overlay
  const overlay = document.getElementById('bidding-overlay');
  if (overlay) overlay.remove();

  // Record bid
  recordBid(0, bid);
};

// Record a bid
function recordBid(playerIndex, bid) {
  const player = gameState.players[playerIndex];
  gameState.bids.push({ player: playerIndex, bid: bid });

  console.log(`${player.name} bid: ${bid}`);
  updateGameStatus(`${player.name} bid: ${bid}`);

  // Move to next player
  gameState.currentPlayer++;
  setTimeout(() => promptNextBid(), 1500);
}

// Get AI bid
function getAIBid(playerIndex) {
  const hand = gameState.hands[playerIndex];
  const trumpCount = hand.filter(c => c.isTrump).length;
  const highCards = hand.filter(c => c.points > 2).length;

  const strength = trumpCount * 2 + highCards;

  // Simple AI: bid based on hand strength
  if (strength < 10) return 'pass';
  if (strength < 15) return Math.random() > 0.7 ? 'small' : 'pass';
  if (strength < 20) return Math.random() > 0.5 ? 'small' : 'guard';
  return Math.random() > 0.6 ? 'guard' : 'guard_without';
}

// Finish bidding phase
function finishBidding() {
  console.log("Bidding complete:", gameState.bids);

  // Find highest bidder
  const bidValues = { 'pass': 0, 'small': 1, 'guard': 2, 'guard_without': 3, 'guard_against': 4 };
  let highestBid = null;
  let declarer = -1;

  for (const bidInfo of gameState.bids) {
    if (!highestBid || bidValues[bidInfo.bid] > bidValues[highestBid.bid]) {
      highestBid = bidInfo;
      declarer = bidInfo.player;
    }
  }

  if (declarer === -1 || highestBid.bid === 'pass') {
    // Everyone passed - new deal
    updateGameStatus("Everyone passed. Dealing new round...");
    setTimeout(() => {
      initializeGame();
    }, 2000);
    return;
  }

  gameState.declarer = declarer;
  gameState.declarerBid = highestBid.bid;

  const declarerName = gameState.players[declarer].name;
  updateGameStatus(`${declarerName} won the bid with ${highestBid.bid}!`);

  console.log(`Declarer: ${declarerName}, Bid: ${highestBid.bid}`);

  // Handle dog
  setTimeout(() => handleDog(), 2000);
}

// Handle the dog (6 cards)
function handleDog() {
  if (gameState.declarerBid === 'guard_without' || gameState.declarerBid === 'guard_against') {
    // Don't take the dog
    updateGameStatus("Dog is not taken (Guard Without/Against)");
    setTimeout(() => startPlayPhase(), 2000);
  } else {
    // Declarer takes the dog
    if (gameState.declarer === 0) {
      // Human declarer - would need UI to choose discards
      // For now, auto-discard
      autoDiscard();
    } else {
      // AI declarer
      autoDiscard();
    }
  }
}

// Handle dog exchange
async function autoDiscard() {
  if (gameState.declarerBid !== 'guard_without' && gameState.declarerBid !== 'guard_against') {
    // Add dog to declarer's hand
    gameState.hands[gameState.declarer].push(...gameState.dog);
    sortHand(gameState.hands[gameState.declarer]);

    if (gameState.declarer === 0) {
      // Human player - show dog exchange UI
      displayHand();
      await showDogExchangeUI();
    } else {
      // AI player - auto discard 6 lowest cards
      const hand = gameState.hands[gameState.declarer];
      const discards = hand.splice(-6, 6);
      console.log("AI Discarded:", discards);
    }
  }

  startPlayPhase();
}

// Show dog exchange UI for human player
async function showDogExchangeUI() {
  return new Promise((resolve) => {
    const selectedCards = new Set();
    const hand = gameState.hands[0];

    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.95);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      overflow-y: auto;
      padding: 40px 20px;
    `;

    const container = document.createElement('div');
    container.style.cssText = `
      background: linear-gradient(135deg, #1a1625 0%, #2a2040 100%);
      border: 2px solid rgba(212, 175, 55, 0.6);
      border-radius: 20px;
      padding: 40px;
      max-width: 1400px;
      width: 100%;
    `;

    const title = document.createElement('h2');
    title.style.cssText = `
      color: rgb(212, 175, 55);
      font-size: 28px;
      margin-bottom: 10px;
      text-align: center;
      font-family: serif;
    `;
    title.textContent = 'Exchange with the Dog';

    const instructions = document.createElement('p');
    instructions.style.cssText = `
      color: rgba(255,255,255,0.8);
      margin-bottom: 20px;
      text-align: center;
    `;
    instructions.innerHTML = `You now have 24 cards (18 + 6 from dog).<br>Select <strong>6 cards to discard</strong> (no trumps, Fool, or kings).`;

    const counter = document.createElement('div');
    counter.style.cssText = `
      color: rgb(212, 175, 55);
      font-size: 20px;
      font-weight: bold;
      text-align: center;
      margin-bottom: 20px;
    `;
    counter.textContent = 'Selected: 0 / 6';

    const cardsContainer = document.createElement('div');
    cardsContainer.style.cssText = `
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
      gap: 15px;
      margin-bottom: 30px;
      max-height: 60vh;
      overflow-y: auto;
      padding: 20px;
      background: rgba(0,0,0,0.3);
      border-radius: 12px;
    `;

    hand.forEach((card, index) => {
      const cardWrapper = document.createElement('div');
      cardWrapper.style.cssText = `position: relative; cursor: pointer; transition: all 0.2s;`;

      const cardImg = document.createElement('img');
      cardImg.src = card.image;
      cardImg.style.cssText = `width: 100%; border-radius: 8px; border: 3px solid transparent; transition: all 0.2s;`;

      const cardName = document.createElement('div');
      cardName.style.cssText = `
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0,0,0,0.8);
        color: white;
        padding: 4px;
        font-size: 11px;
        text-align: center;
        border-bottom-left-radius: 8px;
        border-bottom-right-radius: 8px;
      `;
      cardName.textContent = card.name;

      const canDiscard = !card.isTrump && card.rank !== 14;

      if (!canDiscard) {
        cardImg.style.opacity = '0.5';
        cardImg.style.cursor = 'not-allowed';
      } else {
        cardWrapper.onclick = () => {
          if (selectedCards.has(index)) {
            selectedCards.delete(index);
            cardImg.style.border = '3px solid transparent';
            cardWrapper.style.transform = 'translateY(0)';
          } else if (selectedCards.size < 6) {
            selectedCards.add(index);
            cardImg.style.border = '3px solid rgb(212, 175, 55)';
            cardWrapper.style.transform = 'translateY(-10px)';
          }
          counter.textContent = `Selected: ${selectedCards.size} / 6`;
          confirmBtn.disabled = selectedCards.size !== 6;
          confirmBtn.style.opacity = selectedCards.size === 6 ? '1' : '0.5';
        };
      }

      cardWrapper.appendChild(cardImg);
      cardWrapper.appendChild(cardName);
      cardsContainer.appendChild(cardWrapper);
    });

    const confirmBtn = document.createElement('button');
    confirmBtn.disabled = true;
    confirmBtn.style.cssText = `
      padding: 16px 40px;
      border-radius: 12px;
      background: rgb(212, 175, 55);
      border: none;
      color: #1a1625;
      font-size: 18px;
      font-weight: bold;
      cursor: pointer;
      opacity: 0.5;
      transition: all 0.3s;
      display: block;
      margin: 0 auto;
    `;
    confirmBtn.textContent = 'Confirm Discards';
    confirmBtn.onclick = () => {
      const selectedIndices = Array.from(selectedCards).sort((a, b) => b - a);
      for (const index of selectedIndices) {
        hand.splice(index, 1);
      }
      console.log('Discarded', selectedIndices.length, 'cards');
      overlay.remove();
      sortHand(hand);
      displayHand();
      resolve();
    };

    container.appendChild(title);
    container.appendChild(instructions);
    container.appendChild(counter);
    container.appendChild(cardsContainer);
    container.appendChild(confirmBtn);
    overlay.appendChild(container);
    document.body.appendChild(overlay);
  });
}

// Get legal cards that can be played (French Tarot rules)
function getLegalCards(playerIndex) {
  const hand = gameState.hands[playerIndex];
  const trick = gameState.currentTrick;

  // Debug: check for empty hand
  if (hand.length === 0) {
    console.warn(`WARNING: Player ${playerIndex} has an empty hand!`);
    return [];
  }

  // Leading the trick
  if (trick.length === 0) {
    // Can't lead trump unless trump is broken OR you only have trumps
    if (!gameState.trumpBroken) {
      const nonTrumps = hand.filter(c => !c.isTrump && !c.isExcuse);
      if (nonTrumps.length > 0) {
        return nonTrumps; // Can only lead non-trumps
      }
    }
    return hand; // All cards legal (only trumps left, or trump is broken)
  }

  // Following in the trick
  const ledCard = trick[0].card;
  const ledSuit = ledCard.suit;

  // Special case: Excuse was led (very rare, but handle it)
  if (ledCard.isExcuse) {
    return hand; // Can play anything when Excuse is led
  }

  // Must follow suit if possible (including following trump with trump)
  const sameSuit = hand.filter(c => c.suit === ledSuit && !c.isExcuse);
  if (sameSuit.length > 0) {
    return sameSuit;
  }

  // Can't follow suit - must play trump if you have any (Excuse doesn't count as trump for this rule)
  const trumps = hand.filter(c => c.isTrump);
  if (trumps.length > 0) {
    return trumps;
  }

  // No suit cards and no trumps - can play anything (including Excuse)
  return hand;
}

// Start the play phase
function startPlayPhase() {
  console.log("=== PLAY PHASE STARTED ===");

  gameState.currentTrick = [];
  gameState.trickLeader = 0;
  gameState.currentPlayer = 0;
  gameState.trumpBroken = false;

  updateGameStatus("Playing tricks...");

  setTimeout(() => playNextCard(), 1000);
}

// Play next card
function playNextCard() {
  if (gameState.currentPlayer >= 4) {
    // Trick complete
    finishTrick();
    return;
  }

  const player = gameState.players[gameState.currentPlayer];

  if (player.isHuman) {
    updateGameStatus("Your turn - play a card");
  } else {
    // AI plays
    setTimeout(() => {
      const card = getAICardPlay(gameState.currentPlayer);
      playCardFromHand(gameState.currentPlayer, card);
    }, 1000 + Math.random() * 1000);
  }
}

// Play a card (from human click)
window.playCard = function(card) {
  if (gameState.players[gameState.currentPlayer].isHuman) {
    playCardFromHand(0, card);
  }
};

// Play a card from a player's hand
function playCardFromHand(playerIndex, card) {
  // Validate card is not undefined/null
  if (!card) {
    console.error(`ERROR: playCardFromHand called with invalid card for player ${playerIndex}`);
    console.error(`Hand:`, gameState.hands[playerIndex]);
    console.error(`Current trick:`, gameState.currentTrick);
    // Skip this player's turn and move to next
    gameState.currentPlayer++;
    setTimeout(() => playNextCard(), 800);
    return;
  }

  // Remove from hand
  const hand = gameState.hands[playerIndex];
  const cardIndex = hand.findIndex(c => c.id === card.id);
  if (cardIndex < 0) {
    console.error(`ERROR: Card ${card.id} not found in player ${playerIndex}'s hand`);
    return;
  }

  hand.splice(cardIndex, 1);

  // Add to current trick
  gameState.currentTrick.push({ player: playerIndex, card: card });

  // Track trump broken (when trump is played following, not leading)
  if (card.isTrump && gameState.currentTrick.length > 1 && !gameState.trumpBroken) {
    gameState.trumpBroken = true;
    console.log("Trump has been broken!");
  }

  // Display on table
  const cardArea = document.getElementById(`card-${playerIndex}`);
  cardArea.innerHTML = `<img src="${card.image}" class="card-on-table" alt="${card.name}">`;

  // Update card count
  document.getElementById(`player-${playerIndex}-cards`).textContent = `${hand.length} cards`;

  if (playerIndex === 0) {
    displayHand();
  }

  // Next player
  gameState.currentPlayer++;
  setTimeout(() => playNextCard(), 800);
}

// Get AI card to play
function getAICardPlay(playerIndex) {
  const hand = gameState.hands[playerIndex];
  const legalCards = getLegalCards(playerIndex);

  // Debug logging
  if (legalCards.length === 0) {
    console.error(`ERROR: Player ${playerIndex} (${gameState.players[playerIndex].name}) has no legal cards!`);
    console.error(`Hand size: ${hand.length}`, hand);
    console.error(`Current trick:`, gameState.currentTrick);
    console.error(`Trump broken: ${gameState.trumpBroken}`);
    // Fallback: if somehow we have no legal cards, just play any card from hand
    if (hand.length > 0) {
      return hand[0];
    }
    return null;
  }

  // Simple AI: play lowest value legal card
  legalCards.sort((a, b) => (a.points || 0.5) - (b.points || 0.5));
  return legalCards[0];
}

// Finish current trick
function finishTrick() {
  console.log("Trick complete:", gameState.currentTrick);

  // Determine winner (highest trump or highest card of led suit)
  let winner = gameState.currentTrick[0].player;
  let winningCard = gameState.currentTrick[0].card;
  const ledSuit = gameState.currentTrick[0].card.suit;

  for (let i = 1; i < gameState.currentTrick.length; i++) {
    const card = gameState.currentTrick[i].card;

    if (card.isTrump && !winningCard.isTrump) {
      // Trump beats non-trump
      winner = gameState.currentTrick[i].player;
      winningCard = card;
    } else if (card.isTrump && winningCard.isTrump && card.rank > winningCard.rank) {
      // Higher trump beats lower trump
      winner = gameState.currentTrick[i].player;
      winningCard = card;
    } else if (!card.isTrump && !winningCard.isTrump && card.suit === ledSuit && winningCard.suit === ledSuit && card.rank > winningCard.rank) {
      // Higher card of led suit beats lower
      winner = gameState.currentTrick[i].player;
      winningCard = card;
    }
  }

  // Count points in this trick
  let trickPoints = 0;
  for (const play of gameState.currentTrick) {
    trickPoints += play.card.points || 0.5;
  }

  gameState.tricksWon[winner]++;
  gameState.trickPoints[winner] += trickPoints;

  const winnerName = gameState.players[winner].name;
  updateGameStatus(`${winnerName} wins the trick! (${trickPoints.toFixed(1)} points)`);
  console.log(`Trick won by ${winnerName}, points: ${trickPoints.toFixed(1)}, total: ${gameState.trickPoints[winner].toFixed(1)}`);

  // Clear table
  setTimeout(() => {
    for (let i = 0; i < 4; i++) {
      document.getElementById(`card-${i}`).innerHTML = '';
    }

    // Check if game is over
    if (gameState.hands[0].length === 0) {
      endGame();
    } else {
      // Next trick
      gameState.currentTrick = [];
      gameState.currentPlayer = winner;
      gameState.trickLeader = winner;
      setTimeout(() => playNextCard(), 1000);
    }
  }, 2000);
}

// End game
function endGame() {
  console.log("Game over!");

  // Calculate actual French Tarot scoring
  const declarerPoints = gameState.trickPoints[gameState.declarer];

  // In French Tarot, declarer needs different point thresholds based on number of bouts (oudlers)
  // Simplified: declarer needs 41+ points to win
  const declarerWon = declarerPoints >= 41;

  const pointDifference = Math.abs(declarerPoints - 41);
  let baseScore = (declarerWon ? 25 : -25) + pointDifference;

  const multipliers = { 'small': 1, 'guard': 2, 'guard_without': 4, 'guard_against': 6 };
  const finalScore = Math.floor(baseScore * (multipliers[gameState.declarerBid] || 1));

  gameState.scores[gameState.declarer] += finalScore * 3;
  for (let i = 0; i < 4; i++) {
    if (i !== gameState.declarer) {
      gameState.scores[i] -= finalScore;
    }
  }

  console.log(`Declarer ${declarerWon ? 'WON' : 'LOST'} with ${declarerPoints.toFixed(1)} points (needed 41)`);
  console.log(`Base score: ${baseScore}, multiplier: ${multipliers[gameState.declarerBid]}, final: ${finalScore}`);

  // Show game over screen
  document.getElementById('game-board').classList.add('hidden');

  const scoresHTML = gameState.players.map((p, i) =>
    `<div style="margin: 8px 0;">
      <strong>${p.name}:</strong> ${gameState.scores[i]} game points<br>
      <span style="font-size: 0.9em; color: rgba(255,255,255,0.7);">
        ${gameState.tricksWon[i]} tricks, ${gameState.trickPoints[i].toFixed(1)} card points
      </span>
    </div>`
  ).join('');

  document.getElementById('final-scores').innerHTML = scoresHTML;
  document.getElementById('deck-promo').textContent = `You played with the ${selectedDeck === 'hippie_tarot' ? 'Hippie Tarot' : 'Classic Tarot'} deck`;
  document.getElementById('buy-deck-link').href = '/products.html';

  document.getElementById('game-over').classList.remove('hidden');
}

// Update game status message
function updateGameStatus(message) {
  const statusEl = document.getElementById('game-status');
  if (statusEl) {
    statusEl.textContent = message;
  }
}

console.log("Cardamon game functions registered");
    if (a.isTrump && !b.isTrump) return 1;
    if (!a.isTrump && b.isTrump) return -1;
    if (a.isTrump && b.isTrump) {
      return RANKS.trumps.indexOf(a.rank) - RANKS.trumps.indexOf(b.rank);
    }
    if (a.suit !== b.suit) {
      return SUITS.indexOf(a.suit) - SUITS.indexOf(b.suit);
    }
    return RANKS.suits.indexOf(a.rank) - RANKS.suits.indexOf(b.rank);
  });
}

// Bidding phase
async function biddingPhase() {
  updateStatus('Bidding phase...');

  let highestBid = 0;
  let highestBidder = -1;

  // Each player bids in order
  for (let i = 0; i < gameState.players.length; i++) {
    const player = gameState.players[i];
    let bid = 0;

    if (!player.isHuman) {
      // AI bids based on trump count and high cards
      const trumpCount = player.hand.filter(c => c.isTrump).length;
      const highCards = player.hand.filter(c => c.value >= 2.5).length;

      // Bid if strong hand (lots of trumps or high cards)
      if (trumpCount >= 8 && highCards >= 5) {
        bid = Math.min(highestBid + 1, 4); // Bid one higher
      } else if (trumpCount >= 10) {
        bid = Math.min(highestBid + 1, 4);
      }
    } else {
      // For now, human always passes (bid 0)
      // TODO: Add human bidding UI
      bid = 0;
    }

    if (bid > highestBid) {
      highestBid = bid;
      highestBidder = i;
      updateStatus(`${player.name} bids ${bid}!`);
      await sleep(800);
    }
  }

  gameState.takerIndex = highestBidder;

  if (highestBidder >= 0) {
    const taker = gameState.players[highestBidder];
    updateStatus(`${taker.name} won the bid with ${highestBid}!`);
    await sleep(1500);

    // Ask taker if they want the dog
    if (taker.isHuman) {
      // TODO: Add UI for human to accept/decline dog
      updateStatus('You won the bid! Taking the dog...');
      taker.hand.push(...gameState.dog);
      sortHand(taker.hand);
      await sleep(1500);
    } else {
      // AI decides whether to take the dog
      const trumpCount = taker.hand.filter(c => c.isTrump).length;
      const takeDog = trumpCount < 12; // Take dog if not enough trumps

      if (takeDog) {
        updateStatus(`${taker.name} takes the dog!`);
        taker.hand.push(...gameState.dog);
        sortHand(taker.hand);
      } else {
        updateStatus(`${taker.name} declines the dog.`);
      }
      await sleep(1500);
    }
  } else {
    updateStatus('Everyone passed. Starting play...');
    await sleep(1500);
  }

  // Start playing tricks
  playTrick();
}

// Play a trick
async function playTrick() {
  gameState.trickNumber++;
  gameState.currentTrick = [];
  updateStatus(`Trick ${gameState.trickNumber} of 18`);

  // Play in order starting from trick leader
  for (let i = 0; i < 4; i++) {
    const playerIndex = (gameState.trickLeader + i) % 4;
    gameState.currentPlayer = playerIndex;

    await playCard(playerIndex);

    // Check if trump was played (breaks trump)
    const lastCard = gameState.currentTrick[gameState.currentTrick.length - 1].card;
    if (lastCard.isTrump && !gameState.trumpBroken) {
      gameState.trumpBroken = true;
      updateStatus('Trump has been broken!');
      await sleep(1000);
    }

    await sleep(800);
  }

  // Determine trick winner
  const winnerIndex = determineTrickWinner();
  gameState.players[winnerIndex].tricks++;
  gameState.trickLeader = winnerIndex;

  updateStatus(`${gameState.players[winnerIndex].name} wins the trick!`);
  await sleep(2000);

  // Clear the trick
  gameState.currentTrick = [];
  updateTrickArea();

  // Check if game is over
  if (gameState.trickNumber >= 18) {
    endGame();
  } else {
    playTrick();
  }
}

// Play a card for a player
async function playCard(playerIndex) {
  const player = gameState.players[playerIndex];

  if (player.isHuman) {
    // Wait for human to click a card
    await waitForHumanCard();
  } else {
    // AI plays a card
    const cardIndex = chooseAICard(player);
    const card = player.hand.splice(cardIndex, 1)[0];
    gameState.currentTrick.push({ card, playerIndex });
  }

  updateUI();
}

// AI card selection (simplified)
function chooseAICard(player) {
  const legalCards = getLegalCards(player.hand);

  if (legalCards.length === 0) return 0; // Shouldn't happen

  // Simple strategy: play first legal card
  const chosenCard = legalCards[0];
  return player.hand.indexOf(chosenCard);
}

// Get legal cards to play
function getLegalCards(hand) {
  if (gameState.currentTrick.length === 0) {
    // Leading: can play any card EXCEPT trump (unless broken or only trumps left)
    if (!gameState.trumpBroken) {
      const nonTrumps = hand.filter(c => !c.isTrump);
      // Can only lead trump if you have no other cards
      if (nonTrumps.length > 0) {
        return nonTrumps;
      }
    }
    return hand;
  }

  const ledCard = gameState.currentTrick[0].card;

  if (ledCard.isTrump) {
    // Must follow trump if possible
    const trumps = hand.filter(c => c.isTrump);
    return trumps.length > 0 ? trumps : hand;
  } else {
    // Must follow suit if possible
    const sameSuit = hand.filter(c => c.suit === ledCard.suit && !c.isTrump);
    if (sameSuit.length > 0) return sameSuit;

    // Otherwise must play trump if possible
    const trumps = hand.filter(c => c.isTrump);
    return trumps.length > 0 ? trumps : hand;
  }
}

// Wait for human to select a card
function waitForHumanCard() {
  return new Promise((resolve) => {
    const player = gameState.players[0];
    const legalCards = getLegalCards(player.hand);

    // Get all card wrapper elements from both rows
    const handElement = document.getElementById('player-hand');
    const allCardWrappers = handElement.querySelectorAll('.card-wrapper');

    // Add click handlers to legal cards
    for (let i = 0; i < player.hand.length; i++) {
      const card = player.hand[i];
      const cardWrapper = allCardWrappers[i];
      const cardImg = cardWrapper.querySelector('.card-in-hand');

      if (legalCards.includes(card)) {
        cardImg.style.opacity = '1';
        cardImg.style.cursor = 'pointer';
        cardWrapper.onclick = () => {
          player.hand.splice(i, 1);
          gameState.currentTrick.push({ card, playerIndex: 0 });

          // Remove click handlers
          allCardWrappers.forEach(wrapper => {
            wrapper.onclick = null;
            const img = wrapper.querySelector('.card-in-hand');
            if (img) img.style.opacity = '1';
          });

          resolve();
        };
      } else {
        cardImg.style.opacity = '0.5';
        cardImg.style.cursor = 'not-allowed';
      }
    }
  });
}

// Determine who won the trick
function determineTrickWinner() {
  const ledCard = gameState.currentTrick[0].card;
  let winningPlay = gameState.currentTrick[0];

  for (let i = 1; i < gameState.currentTrick.length; i++) {
    const play = gameState.currentTrick[i];

    if (beats(play.card, winningPlay.card, ledCard)) {
      winningPlay = play;
    }
  }

  return winningPlay.playerIndex;
}

// Check if card1 beats card2
function beats(card1, card2, ledCard) {
  // Trump always beats non-trump
  if (card1.isTrump && !card2.isTrump) return true;
  if (!card1.isTrump && card2.isTrump) return false;

  if (card1.isTrump && card2.isTrump) {
    // Higher trump wins
    return RANKS.trumps.indexOf(card1.rank) > RANKS.trumps.indexOf(card2.rank);
  }

  // Both non-trump
  if (card1.suit === ledCard.suit && card2.suit !== ledCard.suit) return true;
  if (card1.suit !== ledCard.suit && card2.suit === ledCard.suit) return false;

  // Same suit: higher rank wins
  if (card1.suit === card2.suit) {
    return RANKS.suits.indexOf(card1.rank) > RANKS.suits.indexOf(card2.rank);
  }

  return false;
}

// End game and show results
function endGame() {
  // Calculate final scores
  gameState.players.forEach(player => {
    let points = 0;
    player.hand.forEach(card => points += card.value);
    player.score = Math.floor(points);
  });

  // Show game over screen
  document.getElementById('game-board').classList.add('hidden');
  document.getElementById('game-over').classList.remove('hidden');

  // Display scores
  const scoresHtml = gameState.players
    .map(p => `<div class="text-lg mb-2"><span class="gold-text">${p.name}:</span> ${p.tricks} tricks, ${p.score} points</div>`)
    .join('');

  document.getElementById('final-scores').innerHTML = scoresHtml;

  // Subtle deck promotion
  const deckName = selectedDeck === 'hippie_tarot' ? 'Hippie Tarot' : 'Classic Tarot';
  document.getElementById('deck-promo').textContent = `Enjoyed playing with the ${deckName} deck?`;
}

// Get readable card name for tooltip
function getCardName(card) {
  if (card.isTrump) {
    // Trump cards
    const trumpNames = {
      '0Fool': 'The Fool',
      '1Magician': 'The Magician',
      '2High_Priestess': 'The High Priestess',
      '3Empress': 'The Empress',
      '4Emperor': 'The Emperor',
      '5Hierophant': 'The Hierophant',
      '6Lovers': 'The Lovers',
      '7Chariot': 'The Chariot',
      '8Strength': 'Strength',
      '9Hermit': 'The Hermit',
      '10Wheel_of_Fortune': 'Wheel of Fortune',
      '11Justice': 'Justice',
      '12Hanged_Man': 'The Hanged Man',
      '13Death': 'Death',
      '14Temperance': 'Temperance',
      '15Devil': 'The Devil',
      '16Tower': 'The Tower',
      '17Star': 'The Star',
      '18Moon': 'The Moon',
      '19Sun': 'The Sun',
      '20Judgement': 'Judgement',
      '21World': 'The World'
    };
    return trumpNames[card.rank] || card.rank;
  } else {
    // Suited cards
    const rankNames = {
      '01': 'Ace',
      '02': 'Two',
      '03': 'Three',
      '04': 'Four',
      '05': 'Five',
      '06': 'Six',
      '07': 'Seven',
      '08': 'Eight',
      '09': 'Nine',
      '10': 'Ten',
      'page': 'Page',
      'knight': 'Knight',
      'queen': 'Queen',
      'king': 'King'
    };
    const suitNames = {
      'swords': 'Swords',
      'pent': 'Pentacles',
      'cups': 'Cups',
      'wands': 'Wands'
    };
    return `${rankNames[card.rank]} of ${suitNames[card.suit]}`;
  }
}

// Update UI
function updateUI() {
  // Update player hand - display in 2 rows of 9 cards each
  const handElement = document.getElementById('player-hand');
  handElement.innerHTML = '';

  const hand = gameState.players[0].hand;
  const midpoint = Math.ceil(hand.length / 2);

  // Create first row
  const row1 = document.createElement('div');
  row1.className = 'hand-row';
  hand.slice(0, midpoint).forEach(card => {
    const cardWrapper = document.createElement('div');
    cardWrapper.className = 'card-wrapper';

    const img = document.createElement('img');
    img.src = card.image;
    img.className = 'card-in-hand';
    img.alt = `${card.rank} of ${card.suit}`;

    const tooltip = document.createElement('div');
    tooltip.className = 'card-tooltip';
    tooltip.textContent = getCardName(card);

    cardWrapper.appendChild(img);
    cardWrapper.appendChild(tooltip);
    row1.appendChild(cardWrapper);
  });

  // Create second row
  const row2 = document.createElement('div');
  row2.className = 'hand-row';
  hand.slice(midpoint).forEach(card => {
    const cardWrapper = document.createElement('div');
    cardWrapper.className = 'card-wrapper';

    const img = document.createElement('img');
    img.src = card.image;
    img.className = 'card-in-hand';
    img.alt = `${card.rank} of ${card.suit}`;

    const tooltip = document.createElement('div');
    tooltip.className = 'card-tooltip';
    tooltip.textContent = getCardName(card);

    cardWrapper.appendChild(img);
    cardWrapper.appendChild(tooltip);
    row2.appendChild(cardWrapper);
  });

  handElement.appendChild(row1);
  handElement.appendChild(row2);

  // Update all players' info
  gameState.players.forEach((player, i) => {
    // Update avatar
    const avatarEl = document.getElementById(`player-${i}-avatar`);
    if (avatarEl) {
      avatarEl.src = `/images/avatars/${player.avatar}.png`;
    }

    // Update name
    const nameEl = document.getElementById(`player-${i}-name`);
    if (nameEl) {
      nameEl.textContent = player.name;
    }

    // Update card count
    const countEl = document.getElementById(`player-${i}-cards`);
    if (countEl) {
      countEl.textContent = `${player.hand.length} cards`;
    }
  });

  // Update trick area
  updateTrickArea();
}

// Update cards on the table
function updateTrickArea() {
  // Clear all card positions
  for (let i = 0; i < 4; i++) {
    const el = document.getElementById(`card-${i}`);
    if (el) el.innerHTML = '';
  }

  // Add cards from current trick
  gameState.currentTrick.forEach(play => {
    const el = document.getElementById(`card-${play.playerIndex}`);
    if (el) {
      const img = document.createElement('img');
      img.src = play.card.image;
      img.className = 'card-on-table';
      img.alt = `${play.card.rank} of ${play.card.suit}`;
      el.appendChild(img);
    }
  });
}

// Update game status message
function updateStatus(message) {
  document.getElementById('game-status').textContent = message;
}

// Sleep utility
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
