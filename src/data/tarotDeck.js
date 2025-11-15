// Complete 78-card Tarot Deck
export const tarotDeck = {
  majorArcana: [
    { num: 0, name: 'The Fool', upright: 'New beginnings, innocence, spontaneity, free spirit', reversed: 'Recklessness, taken advantage of, inconsideration', image: '🌟', suit: 'major' },
    { num: 1, name: 'The Magician', upright: 'Manifestation, resourcefulness, power, inspired action', reversed: 'Manipulation, poor planning, untapped talents', image: '✨', suit: 'major' },
    { num: 2, name: 'The High Priestess', upright: 'Intuition, sacred knowledge, divine feminine, subconscious', reversed: 'Secrets, disconnected from intuition, withdrawal', image: '🌙', suit: 'major' },
    { num: 3, name: 'The Empress', upright: 'Femininity, beauty, nature, nurturing, abundance', reversed: 'Creative block, dependence on others, emptiness', image: '👑', suit: 'major' },
    { num: 4, name: 'The Emperor', upright: 'Authority, establishment, structure, father figure', reversed: 'Domination, excessive control, lack of discipline', image: '⚔️', suit: 'major' },
    { num: 5, name: 'The Hierophant', upright: 'Spiritual wisdom, religious beliefs, conformity, tradition', reversed: 'Personal beliefs, freedom, challenging the status quo', image: '📿', suit: 'major' },
    { num: 6, name: 'The Lovers', upright: 'Love, harmony, relationships, values alignment, choices', reversed: 'Self-love, disharmony, imbalance, misalignment', image: '💕', suit: 'major' },
    { num: 7, name: 'The Chariot', upright: 'Control, willpower, success, action, determination', reversed: 'Self-discipline, opposition, lack of direction', image: '🏇', suit: 'major' },
    { num: 8, name: 'Strength', upright: 'Strength, courage, persuasion, influence, compassion', reversed: 'Inner strength, self-doubt, low energy, raw emotion', image: '🦁', suit: 'major' },
    { num: 9, name: 'The Hermit', upright: 'Soul searching, introspection, being alone, inner guidance', reversed: 'Isolation, loneliness, withdrawal from loved ones', image: '🕯️', suit: 'major' },
    { num: 10, name: 'Wheel of Fortune', upright: 'Good luck, karma, life cycles, destiny, turning point', reversed: 'Bad luck, resistance to change, breaking cycles', image: '🎡', suit: 'major' },
    { num: 11, name: 'Justice', upright: 'Justice, fairness, truth, cause and effect, law', reversed: 'Unfairness, lack of accountability, dishonesty', image: '⚖️', suit: 'major' },
    { num: 12, name: 'The Hanged Man', upright: 'Pause, surrender, letting go, new perspectives', reversed: 'Delays, resistance, stalling, indecision', image: '🙃', suit: 'major' },
    { num: 13, name: 'Death', upright: 'Endings, change, transformation, transition', reversed: 'Resistance to change, personal transformation, inner purging', image: '🦋', suit: 'major' },
    { num: 14, name: 'Temperance', upright: 'Balance, moderation, patience, purpose, meaning', reversed: 'Imbalance, excess, self-healing, realignment', image: '🌊', suit: 'major' },
    { num: 15, name: 'The Devil', upright: 'Shadow self, attachment, addiction, restriction, sexuality', reversed: 'Releasing limiting beliefs, exploring dark thoughts, detachment', image: '😈', suit: 'major' },
    { num: 16, name: 'The Tower', upright: 'Sudden change, upheaval, chaos, revelation, awakening', reversed: 'Personal transformation, fear of change, averting disaster', image: '⚡', suit: 'major' },
    { num: 17, name: 'The Star', upright: 'Hope, faith, purpose, renewal, spirituality', reversed: 'Lack of faith, despair, self-trust, disconnection', image: '⭐', suit: 'major' },
    { num: 18, name: 'The Moon', upright: 'Illusion, fear, anxiety, subconscious, intuition', reversed: 'Release of fear, repressed emotion, inner confusion', image: '🌕', suit: 'major' },
    { num: 19, name: 'The Sun', upright: 'Positivity, fun, warmth, success, vitality', reversed: 'Inner child, feeling down, overly optimistic', image: '☀️', suit: 'major' },
    { num: 20, name: 'Judgement', upright: 'Judgement, rebirth, inner calling, absolution', reversed: 'Self-doubt, inner critic, ignoring the call', image: '📯', suit: 'major' },
    { num: 21, name: 'The World', upright: 'Completion, accomplishment, travel, fulfilment', reversed: 'Seeking personal closure, short-cuts, delays', image: '🌍', suit: 'major' }
  ],

  wands: [
    { num: 1, name: 'Ace of Wands', upright: 'Inspiration, new opportunities, growth, potential', reversed: 'Delays, lack of motivation, weighed down', image: '🔥', suit: 'wands' },
    { num: 2, name: 'Two of Wands', upright: 'Planning, making decisions, leaving comfort zone', reversed: 'Fear of change, playing it safe, bad planning', image: '🌍', suit: 'wands' },
    { num: 3, name: 'Three of Wands', upright: 'Progress, expansion, foresight, overseas opportunities', reversed: 'Playing small, lack of foresight, unexpected delays', image: '⛵', suit: 'wands' },
    { num: 4, name: 'Four of Wands', upright: 'Celebration, joy, harmony, relaxation, homecoming', reversed: 'Personal celebration, inner harmony, conflict with others', image: '🎉', suit: 'wands' },
    { num: 5, name: 'Five of Wands', upright: 'Conflict, disagreements, competition, tension', reversed: 'Inner conflict, avoiding conflict, releasing tension', image: '⚔️', suit: 'wands' },
    { num: 6, name: 'Six of Wands', upright: 'Success, public recognition, progress, self-confidence', reversed: 'Private achievement, self-doubt, lack of recognition', image: '🏆', suit: 'wands' },
    { num: 7, name: 'Seven of Wands', upright: 'Challenge, competition, perseverance, defensive', reversed: 'Exhaustion, giving up, overwhelmed', image: '🛡️', suit: 'wands' },
    { num: 8, name: 'Eight of Wands', upright: 'Movement, fast paced change, action, alignment', reversed: 'Delays, frustration, resisting change', image: '💨', suit: 'wands' },
    { num: 9, name: 'Nine of Wands', upright: 'Resilience, courage, persistence, test of faith', reversed: 'Inner resources, struggle, overwhelm, paranoia', image: '💪', suit: 'wands' },
    { num: 10, name: 'Ten of Wands', upright: 'Burden, extra responsibility, hard work, stress', reversed: 'Doing it all, release, delegation, prioritization', image: '📚', suit: 'wands' },
    { num: 11, name: 'Page of Wands', upright: 'Exploration, excitement, freedom, new ideas', reversed: 'Lack of direction, procrastination, creating conflict', image: '🌱', suit: 'wands' },
    { num: 12, name: 'Knight of Wands', upright: 'Energy, passion, inspired action, adventure, impulsiveness', reversed: 'Passion project, haste, scattered energy, delays', image: '🐎', suit: 'wands' },
    { num: 13, name: 'Queen of Wands', upright: 'Courage, determination, joy, charisma, independence', reversed: 'Selfishness, jealousy, insecurity, demanding', image: '👸', suit: 'wands' },
    { num: 14, name: 'King of Wands', upright: 'Natural leader, vision, entrepreneur, honour, boldness', reversed: 'Impulsiveness, haste, ruthless, high expectations', image: '🤴', suit: 'wands' }
  ],

  cups: [
    { num: 1, name: 'Ace of Cups', upright: 'Love, new relationships, compassion, creativity', reversed: 'Self-love, intuition, repressed emotions', image: '💖', suit: 'cups' },
    { num: 2, name: 'Two of Cups', upright: 'Unified love, partnership, mutual attraction, connection', reversed: 'Self-love, break-ups, disharmony, imbalance', image: '💑', suit: 'cups' },
    { num: 3, name: 'Three of Cups', upright: 'Celebration, friendship, creativity, collaboration', reversed: 'Independence, alone time, hardcore partying', image: '🥂', suit: 'cups' },
    { num: 4, name: 'Four of Cups', upright: 'Meditation, contemplation, apathy, reevaluation', reversed: 'Retreat, withdrawal, checking in for alignment', image: '🧘', suit: 'cups' },
    { num: 5, name: 'Five of Cups', upright: 'Regret, failure, disappointment, pessimism, loss', reversed: 'Personal setbacks, self-forgiveness, moving on', image: '😢', suit: 'cups' },
    { num: 6, name: 'Six of Cups', upright: 'Revisiting the past, childhood memories, innocence, joy', reversed: 'Living in the past, forgiveness, lacking playfulness', image: '🎠', suit: 'cups' },
    { num: 7, name: 'Seven of Cups', upright: 'Opportunities, choices, wishful thinking, illusion', reversed: 'Alignment, personal values, overwhelmed by choices', image: '☁️', suit: 'cups' },
    { num: 8, name: 'Eight of Cups', upright: 'Disappointment, abandonment, withdrawal, escapism', reversed: 'Trying one more time, indecision, aimless drifting', image: '🌙', suit: 'cups' },
    { num: 9, name: 'Nine of Cups', upright: 'Contentment, satisfaction, gratitude, wish come true', reversed: 'Inner happiness, materialism, dissatisfaction', image: '😊', suit: 'cups' },
    { num: 10, name: 'Ten of Cups', upright: 'Divine love, blissful relationships, harmony, alignment', reversed: 'Disconnection, misaligned values, struggling relationships', image: '🌈', suit: 'cups' },
    { num: 11, name: 'Page of Cups', upright: 'Creative opportunities, intuitive messages, curiosity', reversed: 'New ideas, doubting intuition, creative blocks', image: '🐠', suit: 'cups' },
    { num: 12, name: 'Knight of Cups', upright: 'Romance, charm, imagination, idealism, following the heart', reversed: 'Overactive imagination, unrealistic, jealous, moody', image: '🎭', suit: 'cups' },
    { num: 13, name: 'Queen of Cups', upright: 'Compassion, calm, comfort, intuitive, supportive', reversed: 'Martyrdom, insecurity, dependence, giving too much', image: '🌸', suit: 'cups' },
    { num: 14, name: 'King of Cups', upright: 'Emotionally balanced, compassionate, diplomatic, wisdom', reversed: 'Self-compassion, inner feelings, moodiness, emotionally manipulative', image: '🧙', suit: 'cups' }
  ],

  swords: [
    { num: 1, name: 'Ace of Swords', upright: 'Breakthroughs, new ideas, mental clarity, success', reversed: 'Inner clarity, re-thinking, clouded judgement', image: '⚔️', suit: 'swords' },
    { num: 2, name: 'Two of Swords', upright: 'Difficult decisions, weighing options, stalemate, avoidance', reversed: 'Indecision, confusion, information overload', image: '🤝', suit: 'swords' },
    { num: 3, name: 'Three of Swords', upright: 'Heartbreak, emotional pain, sorrow, grief, hurt', reversed: 'Negative self-talk, releasing pain, optimism, forgiveness', image: '💔', suit: 'swords' },
    { num: 4, name: 'Four of Swords', upright: 'Rest, relaxation, meditation, contemplation, recuperation', reversed: 'Exhaustion, burn-out, deep contemplation, stagnation', image: '😴', suit: 'swords' },
    { num: 5, name: 'Five of Swords', upright: 'Conflict, disagreements, competition, defeat, winning at all costs', reversed: 'Reconciliation, making amends, past resentment', image: '🗡️', suit: 'swords' },
    { num: 6, name: 'Six of Swords', upright: 'Transition, change, rite of passage, releasing baggage', reversed: 'Personal transition, resistance to change, unfinished business', image: '⛵', suit: 'swords' },
    { num: 7, name: 'Seven of Swords', upright: 'Betrayal, deception, getting away with something, strategy', reversed: 'Imposter syndrome, self-deceit, keeping secrets', image: '🥷', suit: 'swords' },
    { num: 8, name: 'Eight of Swords', upright: 'Negative thoughts, self-imposed restriction, imprisonment, victim mentality', reversed: 'Self-limiting beliefs, inner critic, releasing negative thoughts', image: '🪢', suit: 'swords' },
    { num: 9, name: 'Nine of Swords', upright: 'Anxiety, worry, fear, depression, nightmares', reversed: 'Inner turmoil, deep-seated fears, secrets, releasing worry', image: '😰', suit: 'swords' },
    { num: 10, name: 'Ten of Swords', upright: 'Painful endings, deep wounds, betrayal, loss, crisis', reversed: 'Recovery, regeneration, resisting inevitable end', image: '💀', suit: 'swords' },
    { num: 11, name: 'Page of Swords', upright: 'New ideas, curiosity, thirst for knowledge, new ways of communicating', reversed: 'Self-expression, all talk and no action, haphazard action', image: '📚', suit: 'swords' },
    { num: 12, name: 'Knight of Swords', upright: 'Ambitious, action-oriented, driven to succeed, fast-thinking', reversed: 'Restless, unfocused, impulsive, burn-out', image: '🐉', suit: 'swords' },
    { num: 13, name: 'Queen of Swords', upright: 'Independent, unbiased judgement, clear boundaries, direct communication', reversed: 'Overly-emotional, easily influenced, bitchy, cold-hearted', image: '🦅', suit: 'swords' },
    { num: 14, name: 'King of Swords', upright: 'Mental clarity, intellectual power, authority, truth', reversed: 'Quiet power, inner truth, misuse of power, manipulation', image: '🗿', suit: 'swords' }
  ],

  pentacles: [
    { num: 1, name: 'Ace of Pentacles', upright: 'New financial opportunity, manifestation, abundance, prosperity', reversed: 'Lost opportunity, lack of planning, scarcity mindset', image: '💰', suit: 'pentacles' },
    { num: 2, name: 'Two of Pentacles', upright: 'Multiple priorities, time management, prioritization, adaptability', reversed: 'Over-committed, disorganization, reprioritization', image: '⚖️', suit: 'pentacles' },
    { num: 3, name: 'Three of Pentacles', upright: 'Teamwork, collaboration, learning, implementation', reversed: 'Disharmony, misalignment, working alone', image: '🏗️', suit: 'pentacles' },
    { num: 4, name: 'Four of Pentacles', upright: 'Saving money, security, conservatism, scarcity, control', reversed: 'Over-spending, greed, self-protection', image: '💎', suit: 'pentacles' },
    { num: 5, name: 'Five of Pentacles', upright: 'Financial loss, poverty, lack mindset, isolation, worry', reversed: 'Recovery from financial loss, spiritual poverty', image: '🥶', suit: 'pentacles' },
    { num: 6, name: 'Six of Pentacles', upright: 'Giving, receiving, sharing wealth, generosity, charity', reversed: 'Self-care, unpaid debts, one-sided charity', image: '🤲', suit: 'pentacles' },
    { num: 7, name: 'Seven of Pentacles', upright: 'Long-term view, sustainable results, perseverance, investment', reversed: 'Lack of long-term vision, limited success, distractions', image: '🌳', suit: 'pentacles' },
    { num: 8, name: 'Eight of Pentacles', upright: 'Apprenticeship, repetitive tasks, mastery, skill development', reversed: 'Self-development, perfectionism, misdirected activity', image: '🔨', suit: 'pentacles' },
    { num: 9, name: 'Nine of Pentacles', upright: 'Abundance, luxury, self-sufficiency, financial independence', reversed: 'Self-worth, over-investment in work, hustling', image: '🏡', suit: 'pentacles' },
    { num: 10, name: 'Ten of Pentacles', upright: 'Wealth, financial security, family, long-term success, legacy', reversed: 'The dark side of wealth, family disputes, financial instability', image: '🏰', suit: 'pentacles' },
    { num: 11, name: 'Page of Pentacles', upright: 'Manifestation, financial opportunity, skill development, new job', reversed: 'Lack of progress, procrastination, learn from failure', image: '🌱', suit: 'pentacles' },
    { num: 12, name: 'Knight of Pentacles', upright: 'Hard work, productivity, routine, conservatism, responsibility', reversed: 'Self-discipline, boredom, feeling stuck, perfectionism', image: '🐢', suit: 'pentacles' },
    { num: 13, name: 'Queen of Pentacles', upright: 'Practical, nurturing, providing financially, business woman, warmth', reversed: 'Financial independence, self-care, work-home conflict', image: '🌺', suit: 'pentacles' },
    { num: 14, name: 'King of Pentacles', upright: 'Wealth, business, leadership, security, discipline, abundance', reversed: 'Financially inept, obsessed with wealth, stubborn', image: '👑', suit: 'pentacles' }
  ]
};

// Helper function to get the full deck
export const getFullDeck = () => {
  return [
    ...tarotDeck.majorArcana,
    ...tarotDeck.wands,
    ...tarotDeck.cups,
    ...tarotDeck.swords,
    ...tarotDeck.pentacles
  ];
};

// Helper function to shuffle deck
export const shuffleDeck = (deck) => {
  return [...deck].sort(() => Math.random() - 0.5);
};

// Helper function to draw cards
export const drawCards = (count, useMajorOnly = false) => {
  const deck = useMajorOnly ? tarotDeck.majorArcana : getFullDeck();
  const shuffled = shuffleDeck(deck);
  return shuffled.slice(0, count).map(card => ({
    ...card,
    isReversed: Math.random() < 0.3 // 30% chance of reversed
  }));
};

export default tarotDeck;
