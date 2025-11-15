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
  const container = document.querySelector(`[data-avatar="${avatar}"]`);
  const checkmark = container.querySelector('.checkmark');

  if (index >= 0) {
    // Deselect
    selectedOpponents.splice(index, 1);
    container.classList.remove('selected');
    if (checkmark) {
      checkmark.classList.add('hidden');
    }
  } else {
    // Select (max 3)
    if (selectedOpponents.length < 3) {
      selectedOpponents.push({ avatar, name });
      container.classList.add('selected');
      if (checkmark) {
        checkmark.classList.remove('hidden');
      }
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
