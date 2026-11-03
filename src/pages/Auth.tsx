import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp, mockUser } from '../context/AppContext';

export function SplashScreen() {
  const { dispatch } = useApp();

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch({ type: 'SET_SCREEN', payload: 'login' });
    }, 3000);
    return () => clearTimeout(timer);
  }, [dispatch]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-dark-900 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-dark-900 to-dark-900" />
      <div className="absolute top-20 left-10 w-32 h-32 bg-gold-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
      
      {/* Logo */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', duration: 1.5 }}
        className="relative z-10"
      >
        <div className="w-32 h-32 rounded-full gold-gradient flex items-center justify-center animate-pulse-glow">
          <span className="text-5xl">🎙️</span>
        </div>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-4xl font-bold mt-8 gold-text"
        style={{ fontFamily: 'Orbitron, sans-serif' }}
      >
        VoicePlay
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="text-gold-300/70 mt-3 text-lg"
      >
        Social Voice & Gaming
      </motion.p>

      {/* Loading dots */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="flex gap-2 mt-12"
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-3 h-3 rounded-full bg-gold-500"
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </motion.div>
    </div>
  );
}

export function LoginScreen() {
  const { dispatch } = useApp();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = () => {
    setIsLoading(true);
    setTimeout(() => {
      dispatch({ type: 'SET_USER', payload: mockUser });
      dispatch({ type: 'SET_SCREEN', payload: 'home' });
      setIsLoading(false);
    }, 1500);
  };

  const handleGoogleSignIn = () => {
    setIsLoading(true);
    setTimeout(() => {
      dispatch({ type: 'SET_USER', payload: mockUser });
      dispatch({ type: 'SET_SCREEN', payload: 'home' });
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-dark-900 relative overflow-hidden px-6">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-dark-900 to-navy-glow/20" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl" />
      
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto rounded-full gold-gradient flex items-center justify-center mb-4 animate-pulse-glow">
            <span className="text-3xl">🎙️</span>
          </div>
          <h1 className="text-3xl font-bold gold-text" style={{ fontFamily: 'Orbitron, sans-serif' }}>
            VoicePlay
          </h1>
        </div>

        {/* Form Card */}
        <div className="glass-card rounded-2xl p-6 glow-border">
          <AnimatePresence mode="wait">
            <motion.div
              key={isLogin ? 'login' : 'register'}
              initial={{ opacity: 0, x: isLogin ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isLogin ? 20 : -20 }}
            >
              <h2 className="text-xl font-bold text-white mb-6 text-center">
                {isLogin ? 'Welcome Back' : 'Create Account'}
              </h2>

              {!isLogin && (
                <div className="mb-4">
                  <label className="text-gold-300/70 text-sm mb-1 block">Username</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-dark-700 border border-gold-500/20 rounded-xl px-4 py-3 text-white focus:border-gold-500 focus:outline-none transition-colors"
                    placeholder="Enter username"
                  />
                </div>
              )}

              <div className="mb-4">
                <label className="text-gold-300/70 text-sm mb-1 block">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-dark-700 border border-gold-500/20 rounded-xl px-4 py-3 text-white focus:border-gold-500 focus:outline-none transition-colors"
                  placeholder="Enter email"
                />
              </div>

              <div className="mb-4">
                <label className="text-gold-300/70 text-sm mb-1 block">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-dark-700 border border-gold-500/20 rounded-xl px-4 py-3 text-white focus:border-gold-500 focus:outline-none transition-colors"
                  placeholder="Enter password"
                />
              </div>

              {isLogin && (
                <div className="text-right mb-4">
                  <button className="text-gold-400 text-sm hover:text-gold-300 transition-colors">
                    Forgot Password?
                  </button>
                </div>
              )}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full gold-gradient text-dark-900 font-bold py-3 rounded-xl mb-4 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <motion.div
                    className="w-5 h-5 border-2 border-dark-900 border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  />
                ) : (
                  <>{isLogin ? 'Sign In' : 'Create Account'}</>
                )}
              </motion.button>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-dark-400" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 text-dark-400 bg-dark-800">or continue with</span>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleGoogleSignIn}
                className="w-full bg-dark-700 border border-dark-400 text-white font-medium py-3 rounded-xl flex items-center justify-center gap-3 hover:border-gold-500/30 transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Sign in with Google
              </motion.button>
            </motion.div>
          </AnimatePresence>

          <p className="text-center text-dark-400 mt-6 text-sm">
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-gold-400 font-medium hover:text-gold-300 transition-colors"
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
