import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Star, Trophy, Gift, Zap } from 'lucide-react';
import { useApp } from '../context/AppContext';

const rocketLevels = [
  { level: 0, name: 'Starter', emoji: '🚀', color: 'from-gray-600 to-gray-800', xpNeeded: 0 },
  { level: 1, name: 'Explorer', emoji: '🛸', color: 'from-blue-600 to-blue-800', xpNeeded: 100 },
  { level: 2, name: 'Voyager', emoji: '🌟', color: 'from-purple-600 to-purple-800', xpNeeded: 500 },
  { level: 3, name: 'Champion', emoji: '⚡', color: 'from-amber-600 to-amber-800', xpNeeded: 1500 },
  { level: 4, name: 'Legend', emoji: '👑', color: 'from-gold-500 to-gold-700', xpNeeded: 5000 },
];

const rewards = [
  { id: 'rw1', name: 'Gold Frame', icon: '🖼️', type: 'frame', unlocked: true },
  { id: 'rw2', name: 'Speed Boost', icon: '⚡', type: 'vehicle', unlocked: true },
  { id: 'rw3', name: 'Star Badge', icon: '⭐', type: 'badge', unlocked: true },
  { id: 'rw4', name: 'XP Card x2', icon: '🃏', type: 'xp', unlocked: false },
  { id: 'rw5', name: 'Cosmic Frame', icon: '🌌', type: 'frame', unlocked: false },
  { id: 'rw6', name: 'Rocket Trail', icon: '🔥', type: 'vehicle', unlocked: false },
  { id: 'rw7', name: 'Diamond Badge', icon: '💎', type: 'badge', unlocked: false },
  { id: 'rw8', name: 'Mega XP', icon: '💫', type: 'xp', unlocked: false },
];

