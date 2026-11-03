import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Users, Headphones, Search, Bell, Crown, MessageCircle, X, Send, Share2, Flag, Volume2, VolumeX } from 'lucide-react';
import { useApp, mockRooms, mockUsers, Room, User } from '../context/AppContext';

export function HomeScreen() {
  const { state, dispatch } = useApp();
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRooms = mockRooms.filter(room =>
    room.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (selectedRoom) {
    return <VoiceRoomScreen room={selectedRoom} onBack={() => setSelectedRoom(null)} />;
  }

  return (
    <div className="min-h-screen bg-dark-900 pb-20">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-dark-900/90 backdrop-blur-lg border-b border-gold-500/10 px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full gold-gradient flex items-center justify-center">
              <span className="text-sm">🎙️</span>
            </div>
            <h1 className="text-lg font-bold gold-text" style={{ fontFamily: 'Orbitron, sans-serif' }}>
              VoicePlay
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <motion.button whileTap={{ scale: 0.9 }} className="relative">
              <Bell className="w-5 h-5 text-gold-400" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-[8px] flex items-center justify-center">3</span>
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => dispatch({ type: 'SET_SCREEN', payload: 'profile' })}
              className="w-8 h-8 rounded-full bg-dark-600 border border-gold-500/30 flex items-center justify-center"
            >
              <span className="text-sm">{state.currentUser?.avatar}</span>
            </motion.button>
          </div>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search rooms..."
            className="w-full bg-dark-700 border border-dark-500 rounded-full pl-10 pr-4 py-2 text-sm text-white focus:border-gold-500/30 focus:outline-none transition-colors"
          />
        </div>
      </div>

      {/* Banner */}
      <div className="px-4 py-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-2xl overflow-hidden h-36 bg-gradient-to-r from-purple-900 via-dark-700 to-gold-900/30 border border-gold-500/20"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-800/40 to-transparent" />
          <div className="relative z-10 p-5 flex flex-col justify-center h-full">
            <h2 className="text-xl font-bold text-white mb-1">🎉 Golden Egg Event</h2>
            <p className="text-gold-300/80 text-sm mb-3">Smash eggs & win amazing rewards!</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => dispatch({ type: 'SET_SCREEN', payload: 'goldenegg' })}
              className="gold-gradient text-dark-900 font-bold px-4 py-1.5 rounded-full text-sm w-fit"
            >
              Play Now
            </motion.button>
          </div>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-6xl animate-bounce-soft">🥚</div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <div className="px-4 mb-4">
        <div className="grid grid-cols-4 gap-3">
          {[
            { icon: '🥚', label: 'Golden Egg', screen: 'goldenegg' },
            { icon: '🚀', label: 'Rocket', screen: 'rocket' },
            { icon: '🏆', label: 'Ranks', screen: 'leaderboard' },
            { icon: '💰', label: 'Wallet', screen: 'wallet' },
          ].map((item, i) => (
            <motion.button
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => dispatch({ type: 'SET_SCREEN', payload: item.screen })}
              className="glass-card rounded-xl p-3 flex flex-col items-center gap-1 border border-gold-500/10 hover:border-gold-500/30 transition-colors"
            >
              <span className="text-2xl">{item.icon}</span>
              <span className="text-[10px] text-gold-300/70">{item.label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Live Rooms */}
      <div className="px-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            Live Rooms
          </h2>
          <button className="text-gold-400 text-sm">See All</button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {filteredRooms.map((room, i) => (
            <motion.div
              key={room.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedRoom(room)}
              className={`relative rounded-2xl overflow-hidden cursor-pointer bg-gradient-to-br ${room.background} h-44 border border-white/10`}
            >
              <div className="absolute inset-0 bg-black/30" />
              <div className="relative z-10 p-3 flex flex-col h-full">
                <div className="flex items-center gap-1 mb-1">
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  <span className="text-[10px] text-red-300">LIVE</span>
                </div>
                <h3 className="text-sm font-bold text-white line-clamp-1">{room.name}</h3>
                <div className="flex items-center gap-1 mt-1">
                  <Users className="w-3 h-3 text-white/60" />
                  <span className="text-[10px] text-white/60">{room.audience}</span>
                </div>
                <div className="flex-1" />
                <div className="flex items-center gap-1">
                  <div className="flex -space-x-2">
                    {room.participants.slice(0, 4).map((p) => (
                      <div key={p.id} className="w-6 h-6 rounded-full bg-dark-600 border border-white/20 flex items-center justify-center text-xs">
                        {p.avatar}
                      </div>
                    ))}
                  </div>
                  {room.participants.length > 4 && (
                    <span className="text-[10px] text-white/60">+{room.participants.length - 4}</span>
                  )}
                </div>
              </div>
              {/* Host badge */}
              <div className="absolute top-2 right-2 bg-gold-500/20 backdrop-blur-sm rounded-full px-2 py-0.5 flex items-center gap-1">
                <Crown className="w-3 h-3 text-gold-400" />
                <span className="text-[9px] text-gold-300">{room.host.username}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Create Room Button */}
      <div className="px-4 mt-6">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full glass-card rounded-xl p-4 border border-gold-500/20 flex items-center justify-center gap-3 glow-border"
        >
          <Mic className="w-5 h-5 text-gold-400" />
          <span className="text-gold-300 font-medium">Create a Voice Room</span>
        </motion.button>
      </div>
    </div>
  );
}

function VoiceRoomScreen({ room, onBack }: { room: Room; onBack: () => void }) {
  const [messages, setMessages] = useState([
    { id: '1', user: mockUsers[0], text: 'Hey everyone! Welcome to the room 🎉', time: '2m ago' },
    { id: '2', user: mockUsers[1], text: 'Great vibes tonight!', time: '1m ago' },
    { id: '3', user: mockUsers[2], text: 'Love this song!', time: '30s ago' },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isMuted, setIsMuted] = useState(true);
  const [activeTab, setActiveTab] = useState<'chat' | 'all'>('chat');
  const [showUserList, setShowUserList] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    setMessages([...messages, {
      id: Date.now().toString(),
      user: mockUsers[0],
      text: newMessage,
      time: 'now'
    }]);
    setNewMessage('');
  };

  const totalSeats = room.seats;
  const seatSlots = Array.from({ length: totalSeats }, (_, i) => room.participants[i] || null);

  return (
    <div className={`min-h-screen bg-gradient-to-b ${room.background} relative`}>
      <div className="absolute inset-0 bg-black/50" />
      
      {/* Header */}
      <div className="relative z-20 px-4 py-3 flex items-center justify-between bg-black/30 backdrop-blur-sm">
        <motion.button whileTap={{ scale: 0.9 }} onClick={onBack}>
          <X className="w-6 h-6 text-white" />
        </motion.button>
        <div className="text-center">
          <h2 className="text-sm font-bold text-white">{room.name}</h2>
          <div className="flex items-center justify-center gap-2 text-[10px] text-white/60">
            <span className="flex items-center gap-1">
              <Headphones className="w-3 h-3" /> {room.audience}
            </span>
            <span className="flex items-center gap-1">
              <Mic className="w-3 h-3" /> {room.participants.length}/{totalSeats}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowUserList(!showUserList)}>
            <Users className="w-5 h-5 text-white/80" />
          </button>
          <button>
            <Share2 className="w-5 h-5 text-white/80" />
          </button>
        </div>
      </div>

      {/* Seats Grid */}
      <div className="relative z-10 px-4 py-6">
        <div className="grid grid-cols-4 gap-3 max-w-sm mx-auto">
          {seatSlots.map((participant, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col items-center"
            >
              <div
                onClick={() => participant && setSelectedUser(participant)}
                className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl relative cursor-pointer
                  ${i === 0 ? 'gold-gradient ring-2 ring-gold-400' : participant ? 'bg-dark-600 border border-purple-400/50' : 'bg-dark-700 border border-dashed border-white/20'}
                `}
              >
                {participant ? participant.avatar : (
                  <Mic className="w-5 h-5 text-white/30" />
                )}
                {i === 0 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-gold-500 rounded-full flex items-center justify-center">
                    <Crown className="w-3 h-3 text-dark-900" />
                  </div>
                )}
                {participant && !isMuted && i < 3 && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                    <Volume2 className="w-2.5 h-2.5 text-white" />
                  </div>
                )}
              </div>
              <span className="text-[9px] text-white/60 mt-1 text-center truncate w-14">
                {participant?.username || `Seat ${i + 1}`}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Chat Section */}
      <div className="relative z-10 flex-1 mx-4 bg-black/40 backdrop-blur-sm rounded-t-2xl border border-white/10 flex flex-col" style={{ height: 'calc(100vh - 380px)' }}>
        {/* Tabs */}
        <div className="flex border-b border-white/10">
          {(['chat', 'all'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 text-sm font-medium capitalize transition-colors
                ${activeTab === tab ? 'text-gold-400 border-b-2 border-gold-400' : 'text-white/50'}`}
            >
              {tab === 'chat' ? '💬 Chat' : '🌐 All'}
            </button>
          ))}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-2"
              >
                <div className="w-6 h-6 rounded-full bg-dark-600 flex items-center justify-center text-xs flex-shrink-0">
                  {msg.user.avatar}
                </div>
                <div>
                  <span className="text-[10px] text-gold-400 font-medium">{msg.user.username}</span>
                  <p className="text-xs text-white/80">{msg.text}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Message Input */}
        <div className="p-3 border-t border-white/10 flex items-center gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Say something..."
            className="flex-1 bg-dark-700 border border-white/10 rounded-full px-4 py-2 text-sm text-white focus:outline-none focus:border-gold-500/30"
          />
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={sendMessage}
            className="w-8 h-8 rounded-full gold-gradient flex items-center justify-center"
          >
            <Send className="w-4 h-4 text-dark-900" />
          </motion.button>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="relative z-20 px-4 py-3 bg-black/60 backdrop-blur-sm flex items-center justify-around">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsMuted(!isMuted)}
          className={`w-12 h-12 rounded-full flex items-center justify-center
            ${isMuted ? 'bg-dark-600 border border-white/20' : 'bg-green-500/20 border border-green-400'}`}
        >
          {isMuted ? <VolumeX className="w-5 h-5 text-white/60" /> : <Volume2 className="w-5 h-5 text-green-400" />}
        </motion.button>
        
        <motion.button
          whileTap={{ scale: 0.9 }}
          className="w-12 h-12 rounded-full gold-gradient flex items-center justify-center animate-pulse-glow"
        >
          <Mic className="w-5 h-5 text-dark-900" />
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.9 }}
          className="w-12 h-12 rounded-full bg-red-500/20 border border-red-400 flex items-center justify-center"
        >
          <Flag className="w-5 h-5 text-red-400" />
        </motion.button>
      </div>

      {/* User List Modal */}
      <AnimatePresence>
        {showUserList && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 flex items-end"
            onClick={() => setShowUserList(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="w-full bg-dark-800 rounded-t-2xl p-4 max-h-[60vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-bold text-white mb-4">Online Users ({room.audience})</h3>
              <div className="space-y-2">
                {room.participants.map(user => (
                  <div key={user.id} className="flex items-center gap-3 p-2 rounded-xl bg-dark-700">
                    <div className="w-10 h-10 rounded-full bg-dark-600 flex items-center justify-center text-lg">
                      {user.avatar}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">{user.username}</p>
                      <p className="text-[10px] text-white/50">Level {user.level}</p>
                    </div>
                    <div className="flex items-center gap-1 text-gold-400">
                      <span className="text-xs">Lv.{user.level}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* User Profile Popup */}
      <AnimatePresence>
        {selectedUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-6"
            onClick={() => setSelectedUser(null)}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="glass-card rounded-2xl p-6 w-full max-w-xs glow-border"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="w-16 h-16 mx-auto rounded-full gold-gradient flex items-center justify-center text-3xl mb-3">
                  {selectedUser.avatar}
                </div>
                <h3 className="text-lg font-bold text-white">{selectedUser.username}</h3>
                <p className="text-gold-400 text-sm">Level {selectedUser.level}</p>
                <p className="text-white/50 text-xs mt-1">{selectedUser.bio}</p>
                <div className="flex justify-center gap-4 mt-4">
                  <div className="text-center">
                    <p className="text-gold-400 font-bold">{selectedUser.coins}</p>
                    <p className="text-[10px] text-white/50">Coins</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gold-400 font-bold">{selectedUser.xp}</p>
                    <p className="text-[10px] text-white/50">XP</p>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <button className="flex-1 gold-gradient text-dark-900 font-bold py-2 rounded-xl text-sm">
                    Follow
                  </button>
                  <button className="flex-1 bg-dark-600 border border-gold-500/20 text-white py-2 rounded-xl text-sm">
                    Gift
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
