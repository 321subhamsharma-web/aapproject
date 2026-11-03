import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Wallet, TrendingUp, TrendingDown, Gift, Clock, Award, Edit3, Camera, Settings } from 'lucide-react';
import { useApp, mockUsers, mockLeaderboard } from '../context/AppContext';

// ===== WALLET SCREEN =====
export function WalletScreen() {
  const { state, dispatch } = useApp();
  const [activeTab, setActiveTab] = useState<'history' | 'rewards' | 'daily'>('history');

  const totalEarned = state.transactions.filter(t => t.type === 'earn').reduce((sum, t) => sum + t.amount, 0);
  const totalSpent = state.transactions.filter(t => t.type === 'spend').reduce((sum, t) => sum + t.amount, 0);

  const claimDailyBonus = () => {
    dispatch({ type: 'UPDATE_COINS', payload: (state.currentUser?.coins || 0) + 100 });
    dispatch({
      type: 'ADD_TRANSACTION',
      payload: {
        id: Date.now().toString(),
        type: 'earn',
        amount: 100,
        description: 'Daily Bonus',
        timestamp: new Date().toISOString(),
        source: 'daily_bonus'
      }
    });
  };

  return (
    <div className="min-h-screen bg-dark-900 pb-20">
      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between">
        <motion.button whileTap={{ scale: 0.9 }} onClick={() => dispatch({ type: 'SET_SCREEN', payload: 'home' })}>
          <ArrowLeft className="w-6 h-6 text-gold-400" />
        </motion.button>
        <h1 className="text-lg font-bold gold-text" style={{ fontFamily: 'Orbitron, sans-serif' }}>Wallet</h1>
        <Settings className="w-5 h-5 text-gold-400" />
      </div>

      {/* Balance Card */}
      <div className="px-4 mt-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl p-6 bg-gradient-to-br from-gold-600/20 via-dark-700 to-purple-900/20 border border-gold-500/20 glow-border"
        >
          <div className="flex items-center gap-2 mb-2">
            <Wallet className="w-5 h-5 text-gold-400" />
            <span className="text-sm text-gold-300/70">Total Balance</span>
          </div>
          <h2 className="text-3xl font-bold gold-text">{state.currentUser?.coins?.toLocaleString()}</h2>
          <p className="text-xs text-white/50 mt-1">Virtual Coins</p>
          
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="bg-green-500/10 rounded-xl p-3 border border-green-500/20">
              <div className="flex items-center gap-1">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <span className="text-xs text-green-400">Earned</span>
              </div>
              <p className="text-lg font-bold text-green-300 mt-1">+{totalEarned.toLocaleString()}</p>
            </div>
            <div className="bg-red-500/10 rounded-xl p-3 border border-red-500/20">
              <div className="flex items-center gap-1">
                <TrendingDown className="w-4 h-4 text-red-400" />
                <span className="text-xs text-red-400">Spent</span>
              </div>
              <p className="text-lg font-bold text-red-300 mt-1">-{totalSpent.toLocaleString()}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Daily Bonus */}
      <div className="px-4 mt-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={claimDailyBonus}
          className="w-full bg-gradient-to-r from-gold-500/20 to-amber-500/20 border border-gold-500/30 rounded-xl p-4 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full gold-gradient flex items-center justify-center">
              <Gift className="w-5 h-5 text-dark-900" />
            </div>
            <div className="text-left">
              <p className="text-sm font-bold text-white">Daily Bonus</p>
              <p className="text-xs text-gold-400">+100 coins available!</p>
            </div>
          </div>
          <span className="text-gold-400 text-sm">Claim →</span>
        </motion.button>
      </div>

      {/* Tabs */}
      <div className="px-4 mt-6">
        <div className="flex gap-1 bg-dark-800 rounded-xl p-1">
          {(['history', 'rewards', 'daily'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium capitalize transition-colors
                ${activeTab === tab ? 'gold-gradient text-dark-900' : 'text-white/50'}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="px-4 mt-4">
        <AnimatePresence mode="wait">
          {activeTab === 'history' && (
            <motion.div key="history" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h3 className="text-sm font-bold text-gold-300 mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4" /> Transaction History
              </h3>
              {state.transactions.length === 0 ? (
                <div className="text-center py-8 text-white/40">
                  <p className="text-4xl mb-2">📝</p>
                  <p>No transactions yet</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {state.transactions.map(tx => (
                    <div key={tx.id} className="glass-card rounded-xl p-3 flex items-center justify-between border border-dark-500">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center
                          ${tx.type === 'earn' ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                          {tx.type === 'earn' ? <TrendingUp className="w-4 h-4 text-green-400" /> : <TrendingDown className="w-4 h-4 text-red-400" />}
                        </div>
                        <div>
                          <p className="text-sm text-white">{tx.description}</p>
                          <p className="text-[10px] text-white/40">{new Date(tx.timestamp).toLocaleString()}</p>
                        </div>
                      </div>
                      <span className={`font-bold ${tx.type === 'earn' ? 'text-green-400' : 'text-red-400'}`}>
                        {tx.type === 'earn' ? '+' : '-'}{tx.amount}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'rewards' && (
            <motion.div key="rewards" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h3 className="text-sm font-bold text-gold-300 mb-3 flex items-center gap-2">
                <Gift className="w-4 h-4" /> Gift Inventory
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { name: 'Golden Crown', icon: '👑', count: 2 },
                  { name: 'Magic Wand', icon: '🪄', count: 1 },
                  { name: 'Star Dust', icon: '✨', count: 5 },
                  { name: 'Moon Stone', icon: '🌙', count: 3 },
                  { name: 'Fire Gem', icon: '🔥', count: 1 },
                  { name: 'Ice Crystal', icon: '❄️', count: 4 },
                ].map((gift, i) => (
                  <div key={i} className="glass-card rounded-xl p-3 text-center border border-dark-500">
                    <span className="text-3xl">{gift.icon}</span>
                    <p className="text-xs text-white/70 mt-1">{gift.name}</p>
                    <p className="text-gold-400 text-xs font-bold">x{gift.count}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'daily' && (
            <motion.div key="daily" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h3 className="text-sm font-bold text-gold-300 mb-3 flex items-center gap-2">
                <Award className="w-4 h-4" /> Daily Rewards
              </h3>
              <div className="grid grid-cols-7 gap-2">
                {[1, 2, 3, 4, 5, 6, 7].map(day => (
                  <div key={day} className={`rounded-xl p-2 text-center border
                    ${day <= 3 ? 'gold-gradient text-dark-900 border-gold-400' : 'glass-card border-dark-500'}`}>
                    <p className="text-[10px] font-bold">Day {day}</p>
                    <span className="text-lg">{day <= 3 ? '✅' : '🎁'}</span>
                    <p className="text-[9px]">{day * 50}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ===== PROFILE SCREEN =====
export function ProfileScreen() {
  const { state, dispatch } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [editUsername, setEditUsername] = useState(state.currentUser?.username || '');
  const [editBio, setEditBio] = useState(state.currentUser?.bio || '');

  const saveProfile = () => {
    if (state.currentUser) {
      dispatch({
        type: 'SET_USER',
        payload: { ...state.currentUser, username: editUsername, bio: editBio }
      });
    }
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-dark-900 pb-20">
      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between">
        <motion.button whileTap={{ scale: 0.9 }} onClick={() => dispatch({ type: 'SET_SCREEN', payload: 'home' })}>
          <ArrowLeft className="w-6 h-6 text-gold-400" />
        </motion.button>
        <h1 className="text-lg font-bold gold-text" style={{ fontFamily: 'Orbitron, sans-serif' }}>Profile</h1>
        <motion.button whileTap={{ scale: 0.9 }} onClick={() => setIsEditing(!isEditing)}>
          <Edit3 className="w-5 h-5 text-gold-400" />
        </motion.button>
      </div>

      {/* Profile Card */}
      <div className="px-4 mt-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl p-6 bg-gradient-to-br from-purple-900/30 via-dark-700 to-gold-900/20 border border-gold-500/20 text-center"
        >
          <div className="relative inline-block">
            <div className="w-24 h-24 rounded-full gold-gradient flex items-center justify-center text-5xl mx-auto animate-pulse-glow">
              {state.currentUser?.avatar}
            </div>
            <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-dark-700 rounded-full border-2 border-gold-500 flex items-center justify-center">
              <span className="text-xs font-bold text-gold-400">{state.currentUser?.level}</span>
            </div>
            <button className="absolute bottom-0 right-0 w-7 h-7 bg-gold-500 rounded-full flex items-center justify-center">
              <Camera className="w-3.5 h-3.5 text-dark-900" />
            </button>
          </div>

          {isEditing ? (
            <div className="mt-4 space-y-3">
              <input
                value={editUsername}
                onChange={(e) => setEditUsername(e.target.value)}
                className="w-full bg-dark-700 border border-gold-500/20 rounded-xl px-4 py-2 text-white text-center focus:outline-none focus:border-gold-500"
              />
              <textarea
                value={editBio}
                onChange={(e) => setEditBio(e.target.value)}
                className="w-full bg-dark-700 border border-gold-500/20 rounded-xl px-4 py-2 text-white text-center text-sm focus:outline-none focus:border-gold-500 resize-none"
                rows={2}
              />
              <button onClick={saveProfile} className="gold-gradient text-dark-900 font-bold px-6 py-2 rounded-xl text-sm">
                Save
              </button>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-bold text-white mt-4">{state.currentUser?.username}</h2>
              <p className="text-gold-400 text-sm">ID: {state.currentUser?.id}</p>
              <p className="text-white/50 text-xs mt-2">{state.currentUser?.bio}</p>
            </>
          )}

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="text-center">
              <p className="text-xl font-bold gold-text">{state.currentUser?.level}</p>
              <p className="text-[10px] text-white/50">Level</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold gold-text">{state.currentUser?.coins?.toLocaleString()}</p>
              <p className="text-[10px] text-white/50">Coins</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold gold-text">{state.currentUser?.xp}</p>
              <p className="text-[10px] text-white/50">XP</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Achievements */}
      <div className="px-4 mt-6">
        <h3 className="text-sm font-bold text-gold-300 mb-3 flex items-center gap-2">
          <Award className="w-4 h-4" /> Achievements
        </h3>
        <div className="grid grid-cols-4 gap-2">
          {['First Win', '100 Rooms', 'Egg Master', 'Rocket Lv4', 'Social Star', 'Top Spender', 'Collector', 'VIP'].map((achievement, i) => (
            <div key={i} className={`rounded-xl p-2 text-center border
              ${i < 4 ? 'glass-card border-gold-500/30' : 'bg-dark-800 border-dark-600 opacity-50'}`}>
              <span className="text-xl">{['🏆', '🎙️', '🥚', '🚀', '⭐', '💰', '🎁', '👑'][i]}</span>
              <p className="text-[8px] text-white/60 mt-1">{achievement}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Collected Rewards */}
      <div className="px-4 mt-6">
        <h3 className="text-sm font-bold text-gold-300 mb-3">Collected Rewards</h3>
        <div className="grid grid-cols-4 gap-2">
          {['💰', '🌙', '🕸️', '⛲', '🏆', '🎈', '💎', '🔮'].map((icon, i) => (
            <div key={i} className="glass-card rounded-xl p-3 text-center border border-dark-500">
              <span className="text-2xl">{icon}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Logout */}
      <div className="px-4 mt-8">
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => dispatch({ type: 'LOGOUT' })}
          className="w-full bg-red-500/10 border border-red-500/20 text-red-400 font-medium py-3 rounded-xl"
        >
          Sign Out
        </motion.button>
      </div>
    </div>
  );
}

// ===== LEADERBOARD SCREEN =====
export function LeaderboardScreen() {
  const { state, dispatch } = useApp();
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  return (
    <div className="min-h-screen bg-dark-900 pb-20">
      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between">
        <motion.button whileTap={{ scale: 0.9 }} onClick={() => dispatch({ type: 'SET_SCREEN', payload: 'home' })}>
          <ArrowLeft className="w-6 h-6 text-gold-400" />
        </motion.button>
        <h1 className="text-lg font-bold gold-text" style={{ fontFamily: 'Orbitron, sans-serif' }}>Leaderboard</h1>
        <div className="w-6" />
      </div>

      {/* Period Tabs */}
      <div className="px-4 mt-2">
        <div className="flex gap-1 bg-dark-800 rounded-xl p-1">
          {(['daily', 'weekly', 'monthly'] as const).map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium capitalize transition-colors
                ${period === p ? 'gold-gradient text-dark-900' : 'text-white/50'}`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Top 3 Podium */}
      <div className="px-4 mt-6">
        <div className="flex items-end justify-center gap-3 h-48">
          {/* 2nd place */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center"
          >
            <div className="w-14 h-14 rounded-full bg-gray-400/20 border-2 border-gray-400 flex items-center justify-center text-2xl mb-1">
              {mockUsers[1].avatar}
            </div>
            <p className="text-xs text-white font-medium">{mockUsers[1].username}</p>
            <div className="w-20 h-24 bg-gradient-to-t from-gray-600/30 to-gray-400/10 rounded-t-xl mt-2 flex items-center justify-center">
              <span className="text-2xl font-bold text-gray-300">2</span>
            </div>
          </motion.div>

          {/* 1st place */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center"
          >
            <div className="text-2xl mb-1">👑</div>
            <div className="w-16 h-16 rounded-full gold-gradient flex items-center justify-center text-3xl animate-pulse-glow">
              {mockUsers[3].avatar}
            </div>
            <p className="text-sm text-white font-bold mt-1">{mockUsers[3].username}</p>
            <p className="text-gold-400 text-xs">{mockUsers[3].coins.toLocaleString()}</p>
            <div className="w-20 h-32 bg-gradient-to-t from-gold-600/30 to-gold-400/10 rounded-t-xl mt-2 flex items-center justify-center border-t border-x border-gold-500/20">
              <span className="text-3xl font-bold gold-text">1</span>
            </div>
          </motion.div>

          {/* 3rd place */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col items-center"
          >
            <div className="w-14 h-14 rounded-full bg-amber-700/20 border-2 border-amber-700 flex items-center justify-center text-2xl mb-1">
              {mockUsers[5].avatar}
            </div>
            <p className="text-xs text-white font-medium">{mockUsers[5].username}</p>
            <div className="w-20 h-16 bg-gradient-to-t from-amber-700/30 to-amber-600/10 rounded-t-xl mt-2 flex items-center justify-center">
              <span className="text-2xl font-bold text-amber-600">3</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Full List */}
      <div className="px-4 mt-6">
        <h3 className="text-sm font-bold text-gold-300 mb-3">Full Rankings</h3>
        <div className="space-y-2">
          {mockUsers.map((user, i) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card rounded-xl p-3 flex items-center gap-3 border border-dark-500"
            >
              <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold
                ${i === 0 ? 'gold-gradient text-dark-900' : i === 1 ? 'bg-gray-400 text-dark-900' : i === 2 ? 'bg-amber-700 text-white' : 'bg-dark-600 text-white/60'}`}>
                {i + 1}
              </span>
              <div className="w-10 h-10 rounded-full bg-dark-600 flex items-center justify-center text-lg">
                {user.avatar}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-white">{user.username}</p>
                <p className="text-[10px] text-white/50">Level {user.level}</p>
              </div>
              <div className="text-right">
                <p className="text-gold-400 font-bold text-sm">{user.coins.toLocaleString()}</p>
                <p className="text-[10px] text-white/40">coins</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
