import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Users, Mic, Flag, Gift, BarChart3, Shield, AlertTriangle, Ban, CheckCircle } from 'lucide-react';
import { useApp, mockUsers, mockRooms } from '../context/AppContext';

type AdminTab = 'users' | 'rooms' | 'reports' | 'rewards' | 'stats';

export function AdminScreen() {
  const { state, dispatch } = useApp();
  const [activeTab, setActiveTab] = useState<AdminTab>('users');
  const [selectedAction, setSelectedAction] = useState<string | null>(null);

  const tabs: { key: AdminTab; label: string; icon: React.ReactNode }[] = [
    { key: 'users', label: 'Users', icon: <Users className="w-4 h-4" /> },
    { key: 'rooms', label: 'Rooms', icon: <Mic className="w-4 h-4" /> },
    { key: 'reports', label: 'Reports', icon: <Flag className="w-4 h-4" /> },
    { key: 'rewards', label: 'Rewards', icon: <Gift className="w-4 h-4" /> },
    { key: 'stats', label: 'Stats', icon: <BarChart3 className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-dark-900 pb-20">
      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between border-b border-gold-500/10">
        <motion.button whileTap={{ scale: 0.9 }} onClick={() => dispatch({ type: 'SET_SCREEN', payload: 'home' })}>
          <ArrowLeft className="w-6 h-6 text-gold-400" />
        </motion.button>
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-gold-400" />
          <h1 className="text-lg font-bold gold-text" style={{ fontFamily: 'Orbitron, sans-serif' }}>Admin Panel</h1>
        </div>
        <div className="w-6" />
      </div>

      {/* Stats Overview */}
      <div className="px-4 py-4">
        <div className="grid grid-cols-3 gap-2">
          <div className="glass-card rounded-xl p-3 text-center border border-gold-500/10">
            <p className="text-xl font-bold gold-text">{mockUsers.length}</p>
            <p className="text-[10px] text-white/50">Total Users</p>
          </div>
          <div className="glass-card rounded-xl p-3 text-center border border-gold-500/10">
            <p className="text-xl font-bold text-green-400">{mockRooms.length}</p>
            <p className="text-[10px] text-white/50">Active Rooms</p>
          </div>
          <div className="glass-card rounded-xl p-3 text-center border border-gold-500/10">
            <p className="text-xl font-bold text-red-400">3</p>
            <p className="text-[10px] text-white/50">Reports</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4">
        <div className="flex gap-1 bg-dark-800 rounded-xl p-1 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors
                ${activeTab === tab.key ? 'gold-gradient text-dark-900' : 'text-white/50'}`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="px-4 mt-4">
        <AnimatePresence mode="wait">
          {activeTab === 'users' && (
            <motion.div key="users" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h3 className="text-sm font-bold text-gold-300 mb-3">User Management</h3>
              <div className="space-y-2">
                {mockUsers.map(user => (
                  <div key={user.id} className="glass-card rounded-xl p-3 flex items-center gap-3 border border-dark-500">
                    <div className="w-10 h-10 rounded-full bg-dark-600 flex items-center justify-center text-lg">
                      {user.avatar}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">{user.username}</p>
                      <p className="text-[10px] text-white/50">ID: {user.id} • Lv.{user.level} • {user.coins} coins</p>
                    </div>
                    <div className="flex gap-1">
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        className="w-7 h-7 rounded-full bg-green-500/20 flex items-center justify-center"
                        title="Approve"
                      >
                        <CheckCircle className="w-3.5 h-3.5 text-green-400" />
                      </motion.button>
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        className="w-7 h-7 rounded-full bg-red-500/20 flex items-center justify-center"
                        title="Ban"
                      >
                        <Ban className="w-3.5 h-3.5 text-red-400" />
                      </motion.button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'rooms' && (
            <motion.div key="rooms" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h3 className="text-sm font-bold text-gold-300 mb-3">Room Management</h3>
              <div className="space-y-2">
                {mockRooms.map(room => (
                  <div key={room.id} className="glass-card rounded-xl p-3 border border-dark-500">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-white">{room.name}</p>
                        <p className="text-[10px] text-white/50">Host: {room.host.username} • {room.participants.length}/{room.seats} seats • {room.audience} listeners</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-[10px] text-green-400">Live</span>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-2">
                      <button className="text-[10px] bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-lg">Warn</button>
                      <button className="text-[10px] bg-red-500/20 text-red-400 px-2 py-1 rounded-lg">Close Room</button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'reports' && (
            <motion.div key="reports" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h3 className="text-sm font-bold text-gold-300 mb-3">Reports & Moderation</h3>
              <div className="space-y-2">
                {[
                  { id: 1, reporter: 'User A', reported: 'User B', reason: 'Inappropriate behavior', room: 'Midnight Melodies', time: '2h ago' },
                  { id: 2, reporter: 'User C', reported: 'User D', reason: 'Spam messages', room: 'Gaming Legends', time: '5h ago' },
                  { id: 3, reporter: 'User E', reported: 'User F', reason: 'Harassment', room: 'Chill Talk', time: '1d ago' },
                ].map(report => (
                  <div key={report.id} className="glass-card rounded-xl p-3 border border-red-500/20">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm text-white">{report.reason}</p>
                        <p className="text-[10px] text-white/50 mt-1">
                          Reported by: {report.reporter} → {report.reported}
                        </p>
                        <p className="text-[10px] text-white/50">Room: {report.room} • {report.time}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-2">
                      <button className="text-[10px] bg-green-500/20 text-green-400 px-3 py-1 rounded-lg">Dismiss</button>
                      <button className="text-[10px] bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-lg">Warn User</button>
                      <button className="text-[10px] bg-red-500/20 text-red-400 px-3 py-1 rounded-lg">Ban User</button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'rewards' && (
            <motion.div key="rewards" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h3 className="text-sm font-bold text-gold-300 mb-3">Reward Configuration</h3>
              <div className="space-y-2">
                {[
                  { name: 'Coins Bundle', value: 100, dropRate: 40, rarity: 'common' },
                  { name: 'Bottle of the Moon', value: 500, dropRate: 15, rarity: 'rare' },
                  { name: 'Dreamcatcher', value: 750, dropRate: 10, rarity: 'rare' },
                  { name: 'Gold Coin Fountain', value: 1000, dropRate: 10, rarity: 'epic' },
                  { name: 'Scepter of Glory', value: 2500, dropRate: 10, rarity: 'epic' },
                  { name: 'Hot Air Balloon', value: 5000, dropRate: 10, rarity: 'legendary' },
                  { name: 'Pink Necklace', value: 10000, dropRate: 5, rarity: 'legendary' },
                ].map((reward, i) => (
                  <div key={i} className="glass-card rounded-xl p-3 flex items-center justify-between border border-dark-500">
                    <div>
                      <p className="text-sm text-white">{reward.name}</p>
                      <p className="text-[10px] text-white/50">Value: {reward.value} coins</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gold-400">{reward.dropRate}%</p>
                      <p className={`text-[10px] px-2 py-0.5 rounded-full
                        ${reward.rarity === 'legendary' ? 'bg-gold-500/20 text-gold-300' : reward.rarity === 'epic' ? 'bg-purple-500/20 text-purple-300' : reward.rarity === 'rare' ? 'bg-blue-500/20 text-blue-300' : 'bg-white/10 text-white/70'}`}>
                        {reward.rarity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <motion.button
                whileTap={{ scale: 0.98 }}
                className="w-full gold-gradient text-dark-900 font-bold py-3 rounded-xl mt-4"
              >
                Save Configuration
              </motion.button>
            </motion.div>
          )}

          {activeTab === 'stats' && (
            <motion.div key="stats" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h3 className="text-sm font-bold text-gold-300 mb-3">Platform Statistics</h3>
              <div className="space-y-3">
                <div className="glass-card rounded-xl p-4 border border-dark-500">
                  <h4 className="text-xs text-white/50 mb-2">Daily Active Users</h4>
                  <div className="flex items-end gap-1 h-20">
                    {[40, 65, 55, 80, 70, 90, 85].map((h, i) => (
                      <motion.div
                        key={i}
                        initial={{ height: 0 }}
                        animate={{ height: `${h}%` }}
                        transition={{ delay: i * 0.1 }}
                        className="flex-1 gold-gradient rounded-t-sm"
                      />
                    ))}
                  </div>
                  <p className="text-[10px] text-white/40 mt-1 text-center">Last 7 days</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="glass-card rounded-xl p-3 border border-dark-500">
                    <p className="text-[10px] text-white/50">Total Transactions</p>
                    <p className="text-lg font-bold gold-text">12,450</p>
                  </div>
                  <div className="glass-card rounded-xl p-3 border border-dark-500">
                    <p className="text-[10px] text-white/50">Coins in Circulation</p>
                    <p className="text-lg font-bold gold-text">2.4M</p>
                  </div>
                  <div className="glass-card rounded-xl p-3 border border-dark-500">
                    <p className="text-[10px] text-white/50">Rooms Created Today</p>
                    <p className="text-lg font-bold text-green-400">47</p>
                  </div>
                  <div className="glass-card rounded-xl p-3 border border-dark-500">
                    <p className="text-[10px] text-white/50">Games Played Today</p>
                    <p className="text-lg font-bold text-purple-400">1,234</p>
                  </div>
                </div>

                <div className="glass-card rounded-xl p-4 border border-dark-500">
                  <h4 className="text-xs text-white/50 mb-2">Revenue by Game</h4>
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-white/70">Golden Egg</span>
                        <span className="text-gold-400">65%</span>
                      </div>
                      <div className="h-2 bg-dark-700 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: '65%' }} className="h-full gold-gradient rounded-full" />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-white/70">Rocket Game</span>
                        <span className="text-purple-400">25%</span>
                      </div>
                      <div className="h-2 bg-dark-700 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: '25%' }} className="h-full bg-gradient-to-r from-purple-500 to-purple-700 rounded-full" />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-white/70">Voice Rooms</span>
                        <span className="text-blue-400">10%</span>
                      </div>
                      <div className="h-2 bg-dark-700 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: '10%' }} className="h-full bg-gradient-to-r from-blue-500 to-blue-700 rounded-full" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
