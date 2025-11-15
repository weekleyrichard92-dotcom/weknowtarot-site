import React, { useState, useEffect } from 'react';
import { Sparkles, RotateCcw, BookOpen, Save, Share2, Moon, Brain, Clock, Star, Wand2, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { drawCards } from '../data/tarotDeck';
import { CardDrawAnimation, DeckShuffleAnimation, MysticalBackground, HandGesture } from './CardAnimation';

/**
 * CINEMATIC TAROT READER - PREMIUM VERSION
 * Inspired by Sarah's professional tarot reading video
 * Features:
 * - Atmospheric wooden table / candlelit backgrounds
 * - Magical card materialization animations
 * - AI-powered interpretations
 * - Reading history
 * - Premium vs Free tiers
 */
const TarotReaderCinematic = () => {
  const [selectedSpread, setSelectedSpread] = useState(null);
  const [drawnCards, setDrawnCards] = useState([]);
  const [isReading, setIsReading] = useState(false);
  const [readingComplete, setReadingComplete] = useState(false);
  const [aiInterpretation, setAiInterpretation] = useState(null);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [useMajorOnly, setUseMajorOnly] = useState(false);
  const [readingHistory, setReadingHistory] = useState([]);
  const [showHandGesture, setShowHandGesture] = useState(false);
  const [backgroundTheme, setBackgroundTheme] = useState('table');
  const [isPremium, setIsPremium] = useState(false); // Toggle for premium features

  // Load reading history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('tarotReadingHistory');
    if (saved) {
      setReadingHistory(JSON.parse(saved));
    }
    // Check premium status
    const premiumStatus = localStorage.getItem('isPremiumUser');
    setIsPremium(premiumStatus === 'true');
  }, []);

  const spreads = [
    {
      id: 'single',
      name: 'Single Card',
      description: 'Quick daily guidance',
      positions: ['Your Card'],
      cardCount: 1,
      free: true
    },
    {
      id: 'three',
      name: 'Three Card Spread',
      description: 'Past, Present, Future',
      positions: ['Past', 'Present', 'Future'],
      cardCount: 3,
      free: true
    },
    {
      id: 'relationship',
      name: 'Relationship Spread',
      description: 'Explore connection dynamics',
      positions: ['You', 'Them', 'The Connection', 'Outcome'],
      cardCount: 4,
      free: false,
      premium: true
    },
    {
      id: 'celtic',
      name: 'Celtic Cross',
      description: 'Comprehensive life reading',
      positions: [
        'Present Situation',
        'Challenge',
        'Past Foundation',
        'Recent Past',
        'Possible Future',
        'Near Future',
        'Your Approach',
        'External Influences',
        'Hopes/Fears',
        'Outcome'
      ],
      cardCount: 10,
      free: false,
      premium: true
    },
    {
      id: 'career',
      name: 'Career Path',
      description: 'Professional guidance',
      positions: ['Current Position', 'Obstacles', 'Opportunities', 'Advice', 'Outcome'],
      cardCount: 5,
      free: false,
      premium: true
    },
    {
      id: 'decision',
      name: 'Decision Making',
      description: 'Choose your path',
      positions: ['Situation', 'Option A', 'Option B', 'What You Need to Know', 'Best Path Forward'],
      cardCount: 5,
      free: false,
      premium: true
    },
    {
      id: 'chakra',
      name: 'Chakra Alignment',
      description: 'Energy center balance',
      positions: ['Root', 'Sacral', 'Solar Plexus', 'Heart', 'Throat', 'Third Eye', 'Crown'],
      cardCount: 7,
      free: false,
      premium: true
    },
    {
      id: 'yearahead',
      name: 'Year Ahead',
      description: 'Monthly guidance for the next year',
      positions: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      cardCount: 12,
      free: false,
      premium: true
    }
  ];

  const startReading = (spread) => {
    // Check if premium required
    if (spread.premium && !isPremium) {
      alert('This spread requires a Premium membership! Upgrade to unlock all spreads and AI interpretations.');
      return;
    }

    setSelectedSpread(spread);
    setIsReading(true);
    setReadingComplete(false);
    setAiInterpretation(null);

    // Show hand gesture animation (Sarah style!)
    setShowHandGesture(true);

    setTimeout(() => {
      setShowHandGesture(false);
      const cards = drawCards(spread.cardCount, useMajorOnly);
      setDrawnCards(cards);
      // Reading completes after all cards animate in
      setTimeout(() => {
        setReadingComplete(true);
      }, 1500 + spread.cardCount * 300);
    }, 2000);
  };

  const getAIInterpretation = async () => {
    if (!isPremium) {
      alert('AI Interpretations are a Premium feature! Upgrade to get personalized readings from our AI.');
      return;
    }

    if (!readingComplete || !drawnCards.length) return;

    setIsLoadingAI(true);

    try {
      const readingContext = {
        spread: selectedSpread.name,
        cards: drawnCards.map((card, idx) => ({
          position: selectedSpread.positions[idx],
          card: card.name,
          orientation: card.isReversed ? 'Reversed' : 'Upright',
          meaning: card.isReversed ? card.reversed : card.upright
        }))
      };

      const response = await fetch('/api/interpret-reading', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(readingContext)
      });

      if (response.ok) {
        const data = await response.json();
        setAiInterpretation(data.interpretation);
      } else {
        throw new Error('AI service unavailable');
      }
    } catch (error) {
      console.error('AI interpretation error:', error);
      setAiInterpretation({
        summary: "Our AI mystic is currently in meditation. The traditional card meanings above provide guidance for your reading.",
        insights: []
      });
    } finally {
      setIsLoadingAI(false);
    }
  };

  const resetReading = () => {
    setSelectedSpread(null);
    setDrawnCards([]);
    setIsReading(false);
    setReadingComplete(false);
    setAiInterpretation(null);
    setShowHandGesture(false);
  };

  const saveReading = () => {
    const readingData = {
      id: Date.now(),
      spread: selectedSpread.name,
      date: new Date().toISOString(),
      dateFormatted: new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      cards: drawnCards.map((card, idx) => ({
        position: selectedSpread.positions[idx],
        card: card.name,
        suit: card.suit,
        orientation: card.isReversed ? 'Reversed' : 'Upright',
        meaning: card.isReversed ? card.reversed : card.upright
      })),
      aiInterpretation: aiInterpretation
    };

    const newHistory = [readingData, ...readingHistory].slice(0, 50);
    setReadingHistory(newHistory);
    localStorage.setItem('tarotReadingHistory', JSON.stringify(newHistory));

    // Download as JSON
    const blob = new Blob([JSON.stringify(readingData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tarot-reading-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const shareReading = async () => {
    const shareText = `My Tarot Reading - ${selectedSpread.name}\n\n${drawnCards.map((card, idx) =>
      `${selectedSpread.positions[idx]}: ${card.name} (${card.isReversed ? 'Reversed' : 'Upright'})`
    ).join('\n')}\n\nFrom We Know Tarot - weknowtarot.com`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Tarot Reading - ${selectedSpread.name}`,
          text: shareText,
          url: window.location.href
        });
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      navigator.clipboard.writeText(shareText);
      alert('Reading copied to clipboard!');
    }
  };

  return (
    <MysticalBackground variant={backgroundTheme}>
      {/* Hand gesture animation (Sarah style!) */}
      <HandGesture isActive={showHandGesture} />

      {/* Header */}
      <div className="bg-black bg-opacity-40 backdrop-blur border-b border-purple-500 border-opacity-30 px-6 py-4 sticky top-0 z-40">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <Moon className="w-8 h-8 text-purple-300" />
            <div>
              <h1 className="text-2xl font-bold">Cinematic Tarot Reader</h1>
              <p className="text-xs text-purple-300">
                {isPremium ? '✨ Premium Member' : 'Free Edition'}
              </p>
            </div>
          </div>

          {!selectedSpread && (
            <div className="flex items-center gap-3 flex-wrap">
              {/* Background Theme Selector */}
              <select
                value={backgroundTheme}
                onChange={(e) => setBackgroundTheme(e.target.value)}
                className="bg-black bg-opacity-50 text-white px-3 py-2 rounded-lg border border-purple-500 border-opacity-30 text-sm"
              >
                <option value="table">Wooden Table</option>
                <option value="candles">Candlelit</option>
                <option value="night">Night Sky</option>
                <option value="starry">Starry Cosmos</option>
              </select>

              {/* Deck Option */}
              <label className="flex items-center gap-2 cursor-pointer text-sm bg-black bg-opacity-30 px-4 py-2 rounded-lg">
                <input
                  type="checkbox"
                  checked={useMajorOnly}
                  onChange={(e) => setUseMajorOnly(e.target.checked)}
                  className="w-4 h-4"
                />
                <span>Major Arcana Only</span>
              </label>

              {/* Premium Toggle (for demo) */}
              <button
                onClick={() => {
                  setIsPremium(!isPremium);
                  localStorage.setItem('isPremiumUser', (!isPremium).toString());
                }}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  isPremium
                    ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-black'
                    : 'bg-purple-600 hover:bg-purple-700 text-white'
                }`}
              >
                {isPremium ? '👑 Premium' : 'Upgrade to Premium'}
              </button>
            </div>
          )}

          {readingComplete && (
            <div className="flex gap-2 flex-wrap">
              {!aiInterpretation && (
                <button
                  onClick={getAIInterpretation}
                  disabled={isLoadingAI}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-sm disabled:opacity-50 ${
                    isPremium
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
                      : 'bg-gray-600 hover:bg-gray-700'
                  }`}
                >
                  <Brain className="w-4 h-4" />
                  {isLoadingAI ? 'Channeling...' : isPremium ? 'AI Interpretation' : 'AI (Premium)'}
                </button>
              )}
              <button
                onClick={saveReading}
                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition-colors text-sm"
              >
                <Save className="w-4 h-4" />
                Save
              </button>
              <button
                onClick={shareReading}
                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition-colors text-sm"
              >
                <Share2 className="w-4 h-4" />
                Share
              </button>
              <button
                onClick={resetReading}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg transition-colors text-sm"
              >
                <RotateCcw className="w-4 h-4" />
                New Reading
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="p-6">
        {!selectedSpread ? (
          // Spread Selection
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
                Choose Your Sacred Reading
              </h2>
              <p className="text-purple-200 mb-4">Select a spread to begin your mystical journey</p>

              {readingHistory.length > 0 && (
                <div className="flex items-center justify-center gap-2 text-sm text-purple-300">
                  <Clock className="w-4 h-4" />
                  <span>{readingHistory.length} readings in your history</span>
                </div>
              )}
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {spreads.map((spread, idx) => (
                <motion.button
                  key={spread.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  onClick={() => startReading(spread)}
                  disabled={spread.premium && !isPremium}
                  className={`bg-black bg-opacity-30 backdrop-blur rounded-xl p-6 border transition-all text-left group relative overflow-hidden ${
                    spread.premium && !isPremium
                      ? 'border-yellow-500 border-opacity-50 hover:border-opacity-80'
                      : 'border-purple-500 border-opacity-30 hover:border-opacity-60 hover:bg-opacity-40'
                  }`}
                >
                  {/* Premium badge */}
                  {spread.premium && !isPremium && (
                    <div className="absolute top-3 right-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-black text-xs font-bold px-2 py-1 rounded-full">
                      👑 PREMIUM
                    </div>
                  )}

                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold mb-2 group-hover:text-purple-300 transition-colors">
                        {spread.name}
                      </h3>
                      <p className="text-purple-200 text-sm">{spread.description}</p>
                    </div>
                    <Sparkles className="w-6 h-6 text-purple-400 group-hover:animate-pulse" />
                  </div>

                  <div className="flex items-center justify-between text-sm text-purple-300">
                    <span>{spread.cardCount} {spread.cardCount === 1 ? 'card' : 'cards'}</span>
                    <BookOpen className="w-4 h-4" />
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        ) : (
          // Reading Display
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center mb-8"
            >
              <h2 className="text-3xl font-bold mb-2">{selectedSpread.name}</h2>
              <p className="text-purple-300">{selectedSpread.description}</p>
              <p className="text-xs text-purple-400 mt-2">
                Using {useMajorOnly ? 'Major Arcana (22 cards)' : 'Full Tarot Deck (78 cards)'}
              </p>
            </motion.div>

            {!readingComplete && isReading ? (
              // Shuffling Animation (Sarah style!)
              <div className="flex flex-col items-center justify-center min-h-96">
                <DeckShuffleAnimation />
                <p className="mt-6 text-xl text-purple-200">Shuffling the cosmic deck...</p>
                <p className="text-sm text-purple-400 mt-2">The universe is preparing your message</p>
              </div>
            ) : (
              <>
                {/* Cards Display with Cinematic Animation */}
                <div className={`grid gap-6 mb-8 ${
                  drawnCards.length === 1 ? 'grid-cols-1 max-w-md mx-auto' :
                  drawnCards.length <= 3 ? 'grid-cols-1 md:grid-cols-3' :
                  drawnCards.length <= 5 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' :
                  drawnCards.length === 7 ? 'grid-cols-1 md:grid-cols-3 lg:grid-cols-4' :
                  'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                }`}>
                  {drawnCards.map((card, idx) => (
                    <CardDrawAnimation
                      key={idx}
                      card={card}
                      position={selectedSpread.positions[idx]}
                      index={idx}
                    />
                  ))}
                </div>

                {/* AI Interpretation Section */}
                {isLoadingAI && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 bg-gradient-to-r from-purple-900 to-pink-900 bg-opacity-30 backdrop-blur rounded-xl p-6 border border-purple-500 border-opacity-30 max-w-4xl mx-auto"
                  >
                    <div className="flex items-center justify-center gap-3">
                      <Brain className="w-6 h-6 text-purple-400 animate-pulse" />
                      <p className="text-lg">The AI mystic is channeling your personalized interpretation...</p>
                      <Sparkles className="w-5 h-5 text-yellow-300 animate-spin" />
                    </div>
                  </motion.div>
                )}

                {aiInterpretation && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 bg-gradient-to-r from-purple-900 to-pink-900 bg-opacity-30 backdrop-blur rounded-xl p-6 border border-purple-500 border-opacity-30 max-w-4xl mx-auto"
                  >
                    <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                      <Brain className="w-7 h-7 text-purple-400" />
                      AI-Powered Mystical Interpretation
                      <Star className="w-5 h-5 text-yellow-400" />
                    </h3>
                    <div className="prose prose-invert max-w-none">
                      <p className="text-purple-100 leading-relaxed mb-4 text-lg">
                        {typeof aiInterpretation === 'string' ? aiInterpretation : aiInterpretation.summary}
                      </p>
                      {aiInterpretation.insights && aiInterpretation.insights.length > 0 && (
                        <div className="mt-4 space-y-2">
                          <h4 className="text-lg font-semibold text-purple-300">Key Insights:</h4>
                          <ul className="space-y-2">
                            {aiInterpretation.insights.map((insight, idx) => (
                              <li key={idx} className="text-purple-100 leading-relaxed">{insight}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Reading Summary */}
                {readingComplete && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-black bg-opacity-30 backdrop-blur rounded-xl p-6 border border-purple-500 border-opacity-30 max-w-4xl mx-auto"
                  >
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <BookOpen className="w-6 h-6 text-purple-400" />
                      Reading Summary
                    </h3>
                    <div className="space-y-3 text-purple-100">
                      {drawnCards.map((card, idx) => (
                        <p key={idx} className="leading-relaxed">
                          <span className="font-semibold text-purple-300">{selectedSpread.positions[idx]}:</span>{' '}
                          The <span className="text-purple-200 font-medium">{card.name}</span> {card.isReversed ? '(Reversed)' : ''} suggests {card.isReversed ? card.reversed.toLowerCase() : card.upright.toLowerCase()}.
                        </p>
                      ))}
                    </div>
                  </motion.div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </MysticalBackground>
  );
};

export default TarotReaderCinematic;
