import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';

/**
 * Cinematic Card Drawing Animation - Sarah Style
 *
 * Recreates the magical card materialization and placement seen in professional tarot readings
 * - Card appears from "nowhere" (materializes)
 * - Floats down to the table
 * - Flips to reveal
 * - Settles into position
 */
export const CardDrawAnimation = ({ card, position, index, onComplete }) => {
  return (
    <motion.div
      initial={{
        opacity: 0,
        scale: 0.3,
        y: -200,
        rotateY: 180,
        filter: 'blur(10px)'
      }}
      animate={{
        opacity: 1,
        scale: 1,
        y: 0,
        rotateY: card.isReversed ? 180 : 0,
        filter: 'blur(0px)'
      }}
      transition={{
        duration: 1.2,
        delay: index * 0.3,
        ease: [0.22, 1, 0.36, 1], // Custom easing for magical feel
        opacity: { duration: 0.6 },
        scale: { duration: 0.8 },
        y: { duration: 1.2, ease: "easeOut" },
        rotateY: { duration: 0.8, delay: index * 0.3 + 0.6 }
      }}
      onAnimationComplete={onComplete}
      className="relative"
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px'
      }}
    >
      {/* Magical glow effect */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: [0, 0.6, 0], scale: [0.8, 1.4, 1] }}
        transition={{
          duration: 1.5,
          delay: index * 0.3,
          times: [0, 0.5, 1]
        }}
        className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl blur-xl -z-10"
      />

      {/* Sparkle particles */}
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.8, delay: index * 0.3 + 0.4 }}
        className="absolute top-0 right-0 -translate-y-4 translate-x-4"
      >
        <Sparkles className="w-6 h-6 text-yellow-300" />
      </motion.div>

      {/* The actual card */}
      <div className="bg-black bg-opacity-40 backdrop-blur rounded-xl p-6 border border-purple-500 border-opacity-30 shadow-2xl">
        <div className="text-center mb-4">
          <div className="inline-block bg-purple-600 bg-opacity-30 px-4 py-1 rounded-full text-sm text-purple-200 mb-3">
            {position}
          </div>
          <div className={`text-6xl mb-3 transition-transform duration-700`}>
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
    </motion.div>
  );
};

/**
 * Deck Shuffle Animation
 * The deck shuffling before drawing
 */
export const DeckShuffleAnimation = () => {
  return (
    <div className="relative w-32 h-48">
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          initial={{
            x: 0,
            y: 0,
            rotate: 0,
            opacity: 1 - i * 0.15
          }}
          animate={{
            x: [0, Math.random() * 30 - 15, 0],
            y: [0, Math.random() * 20 - 10, 0],
            rotate: [0, Math.random() * 10 - 5, 0],
          }}
          transition={{
            duration: 0.5,
            delay: i * 0.1,
            repeat: 3,
            repeatType: "reverse"
          }}
          className="absolute inset-0 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg shadow-xl"
          style={{
            zIndex: 5 - i,
            transform: `translateY(${i * 2}px) translateX(${i * 2}px)`,
          }}
        />
      ))}
      <motion.div
        animate={{
          scale: [1, 1.05, 1],
          rotate: [0, 2, -2, 0]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse"
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      >
        <Sparkles className="w-12 h-12 text-yellow-300" />
      </motion.div>
    </div>
  );
};

/**
 * Card Back (for face-down cards)
 */
export const CardBack = ({ className = "" }) => {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg" />
      <div className="absolute inset-2 bg-gradient-to-br from-indigo-900 to-purple-900 rounded-lg flex items-center justify-center">
        <div className="text-yellow-300 text-4xl">✧</div>
      </div>
    </div>
  );
};

/**
 * Atmospheric Background Component
 * Sarah-style wooden table with candles and mystical ambiance
 */
export const MysticalBackground = ({ children, variant = "table" }) => {
  const backgrounds = {
    table: "bg-gradient-to-br from-amber-950 via-stone-900 to-slate-900",
    night: "bg-gradient-to-br from-indigo-950 via-purple-950 to-indigo-900",
    starry: "bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950",
    candles: "bg-gradient-to-br from-amber-900 via-orange-950 to-stone-900"
  };

  return (
    <div className={`min-h-screen relative ${backgrounds[variant]} overflow-hidden`}>
      {/* Ambient light particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{
              opacity: 0,
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight
            }}
            animate={{
              opacity: [0, 0.3, 0],
              scale: [0.5, 1, 0.5],
              y: [
                Math.random() * window.innerHeight,
                Math.random() * window.innerHeight - 200
              ]
            }}
            transition={{
              duration: 5 + Math.random() * 5,
              repeat: Infinity,
              delay: Math.random() * 5
            }}
            className="absolute w-2 h-2 bg-yellow-300 rounded-full blur-sm"
          />
        ))}
      </div>

      {/* Candle glow effects (optional) */}
      {variant === "candles" && (
        <>
          <motion.div
            animate={{
              opacity: [0.3, 0.6, 0.3],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse"
            }}
            className="absolute top-20 right-20 w-64 h-64 bg-orange-500 rounded-full blur-3xl opacity-30"
          />
          <motion.div
            animate={{
              opacity: [0.2, 0.5, 0.2],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              repeatType: "reverse",
              delay: 1
            }}
            className="absolute bottom-32 left-32 w-48 h-48 bg-amber-500 rounded-full blur-3xl opacity-20"
          />
        </>
      )}

      {/* Content */}
      {children}
    </div>
  );
};

/**
 * Hand Gesture Component (optional enhancement)
 * Shows a stylized hand reaching to draw a card
 */
export const HandGesture = ({ isActive }) => {
  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          transition={{ duration: 0.8 }}
          className="absolute top-1/2 left-1/4 -translate-y-1/2 pointer-events-none z-50"
        >
          <motion.div
            animate={{
              rotate: [0, 5, -5, 0],
              y: [0, -10, 0]
            }}
            transition={{
              duration: 2,
              repeat: 2,
              repeatType: "reverse"
            }}
            className="text-9xl filter drop-shadow-2xl"
          >
            🖐️
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 1, 0], scale: [0, 1.5, 0] }}
            transition={{ duration: 1.5, delay: 0.5 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <Sparkles className="w-16 h-16 text-yellow-300" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CardDrawAnimation;
