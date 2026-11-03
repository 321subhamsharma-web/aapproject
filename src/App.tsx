import { AnimatePresence, motion } from 'framer-motion';
import { Home, Gamepad2, User, Trophy, Shield } from 'lucide-react';
import { AppProvider, useApp } from './context/AppContext';
import { SplashScreen, LoginScreen } from './pages/Auth';
import { HomeScreen } from './pages/Home';
import { GoldenEggScreen } from './pages/GoldenEgg';
import { RocketScreen } from './pages/Rocket';
import { WalletScreen, ProfileScreen, LeaderboardScreen } from './pages/Social';
import { AdminScreen } from './pages/Admin';

function BottomNav() {
  const { state, dispatch } = useApp();
  const currentScreen = state.currentScreen;

  const navItems = [
    { key: 'home', icon: Home, label: 'Home' },
    { key: 'goldenegg', icon: Gamepad2, label: 'Games' },
    { key: 'leaderboard', icon: Trophy, label: 'Ranks' },
    { key: 'wallet', icon: User, label: 'Wallet' },
    { key: 'admin', icon: Shield, label: 'Admin' },
  ];

  // Hide nav on certain screens
  const hiddenScreens = ['splash', 'login', 'admin'];
  if (hiddenScreens.includes(currentScreen)) return null;

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 z-40 bg-dark-900/95 backdrop-blur-lg border-t border-gold-500/10"
    >
      <div className="flex items-center justify-around px-2 py-2 max-w-lg mx-auto">
        {navItems.map(item => {
          const isActive = currentScreen === item.key || 
            (item.key === 'home' && ['home'].includes(currentScreen)) ||
            (item.key === 'goldenegg' && ['goldenegg', 'rocket'].includes(currentScreen)) ||
            (item.key === 'wallet' && ['wallet', 'profile'].includes(currentScreen));
          
          return (
            <motion.button
              key={item.key}
              whileTap={{ scale: 0.9 }}
              onClick={() => dispatch({ type: 'SET_SCREEN', payload: item.key })}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-colors
                ${isActive ? 'text-gold-400' : 'text-white/40'}`}
            >
              <div className={`p-1.5 rounded-xl ${isActive ? 'bg-gold-500/10' : ''}`}>
                <item.icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-medium">{item.label}</span>
              {isActive && (
                <motion.div
                  layoutId="navIndicator"
                  className="w-4 h-0.5 gold-gradient rounded-full mt-0.5"
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}

function AppContent() {
  const { state } = useApp();

  const renderScreen = () => {
    switch (state.currentScreen) {
      case 'splash':
        return <SplashScreen />;
      case 'login':
        return <LoginScreen />;
      case 'home':
        return <HomeScreen />;
      case 'goldenegg':
        return <GoldenEggScreen />;
      case 'rocket':
        return <RocketScreen />;
      case 'wallet':
        return <WalletScreen />;
      case 'profile':
        return <ProfileScreen />;
      case 'leaderboard':
        return <LeaderboardScreen />;
      case 'admin':
        return <AdminScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <div className="max-w-lg mx-auto min-h-screen bg-dark-900 relative">
      <AnimatePresence mode="wait">
        <motion.div
          key={state.currentScreen}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {renderScreen()}
        </motion.div>
      </AnimatePresence>
      <BottomNav />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
