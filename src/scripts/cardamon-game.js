// Cardamon Tarot Game - French Tarot trick-taking game
// Based on the import4.py Python implementation

let selectedDeck = '';
let gameState = null;

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
    // Different decks have different naming conventions
    if (selectedDeck === 'hippie_tarot') {
      // hippie_tarot uses: queen_swords.png (rank_suit)
      return `/tarot-reader/assets/cards/${selectedDeck}/${rank}_${suit}.png`;
    } else {
      // best_simple uses: swords_queen.png (suit_rank)
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

  gameState = {
    players: [
      { name: 'You', hand: [], tricks: 0, score: 0, isHuman: true, position: 'bottom' },
      { name: 'Moses', hand: [], tricks: 0, score: 0, isHuman: false, position: 'top' },
      { name: 'Lady Book', hand: [], tricks: 0, score: 0, isHuman: false, position: 'left' },
      { name: 'Old Man', hand: [], tricks: 0, score: 0, isHuman: false, position: 'right' }
    ],
    dog: [],
    currentTrick: [],
    trickLeader: 0,
    currentPlayer: 0,
    trickNumber: 0,
    takerIndex: -1,
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

  // Simple bidding: each AI makes a random bid
  for (let i = 0; i < gameState.players.length; i++) {
    const player = gameState.players[i];
    let bid = 0;

    if (!player.isHuman) {
      // AI bids based on trump count
      const trumpCount = player.hand.filter(c => c.isTrump).length;
      bid = trumpCount > 10 ? Math.floor(Math.random() * 3) + 1 : 0;
    } else {
      // For now, human always passes (bid 0)
      bid = 0;
    }

    if (bid > highestBid) {
      highestBid = bid;
      highestBidder = i;
    }
  }

  gameState.takerIndex = highestBidder;

  if (highestBidder >= 0) {
    updateStatus(`${gameState.players[highestBidder].name} won the bid!`);

    // Give dog to the taker
    gameState.players[highestBidder].hand.push(...gameState.dog);
    sortHand(gameState.players[highestBidder].hand);

    await sleep(1500);
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
    // Leading: can play any card
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

    // Add click handlers to legal cards
    const handElement = document.getElementById('player-hand');
    const cardElements = handElement.children;

    for (let i = 0; i < cardElements.length; i++) {
      const cardElement = cardElements[i];
      const card = player.hand[i];

      if (legalCards.includes(card)) {
        cardElement.style.opacity = '1';
        cardElement.style.cursor = 'pointer';
        cardElement.onclick = () => {
          player.hand.splice(i, 1);
          gameState.currentTrick.push({ card, playerIndex: 0 });

          // Remove click handlers
          for (let el of cardElements) {
            el.onclick = null;
            el.style.opacity = '1';
          }

          resolve();
        };
      } else {
        cardElement.style.opacity = '0.5';
        cardElement.style.cursor = 'not-allowed';
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

// Update UI
function updateUI() {
  // Update player hand
  const handElement = document.getElementById('player-hand');
  handElement.innerHTML = '';

  gameState.players[0].hand.forEach(card => {
    const img = document.createElement('img');
    img.src = card.image;
    img.className = 'card-in-hand';
    img.alt = `${card.rank} of ${card.suit}`;
    handElement.appendChild(img);
  });

  // Update card counts
  gameState.players.forEach((player, i) => {
    const countEl = document.getElementById(`player-${player.position}-cards`);
    if (countEl) {
      countEl.textContent = `${player.hand.length} cards`;
    }
  });

  // Update trick area
  updateTrickArea();
}

// Update cards on the table
function updateTrickArea() {
  ['top', 'left', 'right', 'bottom'].forEach(pos => {
    const el = document.getElementById(`card-${pos}`);
    el.innerHTML = '';
  });

  gameState.currentTrick.forEach(play => {
    const player = gameState.players[play.playerIndex];
    const el = document.getElementById(`card-${player.position}`);

    const img = document.createElement('img');
    img.src = play.card.image;
    img.className = 'card-on-table';
    img.alt = `${play.card.rank} of ${play.card.suit}`;
    el.appendChild(img);
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
