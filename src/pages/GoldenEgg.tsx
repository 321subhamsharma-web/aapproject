import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Trophy, BookOpen, Sparkles } from 'lucide-react';
import { useApp, gameRewards, mockUsers, Reward } from '../context/AppContext';

export function GoldenEggScreen() {
  const { state, dispatch } = useApp();
  const [isSmashing, setIsSmashing] = useState(false);
  const [showReward, setShowReward] = useState<Reward | null>(null);
  const [showRules, setShowRules] = useState(false);
  const [showWinners, setShowWinners] = useState(false);
  const [eggCracks, setEggCracks] = useState(0);
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; emoji: string }[]>([]);

  const getRandomReward = useCallback((): Reward => {
    const rand = Math.random();
    if (rand < 0.4) return gameRewards[0]; // Common - Coins
    if (rand < 0.65) return gameRewards[Math.floor(Math.random() * 2) + 1]; // Rare
    if (rand < 0.85) return gameRewards[Math.floor(Math.random() * 2) + 3]; // Epic
    return gameRewards[Math.floor(Math.random() * 2) + 5]; // Legendary
  }, []);

  const smashEgg = (times: number) => {
    const cost = times * 10;
    if (state.currentUser && state.currentUser.coins < cost) return;

    setIsSmashing(true);
    setEggCracks(prev => prev + 1);

    // Create particles
    const newParticles = Array.from({ length: 8 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 200 - 100,
      y: Math.random() * -150 - 50,
      emoji: ['✨', '💫', '⭐', '🌟', '💰'][Math.floor(Math.random() * 5)]
    }));
    setParticles(newParticles);

    setTimeout(() => {
      const reward = getRandomReward();
      setShowReward(reward);
      setIsSmashing(false);
      setParticles([]);
      
      if (state.currentUser) {
        dispatch({ type: 'UPDATE_COINS', payload: state.currentUser.coins - cost + reward.value });
        dispatch({
          type: 'ADD_TRANSACTION',
          payload: {
            id: Date.now().toString(),
            type: 'spend',
            amount: cost,
            description: `Golden Egg Smash x${times}`,
            timestamp: new Date().toISOString(),
            source: 'golden_egg'
          }
        });
      }
    }, 1000);
  };

  const closeReward = () => {
    setShowReward(null);
    setEggCracks(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-900/30 via-dark-900 to-dark-900 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-20 h-20 bg-gold-500/10 rounded-full blur-2xl animate-pulse" />
        <div className="absolute top-40 right-10 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-gold-400/10 rounded-full blur-2xl animate-pulse" />
        {/* Floating coins */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-2xl"
            style={{ left: `${15 + i * 15}%`, top: `${20 + (i % 3) * 25}%` }}
            animate={{ y: [0, -15, 0], rotate: [0, 360] }}
            transition={{ duration: 3 + i, repeat: Infinity, delay: i * 0.5 }}
          >
            🪙
          </motion.div>
        ))}
      </div>

      {/* Header */}
      <div className="relative z-20 px-4 py-3 flex items-center justify-between">
        <motion.button whileTap={{ scale: 0.9 }} onClick={() => dispatch({ type: 'SET_SCREEN', payload: 'home' })}>
          <ArrowLeft className="w-6 h-6 text-gold-400" />
        </motion.button>
        <h1 className="text-lg font-bold gold-text" style={{ fontFamily: 'Orbitron, sans-serif' }}>
          Golden Egg
        </h1>
        <div className="flex items-center gap-1 bg-dark-700/80 rounded-full px-3 py-1 border border-gold-500/20">
          <span className="text-sm">💰</span>
          <span className="text-sm font-bold text-gold-400">{state.currentUser?.coins?.toLocaleString()}</span>
        </div>
      </div>

      {/* Egg Area */}
      <div className="relative z-10 flex flex-col items-center justify-center py-8">
        {/* Glow ring */}
        <div className="absolute w-64 h-64 rounded-full bg-gold-500/10 animate-pulse" />
        <div className="absolute w-48 h-48 rounded-full bg-gold-400/5 animate-spin-slow" />

        {/* The Egg */}
        <motion.div
          animate={isSmashing ? { scale: [1, 1.2, 0.8, 1], rotate: [0, 10, -10, 0] } : { y: [0, -8, 0] }}
          transition={isSmashing ? { duration: 0.5 } : { duration: 2, repeat: Infinity }}
          className="relative"
        >
          <div className="w-40 h-52 relative">
            {/* Egg shape */}
            <div className="absolute inset-0 rounded-[50%_50%_50%_50%/60%_60%_40%_40%] gold-gradient shadow-2xl animate-pulse-glow">
              <div className="absolute inset-2 rounded-[50%_50%_50%_50%/60%_60%_40%_40%] bg-gradient-to-b from-gold-300/50 to-transparent" />
              {/* Cracks */}
              {eggCracks > 0 && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg className="w-20 h-20 text-dark-900/50" viewBox="0 0 100 100">
                    <path d="M50 20 L45 40 L55 50 L48 65 L52 80" stroke="currentColor" strokeWidth="2" fill="none" />
                    {eggCracks > 1 && <path d="M35 45 L50 50 L65 45" stroke="currentColor" strokeWidth="2" fill="none" />}
                  </svg>
                </div>
              )}
            </div>
            {/* Sparkles */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
              className="absolute -inset-4"
            >
              <Sparkles className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 text-gold-300" />
              <Sparkles className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-4 text-gold-300" />
              <Sparkles className="absolute top-1/2 left-0 -translate-y-1/2 w-4 h-4 text-gold-300" />
              <Sparkles className="absolute top-1/2 right-0 -translate-y-1/2 w-4 h-4 text-gold-300" />
            </motion.div>
          </div>
        </motion.div>

        {/* Particles */}
        <AnimatePresence>
          {particles.map(p => (
            <motion.div
              key={p.id}
              initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
              animate={{ opacity: 0, x: p.x, y: p.y, scale: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="absolute text-2xl"
            >
              {p.emoji}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Smash Buttons */}
      <div className="relative z-10 px-6 space-y-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => smashEgg(1)}
          disabled={isSmashing}
          className="w-full gold-gradient text-dark-900 font-bold py-4 rounded-2xl text-lg shadow-lg shadow-gold-500/20 flex items-center justify-center gap-2"
        >
          🔨 Smash x1
          <span className="text-sm opacity-70">(10 coins)</span>
        </motion.button>

        <div className="grid grid-cols-2 gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => smashEgg(10)}
            disabled={isSmashing}
            className="bg-gradient-to-r from-purple-600 to-purple-800 text-white font-bold py-3 rounded-2xl border border-purple-400/30 flex items-center justify-center gap-2"
          >
            🔨 x10
            <span className="text-xs opacity-70">(100 coins)</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => smashEgg(100)}
            disabled={isSmashing}
            className="bg-gradient-to-r from-red-600 to-red-800 text-white font-bold py-3 rounded-2xl border border-red-400/30 flex items-center justify-center gap-2"
          >
            🔨 x100
            <span className="text-xs opacity-70">(1000 coins)</span>
          </motion.button>
        </div>

        {/* Action buttons */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowRules(true)}
            className="glass-card rounded-xl py-3 flex items-center justify-center gap-2 border border-gold-500/20"
          >
            <BookOpen className="w-4 h-4 text-gold-400" />
            <span className="text-sm text-gold-300">Rules</span>
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowWinners(true)}
            className="glass-card rounded-xl py-3 flex items-center justify-center gap-2 border border-gold-500/20"
          >
            <Trophy className="w-4 h-4 text-gold-400" />
            <span className="text-sm text-gold-300">Winners</span>
          </motion.button>
        </div>
      </div>

      {/* Rewards Grid */}
      <div className="relative z-10 px-4 mt-6 pb-20">
        <h3 className="text-sm font-bold text-gold-300 mb-3">Possible Rewards</h3>
        <div className="grid grid-cols-4 gap-2">
          {gameRewards.map(reward => (
            <div
              key={reward.id}
              className={`glass-card rounded-xl p-2 flex flex-col items-center text-center border
                ${reward.rarity === 'legendary' ? 'border-gold-400/50' : reward.rarity === 'epic' ? 'border-purple-400/50' : reward.rarity === 'rare' ? 'border-blue-400/50' : 'border-white/10'}`}
            >
              <span className="text-2xl mb-1">{reward.icon}</span>
              <span className="text-[9px] text-white/70 truncate w-full">{reward.name}</span>
              <span className="text-[9px] text-gold-400">{reward.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Reward Modal */}
      <AnimatePresence>
        {showReward && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0 }}
              transition={{ type: 'spring' }}
              className="glass-card rounded-3xl p-8 text-center max-w-xs w-full glow-border"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="text-6xl mb-4"
              >
                {showReward.icon}
              </motion.div>
              <h3 className="text-xl font-bold gold-text mb-1">Congratulations!</h3>
              <p className="text-white text-lg font-medium">{showReward.name}</p>
              <p className="text-gold-400 text-sm mt-1">+{showReward.value} coins</p>
              <div className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold
                ${showReward.rarity === 'legendary' ? 'bg-gold-500/20 text-gold-300' : showReward.rarity === 'epic' ? 'bg-purple-500/20 text-purple-300' : showReward.rarity === 'rare' ? 'bg-blue-500/20 text-blue-300' : 'bg-white/10 text-white/70'}`}>
                {showReward.rarity.toUpperCase()}
              </div>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={closeReward}
                className="w-full gold-gradient text-dark-900 font-bold py-3 rounded-xl mt-6"
              >
                Collect
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Rules Modal */}
      <AnimatePresence>
        {showRules && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 flex items-end"
            onClick={() => setShowRules(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="w-full bg-dark-800 rounded-t-3xl p-6 max-h-[70vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold gold-text mb-4">📜 Game Rules</h3>
              <div className="space-y-3 text-sm text-white/80">
                <p>🥚 Each smash costs 10 virtual coins.</p>
                <p>🎁 Every smash guarantees a reward from the prize pool.</p>
                <p>💰 Rewards are added to your virtual coin balance.</p>
                <p>🏆 Higher rarity items have lower drop rates.</p>
                <p>📊 All transactions are recorded in your wallet.</p>
                <p>⚠️ This game uses virtual coins only. No real money involved.</p>
              </div>
              <h4 className="text-lg font-bold text-gold-300 mt-6 mb-3">Reward Table</h4>
              <div className="space-y-2">
                {gameRewards.map(r => (
                  <div key={r.id} className="flex items-center justify-between bg-dark-700 rounded-xl p-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{r.icon}</span>
                      <span className="text-sm text-white">{r.name}</span>
                    </div>
                    <span className="text-gold-400 font-bold">{r.value} coins</span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setShowRules(false)}
                className="w-full gold-gradient text-dark-900 font-bold py-3 rounded-xl mt-6"
              >
                Got it!
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Winners Modal */}
      <AnimatePresence>
        {showWinners && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 flex items-end"
            onClick={() => setShowWinners(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="w-full bg-dark-800 rounded-t-3xl p-6 max-h-[70vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold gold-text mb-4">🏆 Big Winners of the Day</h3>
              
              {/* Top Winner */}
              <div className="text-center mb-6">
                <div className="w-20 h-20 mx-auto rounded-full gold-gradient flex items-center justify-center text-3xl mb-2 animate-pulse-glow">
                  {mockUsers[3].avatar}
                </div>
                <h4 className="text-lg font-bold text-white">{mockUsers[3].username}</h4>
                <p className="text-gold-400">🏅 #1 Winner</p>
                <p className="text-2xl font-bold gold-text mt-1">+52,400 coins</p>
              </div>

              {/* Other Winners */}
              <div className="space-y-2">
                {mockUsers.slice(0, 8).map((user, i) => (
                  <div key={user.id} className="flex items-center gap-3 bg-dark-700 rounded-xl p-3">
                    <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold
                      ${i === 0 ? 'gold-gradient text-dark-900' : i === 1 ? 'bg-gray-400 text-dark-900' : i === 2 ? 'bg-amber-700 text-white' : 'bg-dark-600 text-white/60'}`}>
                      {i + 1}
                    </span>
                    <div className="w-8 h-8 rounded-full bg-dark-600 flex items-center justify-center">
                      {user.avatar}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">{user.username}</p>
                      <p className="text-[10px] text-white/50">Level {user.level}</p>
                    </div>
                    <span className="text-gold-400 font-bold text-sm">+{(Math.random() * 30000 + 5000).toFixed(0)}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setShowWinners(false)}
                className="w-full gold-gradient text-dark-900 font-bold py-3 rounded-xl mt-6"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