export function RocketScreen() {
  const { state, dispatch } = useApp();
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [showRewards, setShowRewards] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);

  const currentXP = state.currentUser?.xp || 0;
  const currentLevel = Math.min(Math.floor(currentXP / 1000), 4);
  const nextLevelXP = rocketLevels[Math.min(currentLevel + 1, 4)].xpNeeded;
  const progress = Math.min((currentXP / nextLevelXP) * 100, 100);

  const handleUpgrade = () => {
    if (currentXP < nextLevelXP) return;
    setIsUpgrading(true);
    setTimeout(() => {
      setIsUpgrading(false);
      dispatch({ type: 'ADD_XP', payload: 100 });
    }, 2000);
  };

  const earnXP = () => {
    dispatch({ type: 'ADD_XP', payload: 50 });
    dispatch({
      type: 'ADD_TRANSACTION',
      payload: {
        id: Date.now().toString(),
        type: 'earn',
        amount: 50,
        description: 'Rocket XP earned',
        timestamp: new Date().toISOString(),
        source: 'rocket_game'
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-dark-900 to-dark-900 relative overflow-hidden">
      {/* Stars background */}
      <div className="absolute inset-0">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{ duration: 2 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 2 }}
          />
        ))}
      </div>

      {/* Header */}
      <div className="relative z-20 px-4 py-3 flex items-center justify-between">
        <motion.button whileTap={{ scale: 0.9 }} onClick={() => dispatch({ type: 'SET_SCREEN', payload: 'home' })}>
          <ArrowLeft className="w-6 h-6 text-gold-400" />
        </motion.button>
        <h1 className="text-lg font-bold gold-text" style={{ fontFamily: 'Orbitron, sans-serif' }}>
          Rocket
        </h1>
        <div className="flex items-center gap-1 bg-dark-700/80 rounded-full px-3 py-1 border border-gold-500/20">
          <Zap className="w-4 h-4 text-gold-400" />
          <span className="text-sm font-bold text-gold-400">{currentXP} XP</span>
        </div>
      </div>

      {/* Rocket Display */}
      <div className="relative z-10 flex flex-col items-center py-8">
        {/* Level indicator */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-sm text-white/60">Level {currentLevel}</span>
          <span className="text-gold-400 font-bold text-lg">{rocketLevels[currentLevel].name}</span>
        </div>

        {/* Rocket */}
        <motion.div
          animate={isUpgrading 
            ? { y: [0, -100, -200], scale: [1, 1.2, 0.5], opacity: [1, 1, 0] }
            : { y: [0, -10, 0] }
          }
          transition={isUpgrading ? { duration: 2 } : { duration: 3, repeat: Infinity }}
          className="relative"
        >
          <div className={`w-32 h-32 rounded-full bg-gradient-to-b ${rocketLevels[currentLevel].color} flex items-center justify-center text-6xl shadow-2xl relative`}>
            <span className="relative z-10">{rocketLevels[currentLevel].emoji}</span>
            {/* Glow effect */}
            <div className="absolute inset-0 rounded-full bg-gold-400/20 blur-xl animate-pulse" />
            {/* Flame */}
            <motion.div
              animate={{ scaleY: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 0.5, repeat: Infinity }}
              className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-8 h-12 bg-gradient-to-t from-transparent via-orange-500 to-yellow-300 rounded-full blur-sm"
            />
          </div>
        </motion.div>

        {/* Upgrade animation */}
        <AnimatePresence>
          {isUpgrading && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 2 }}
              className="absolute text-4xl"
            >
              ⭐
            </motion.div>
          )}
        </AnimatePresence>

        {/* Progress Bar */}
        <div className="w-full max-w-xs mt-8 px-4">
          <div className="flex justify-between text-xs text-white/60 mb-1">
            <span>Current: {currentXP} XP</span>
            <span>Next: {nextLevelXP} XP</span>
          </div>
          <div className="h-3 bg-dark-700 rounded-full overflow-hidden border border-gold-500/20">
            <motion.div
              className="h-full gold-gradient rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1 }}
            />
          </div>
          <div className="flex justify-between mt-2">
            {rocketLevels.map((level, i) => (
              <div key={i} className={`w-6 h-6 rounded-full flex items-center justify-center text-xs
                ${i <= currentLevel ? 'gold-gradient text-dark-900' : 'bg-dark-600 text-white/40 border border-dark-400'}`}>
                {i}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="relative z-10 px-4 space-y-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
          onClick={earnXP}
          className="w-full gold-gradient text-dark-900 font-bold py-4 rounded-2xl text-lg shadow-lg shadow-gold-500/20 flex items-center justify-center gap-2"
        >
          <Zap className="w-5 h-5" />
          Earn XP (+50)
        </motion.button>

        <div className="grid grid-cols-2 gap-3">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowRewards(true)}
            className="glass-card rounded-xl py-3 flex items-center justify-center gap-2 border border-gold-500/20"
          >
            <Gift className="w-4 h-4 text-gold-400" />
            <span className="text-sm text-gold-300">Rewards</span>
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAchievements(true)}
            className="glass-card rounded-xl py-3 flex items-center justify-center gap-2 border border-gold-500/20"
          >
            <Trophy className="w-4 h-4 text-gold-400" />
            <span className="text-sm text-gold-300">Achievements</span>
          </motion.button>
        </div>
      </div>

      {/* Rocket Stages */}
      <div className="relative z-10 px-4 mt-6 pb-20">
        <h3 className="text-sm font-bold text-gold-300 mb-3">Rocket Evolution</h3>
        <div className="grid grid-cols-5 gap-2">
          {rocketLevels.map((level, i) => (
            <motion.div
              key={i}
              whileTap={{ scale: 0.9 }}
              className={`rounded-xl p-2 flex flex-col items-center text-center border
                ${i <= currentLevel ? 'glass-card border-gold-500/30' : 'bg-dark-800 border-dark-600 opacity-50'}`}
            >
              <span className="text-2xl mb-1">{level.emoji}</span>
              <span className="text-[8px] text-white/70">Lv.{level.level}</span>
              <span className="text-[8px] text-gold-400">{level.name}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Rewards Modal */}
      <AnimatePresence>
        {showRewards && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 flex items-end"
            onClick={() => setShowRewards(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="w-full bg-dark-800 rounded-t-3xl p-6 max-h-[70vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold gold-text mb-4">🎁 Reward Collection</h3>
              <div className="grid grid-cols-4 gap-3">
                {rewards.map(reward => (
                  <div
                    key={reward.id}
                    className={`rounded-xl p-3 flex flex-col items-center text-center border
                      ${reward.unlocked ? 'glass-card border-gold-500/30' : 'bg-dark-700 border-dark-500 opacity-50'}`}
                  >
                    <span className="text-2xl mb-1">{reward.icon}</span>
                    <span className="text-[9px] text-white/70">{reward.name}</span>
                    <span className={`text-[8px] mt-1 px-2 py-0.5 rounded-full
                      ${reward.unlocked ? 'bg-green-500/20 text-green-400' : 'bg-dark-600 text-white/40'}`}>
                      {reward.unlocked ? '✓ Unlocked' : '🔒 Locked'}
                    </span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setShowRewards(false)}
                className="w-full gold-gradient text-dark-900 font-bold py-3 rounded-xl mt-6"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Achievements Modal */}
      <AnimatePresence>
        {showAchievements && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 flex items-end"
            onClick={() => setShowAchievements(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="w-full bg-dark-800 rounded-t-3xl p-6 max-h-[70vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold gold-text mb-4">🏆 Achievements</h3>
              <div className="space-y-3">
                {[
                  { name: 'First Launch', desc: 'Upgrade rocket for the first time', icon: '🚀', done: true },
                  { name: 'Star Collector', desc: 'Earn 500 XP', icon: '⭐', done: currentXP >= 500 },
                  { name: 'Speed Demon', desc: 'Reach Level 2', icon: '⚡', done: currentLevel >= 2 },
                  { name: 'Champion Pilot', desc: 'Reach Level 3', icon: '🏆', done: currentLevel >= 3 },
                  { name: 'Legendary', desc: 'Reach Level 4', icon: '👑', done: currentLevel >= 4 },
                  { name: 'XP Master', desc: 'Earn 5000 XP total', icon: '💫', done: currentXP >= 5000 },
                ].map((achievement, i) => (
                  <div key={i} className={`flex items-center gap-3 rounded-xl p-3 border
                    ${achievement.done ? 'glass-card border-gold-500/30' : 'bg-dark-700 border-dark-500 opacity-60'}`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl
                      ${achievement.done ? 'gold-gradient' : 'bg-dark-600'}`}>
                      {achievement.icon}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">{achievement.name}</p>
                      <p className="text-[10px] text-white/50">{achievement.desc}</p>
                    </div>
                    {achievement.done && <span className="text-green-400 text-sm">✓</span>}
                  </div>
                ))}
              </div>
              <button
                onClick={() => setShowAchievements(false)}
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
