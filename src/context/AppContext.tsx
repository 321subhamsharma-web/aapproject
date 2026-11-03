import React, { createContext, useContext, useReducer, ReactNode } from 'react';

export interface User {
  id: string;
  username: string;
  avatar: string;
  level: number;
  coins: number;
  xp: number;
  bio: string;
  achievements: string[];
  joinDate: string;
  isAdmin?: boolean;
}

export interface Room {
  id: string;
  name: string;
  host: User;
  seats: number;
  participants: User[];
  audience: number;
  background: string;
  isLive: boolean;
}

export interface Transaction {
  id: string;
  type: 'earn' | 'spend';
  amount: number;
  description: string;
  timestamp: string;
  source: string;
}

export interface Reward {
  id: string;
  name: string;
  icon: string;
  value: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface LeaderboardEntry {
  rank: number;
  user: User;
  score: number;
  period: 'daily' | 'weekly' | 'monthly';
}

interface AppState {
  currentUser: User | null;
  isAuthenticated: boolean;
  currentScreen: string;
  rooms: Room[];
  transactions: Transaction[];
  leaderboards: LeaderboardEntry[];
  notifications: string[];
}

type Action =
  | { type: 'SET_USER'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'SET_SCREEN'; payload: string }
  | { type: 'UPDATE_COINS'; payload: number }
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'ADD_XP'; payload: number };

const initialState: AppState = {
  currentUser: null,
  isAuthenticated: false,
  currentScreen: 'splash',
  rooms: [],
  transactions: [],
  leaderboards: [],
  notifications: [],
};

function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, currentUser: action.payload, isAuthenticated: true };
    case 'LOGOUT':
      return { ...state, currentUser: null, isAuthenticated: false, currentScreen: 'splash' };
    case 'SET_SCREEN':
      return { ...state, currentScreen: action.payload };
    case 'UPDATE_COINS':
      return state.currentUser
        ? { ...state, currentUser: { ...state.currentUser, coins: action.payload } }
        : state;
    case 'ADD_TRANSACTION':
      return { ...state, transactions: [action.payload, ...state.transactions] };
    case 'ADD_XP':
      return state.currentUser
        ? {
            ...state,
            currentUser: {
              ...state.currentUser,
              xp: state.currentUser.xp + action.payload,
              level: Math.floor((state.currentUser.xp + action.payload) / 100) + 1,
            },
          }
        : state;
    default:
      return state;
  }
}

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<Action>;
}>({ state: initialState, dispatch: () => null });

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
}

export function useApp() {
  return useContext(AppContext);
}

// Mock data
export const mockUser: User = {
  id: 'USR_001',
  username: 'GoldenKing',
  avatar: '👑',
  level: 25,
  coins: 15420,
  xp: 2500,
  bio: 'Voice room enthusiast & Golden Egg champion',
  achievements: ['First Win', '100 Rooms', 'Egg Master', 'Rocket Lv4'],
  joinDate: '2024-01-15',
};

export const mockUsers: User[] = [
  { id: 'USR_001', username: 'GoldenKing', avatar: '👑', level: 25, coins: 15420, xp: 2500, bio: 'Champion', achievements: [], joinDate: '2024-01-15' },
  { id: 'USR_002', username: 'StarQueen', avatar: '⭐', level: 22, coins: 12300, xp: 2200, bio: 'Music lover', achievements: [], joinDate: '2024-02-10' },
  { id: 'USR_003', username: 'NightOwl', avatar: '🦉', level: 18, coins: 8900, xp: 1800, bio: 'Night gamer', achievements: [], joinDate: '2024-03-05' },
  { id: 'USR_004', username: 'PhoenixRise', avatar: '🔥', level: 30, coins: 22100, xp: 3000, bio: 'Rising star', achievements: [], joinDate: '2024-01-01' },
  { id: 'USR_005', username: 'MoonWalker', avatar: '🌙', level: 15, coins: 6500, xp: 1500, bio: 'Space explorer', achievements: [], joinDate: '2024-04-20' },
  { id: 'USR_006', username: 'DiamondHands', avatar: '💎', level: 28, coins: 19800, xp: 2800, bio: 'Collector', achievements: [], joinDate: '2024-02-28' },
  { id: 'USR_007', username: 'ThunderBolt', avatar: '⚡', level: 20, coins: 11200, xp: 2000, bio: 'Fast & furious', achievements: [], joinDate: '2024-03-15' },
  { id: 'USR_008', username: 'CrystalWave', avatar: '🔮', level: 16, coins: 7800, xp: 1600, bio: 'Mystic vibes', achievements: [], joinDate: '2024-05-01' },
];

export const mockRooms: Room[] = [
  { id: 'room_1', name: '🎵 Midnight Melodies', host: mockUsers[0], seats: 8, participants: mockUsers.slice(0, 5), audience: 142, background: 'from-purple-900 to-indigo-900', isLive: true },
  { id: 'room_2', name: '🎮 Gaming Legends', host: mockUsers[3], seats: 15, participants: mockUsers.slice(2, 8), audience: 289, background: 'from-red-900 to-orange-900', isLive: true },
  { id: 'room_3', name: '💬 Chill Talk', host: mockUsers[1], seats: 8, participants: mockUsers.slice(1, 4), audience: 67, background: 'from-blue-900 to-cyan-900', isLive: true },
  { id: 'room_4', name: '🎤 Karaoke Night', host: mockUsers[5], seats: 8, participants: mockUsers.slice(3, 7), audience: 203, background: 'from-pink-900 to-purple-900', isLive: true },
  { id: 'room_5', name: '🌟 VIP Lounge', host: mockUsers[2], seats: 8, participants: mockUsers.slice(0, 3), audience: 45, background: 'from-amber-900 to-yellow-900', isLive: true },
];

export const gameRewards: Reward[] = [
  { id: 'r1', name: 'Coins Bundle', icon: '💰', value: 100, rarity: 'common' },
  { id: 'r2', name: 'Bottle of the Moon', icon: '🌙', value: 500, rarity: 'rare' },
  { id: 'r3', name: 'Dreamcatcher', icon: '🕸️', value: 750, rarity: 'rare' },
  { id: 'r4', name: 'Gold Coin Fountain', icon: '⛲', value: 1000, rarity: 'epic' },
  { id: 'r5', name: 'Scepter of Glory', icon: '🏆', value: 2500, rarity: 'epic' },
  { id: 'r6', name: 'Hot Air Balloon', icon: '🎈', value: 5000, rarity: 'legendary' },
  { id: 'r7', name: 'Pink Necklace', icon: '💎', value: 10000, rarity: 'legendary' },
];

export const mockLeaderboard: LeaderboardEntry[] = mockUsers
  .sort((a, b) => b.coins - a.coins)
  .map((user, index) => ({ rank: index + 1, user, score: user.coins, period: 'daily' as const }));
