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
  scores: [0, 0, 0, 0]
};

// Available opponent avatars
const AVATARS = {
  'hippie': 'Hippie',
  'lady': 'Lady',
  'lady_book': 'Lady Book',
  'moses': 'Moses',
  'old_man': 'Old Man'
};

// Toggle opponent selection
window.toggleOpponent = function(avatar, name) {
  const index = selectedOpponents.findIndex(o => o.avatar === avatar);

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

  // Start bidding phase
  setTimeout(() => startBiddingPhase(), 500);
}

// Create a 78-card French Tarot deck
function createDeck() {
  gameState.deck = [];

  const suits = ['clubs', 'diamonds', 'hearts', 'spades'];
  const suitNames = { clubs: 'Clubs', diamonds: 'Diamonds', hearts: 'Hearts', spades: 'Spades' };

  // Regular suits (1-10, Jack, Knight, Queen, King)
  for (const suit of suits) {
    for (let rank = 1; rank <= 14; rank++) {
      let rankName;
      if (rank === 1) rankName = 'Ace';
      else if (rank === 11) rankName = 'Jack';
      else if (rank === 12) rankName = 'Knight';
      else if (rank === 13) rankName = 'Queen';
      else if (rank === 14) rankName = 'King';
      else rankName = rank.toString();

      gameState.deck.push({
        id: `${suit}_${rank}`,
        suit: suit,
        rank: rank,
        name: `${rankName} of ${suitNames[suit]}`,
        points: (rank >= 11) ? 5 : 0.5,
        isTrump: false,
        image: `/tarot-reader/assets/cards/${selectedDeck}/${rank}${suitNames[suit]}.png`
      });
    }
  }

  // Trumps (1-21)
  for (let i = 1; i <= 21; i++) {
    gameState.deck.push({
      id: `trump_${i}`,
      suit: 'trump',
      rank: i,
      name: `Trump ${i}`,
      points: (i === 1 || i === 21) ? 4.5 : 0.5,
      isTrump: true,
      image: `/tarot-reader/assets/cards/${selectedDeck}/${i}Trumps.png`
    });
  }

  // The Excuse (Fool)
  gameState.deck.push({
    id: 'excuse',
    suit: 'excuse',
    rank: 0,
    name: 'The Excuse',
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

  hand.forEach((card, index) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'card-wrapper';

    const img = document.createElement('img');
    img.src = card.image;
    img.alt = card.name;
    img.className = 'card-in-hand';
    img.dataset.cardId = card.id;
    img.onclick = () => playCard(card);

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

// Start the bidding phase
function startBiddingPhase() {
  console.log("=== BIDDING PHASE STARTED ===");

  gameState.bids = [];
  gameState.currentPlayer = 0;

  // CRITICAL: Scroll to top IMMEDIATELY
  window.scrollTo({ top: 0, behavior: 'smooth' });

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

  // FORCE scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });

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

// Auto-discard (simplified)
function autoDiscard() {
  if (gameState.declarerBid !== 'guard_without' && gameState.declarerBid !== 'guard_against') {
    // Add dog to declarer's hand
    gameState.hands[gameState.declarer].push(...gameState.dog);

    // Sort hand
    sortHand(gameState.hands[gameState.declarer]);

    // Discard 6 lowest cards
    const hand = gameState.hands[gameState.declarer];
    const discards = hand.splice(-6, 6);

    console.log("Discarded:", discards);

    if (gameState.declarer === 0) {
      displayHand();
    }
  }

  setTimeout(() => startPlayPhase(), 1500);
}

// Start the play phase
function startPlayPhase() {
  console.log("=== PLAY PHASE STARTED ===");

  gameState.currentTrick = [];
  gameState.trickLeader = 0;
  gameState.currentPlayer = 0;

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
  // Remove from hand
  const hand = gameState.hands[playerIndex];
  const cardIndex = hand.findIndex(c => c.id === card.id);
  if (cardIndex < 0) return;

  hand.splice(cardIndex, 1);

  // Add to current trick
  gameState.currentTrick.push({ player: playerIndex, card: card });

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

  // Simple AI: play lowest card (should follow suit rules in real game)
  return hand[hand.length - 1];
}

// Finish current trick
function finishTrick() {
  console.log("Trick complete:", gameState.currentTrick);

  // Determine winner (simplified - highest trump or highest card of led suit)
  let winner = gameState.currentTrick[0].player;
  let winningCard = gameState.currentTrick[0].card;

  for (let i = 1; i < gameState.currentTrick.length; i++) {
    const card = gameState.currentTrick[i].card;
    if (card.isTrump && !winningCard.isTrump) {
      winner = gameState.currentTrick[i].player;
      winningCard = card;
    } else if (card.isTrump && winningCard.isTrump && card.rank > winningCard.rank) {
      winner = gameState.currentTrick[i].player;
      winningCard = card;
    }
  }

  gameState.tricksWon[winner]++;

  const winnerName = gameState.players[winner].name;
  updateGameStatus(`${winnerName} wins the trick!`);

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

  // Calculate scores (simplified)
  const declarerTricks = gameState.tricksWon[gameState.declarer];
  const declarerWon = declarerTricks > 9;

  let baseScore = declarerWon ? 50 : -50;
  const multipliers = { 'small': 1, 'guard': 2, 'guard_without': 4, 'guard_against': 6 };
  const finalScore = baseScore * (multipliers[gameState.declarerBid] || 1);

  gameState.scores[gameState.declarer] += finalScore * 3;
  for (let i = 0; i < 4; i++) {
    if (i !== gameState.declarer) {
      gameState.scores[i] -= finalScore;
    }
  }

  // Show game over screen
  document.getElementById('game-board').classList.add('hidden');

  const scoresHTML = gameState.players.map((p, i) =>
    `<div style="margin: 8px 0;">
      <strong>${p.name}:</strong> ${gameState.scores[i]} points (${gameState.tricksWon[i]} tricks)
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
