import React, { useState, useEffect } from 'react';
import { Sparkles, RotateCcw, BookOpen, Save, Share2, Moon, Brain, Clock, Star } from 'lucide-react';
import { drawCards } from '../data/tarotDeck';

const TarotReader = () => {
  const [selectedSpread, setSelectedSpread] = useState(null);
  const [drawnCards, setDrawnCards] = useState([]);
  const [isReading, setIsReading] = useState(false);
  const [readingComplete, setReadingComplete] = useState(false);
  const [aiInterpretation, setAiInterpretation] = useState(null);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [useMajorOnly, setUseMajorOnly] = useState(false);
  const [readingHistory, setReadingHistory] = useState([]);

  // Load reading history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('tarotReadingHistory');
    if (saved) {
      setReadingHistory(JSON.parse(saved));
    }
  }, []);

  const spreads = [
    {
      id: 'single',
      name: 'Single Card',
      description: 'Quick daily guidance',
      positions: ['Your Card'],
      cardCount: 1
    },
    {
      id: 'three',
      name: 'Three Card Spread',
      description: 'Past, Present, Future',
      positions: ['Past', 'Present', 'Future'],
      cardCount: 3
    },
    {
      id: 'relationship',
      name: 'Relationship Spread',
      description: 'Explore connection dynamics',
      positions: ['You', 'Them', 'The Connection', 'Outcome'],
      cardCount: 4
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
      cardCount: 10
    },
    {
      id: 'career',
      name: 'Career Path',
      description: 'Professional guidance',
      positions: ['Current Position', 'Obstacles', 'Opportunities', 'Advice', 'Outcome'],
      cardCount: 5
    },
    {
      id: 'decision',
      name: 'Decision Making',
      description: 'Choose your path',
      positions: ['Situation', 'Option A', 'Option B', 'What You Need to Know', 'Best Path Forward'],
      cardCount: 5
    },
    {
      id: 'chakra',
      name: 'Chakra Alignment',
      description: 'Energy center balance',
      positions: ['Root', 'Sacral', 'Solar Plexus', 'Heart', 'Throat', 'Third Eye', 'Crown'],
      cardCount: 7
    },
    {
      id: 'yearahead',
      name: 'Year Ahead',
      description: 'Monthly guidance for the next year',
      positions: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      cardCount: 12
    }
  ];

  const startReading = (spread) => {
    setSelectedSpread(spread);
    setIsReading(true);
    setReadingComplete(false);
    setAiInterpretation(null);

    setTimeout(() => {
      const cards = drawCards(spread.cardCount, useMajorOnly);
      setDrawnCards(cards);
      setReadingComplete(true);
    }, 1500);
  };

  const getAIInterpretation = async () => {
    if (!readingComplete || !drawnCards.length) return;

    setIsLoadingAI(true);

    try {
      // Prepare reading context for AI
      const readingContext = {
        spread: selectedSpread.name,
        cards: drawnCards.map((card, idx) => ({
          position: selectedSpread.positions[idx],
          card: card.name,
          orientation: card.isReversed ? 'Reversed' : 'Upright',
          meaning: card.isReversed ? card.reversed : card.upright
        }))
      };

      // Call backend AI service
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
        summary: "AI interpretation is currently unavailable. The traditional card meanings above provide guidance for your reading.",
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

    // Save to history
    const newHistory = [readingData, ...readingHistory].slice(0, 50); // Keep last 50 readings
    setReadingHistory(newHistory);
    localStorage.setItem('tarotReadingHistory', JSON.stringify(newHistory));

    // Also download as JSON
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
    ).join('\n')}\n\nFrom We Know Tarot`;

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
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(shareText);
      alert('Reading copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-indigo-900 text-white">
      {/* Header */}
      <div className="bg-black bg-opacity-40 backdrop-blur border-b border-purple-500 border-opacity-30 px-6 py-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <Moon className="w-8 h-8 text-purple-300" />
            <div>
              <h1 className="text-2xl font-bold">Professional Tarot Reader</h1>
              <p className="text-xs text-purple-300">Powered by We Know Tarot</p>
            </div>
          </div>

          {!selectedSpread && (
            <div className="flex items-center gap-3 bg-black bg-opacity-30 px-4 py-2 rounded-lg">
              <label className="flex items-center gap-2 cursor-pointer text-sm">
                <input
                  type="checkbox"
                  checked={useMajorOnly}
                  onChange={(e) => setUseMajorOnly(e.target.checked)}
                  className="w-4 h-4"
                />
                <span>Major Arcana Only (22 cards)</span>
              </label>
              {!useMajorOnly && (
                <span className="text-xs text-purple-300 ml-2">Full deck: 78 cards</span>
              )}
            </div>
          )}

          {readingComplete && (
            <div className="flex gap-2 flex-wrap">
              {!aiInterpretation && (
                <button
                  onClick={getAIInterpretation}
                  disabled={isLoadingAI}
                  className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-4 py-2 rounded-lg transition-colors text-sm disabled:opacity-50"
                >
                  <Brain className="w-4 h-4" />
                  {isLoadingAI ? 'Channeling...' : 'AI Interpretation'}
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
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
                Choose Your Reading
              </h2>
              <p className="text-purple-200 mb-4">Select a spread to begin your tarot journey</p>

              {readingHistory.length > 0 && (
                <div className="flex items-center justify-center gap-2 text-sm text-purple-300">
                  <Clock className="w-4 h-4" />
                  <span>{readingHistory.length} readings in your history</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {spreads.map(spread => (
                <button
                  key={spread.id}
                  onClick={() => startReading(spread)}
                  className="bg-black bg-opacity-30 backdrop-blur rounded-xl p-6 border border-purple-500 border-opacity-30 hover:border-opacity-60 hover:bg-opacity-40 transition-all text-left group"
                >
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
                </button>
              ))}
            </div>
          </div>
        ) : (
          // Reading Display
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2">{selectedSpread.name}</h2>
              <p className="text-purple-300">{selectedSpread.description}</p>
              <p className="text-xs text-purple-400 mt-2">
                Using {useMajorOnly ? 'Major Arcana (22 cards)' : 'Full Tarot Deck (78 cards)'}
              </p>
            </div>

            {!readingComplete ? (
              // Drawing Animation
              <div className="flex flex-col items-center justify-center min-h-96">
                <div className="relative">
                  <div className="w-32 h-48 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg animate-pulse shadow-2xl shadow-purple-500/50" />
                  <Sparkles className="w-12 h-12 text-yellow-300 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-spin" />
                </div>
                <p className="mt-6 text-xl text-purple-200">Shuffling the cosmic deck...</p>
                <p className="text-sm text-purple-400 mt-2">Drawing your cards from the universe</p>
              </div>
            ) : (
              <>
                {/* Cards Display */}
                <div className={`grid gap-6 mb-8 ${
                  drawnCards.length === 1 ? 'grid-cols-1 max-w-md mx-auto' :
                  drawnCards.length <= 3 ? 'grid-cols-1 md:grid-cols-3' :
                  drawnCards.length <= 5 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' :
                  drawnCards.length === 7 ? 'grid-cols-1 md:grid-cols-3 lg:grid-cols-4' :
                  'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                }`}>
                  {drawnCards.map((card, idx) => (
                    <div
                      key={idx}
                      className="bg-black bg-opacity-40 backdrop-blur rounded-xl p-6 border border-purple-500 border-opacity-30 transform hover:scale-105 transition-all animate-fade-in"
                      style={{ animationDelay: `${idx * 0.1}s` }}
                    >
                      <div className="text-center mb-4">
                        <div className="inline-block bg-purple-600 bg-opacity-30 px-4 py-1 rounded-full text-sm text-purple-200 mb-3">
                          {selectedSpread.positions[idx]}
                        </div>
                        <div className={`text-6xl mb-3 transition-transform duration-700 ${card.isReversed ? 'rotate-180' : ''}`}>
                          {card.image}
                        </div>
                        <h3 className="text-2xl font-bold mb-1">{card.name}</h3>
                        <p className="text-xs text-purple-400 mb-1 capitalize">{card.suit}</p>
                        <p className={`text-sm font-medium ${card.isReversed ? 'text-red-400' : 'text-green-400'}`}>
                          {card.isReversed ? 'Reversed' : 'Upright'}
                        </p>
                      </div>

                      <div className="border-t border-purple-500 border-opacity-30 pt-4">
                        <h4 className="text-sm font-bold text-purple-300 mb-2">Meaning:</h4>
                        <p className="text-sm text-purple-100 leading-relaxed">
                          {card.isReversed ? card.reversed : card.upright}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* AI Interpretation Section */}
                {isLoadingAI && (
                  <div className="mb-8 bg-gradient-to-r from-purple-900 to-pink-900 bg-opacity-30 backdrop-blur rounded-xl p-6 border border-purple-500 border-opacity-30 max-w-4xl mx-auto">
                    <div className="flex items-center justify-center gap-3">
                      <Brain className="w-6 h-6 text-purple-400 animate-pulse" />
                      <p className="text-lg">AI is channeling a personalized interpretation...</p>
                      <Sparkles className="w-5 h-5 text-yellow-300 animate-spin" />
                    </div>
                  </div>
                )}

                {aiInterpretation && (
                  <div className="mb-8 bg-gradient-to-r from-purple-900 to-pink-900 bg-opacity-30 backdrop-blur rounded-xl p-6 border border-purple-500 border-opacity-30 max-w-4xl mx-auto">
                    <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                      <Brain className="w-7 h-7 text-purple-400" />
                      AI-Powered Interpretation
                      <Star className="w-5 h-5 text-yellow-400" />
                    </h3>
                    <div className="prose prose-invert max-w-none">
                      <p className="text-purple-100 leading-relaxed mb-4 text-lg">
                        {aiInterpretation.summary || aiInterpretation}
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
                  </div>
                )}

                {/* Reading Summary */}
                <div className="bg-black bg-opacity-30 backdrop-blur rounded-xl p-6 border border-purple-500 border-opacity-30 max-w-4xl mx-auto">
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
                </div>
              </>
            )}
          </div>
        )}
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
};

export default TarotReader;
