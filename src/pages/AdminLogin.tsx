import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, Shield, Clock, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

export function AdminLogin() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login, isLocked, remainingAttempts, lockoutTimeRemaining } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLocked) {
      setError(`Çok fazla yanlış deneme! ${Math.floor(lockoutTimeRemaining / 60)}:${(lockoutTimeRemaining % 60).toString().padStart(2, '0')} sonra tekrar deneyin.`);
      return;
    }

    const success = login(password);
    
    if (success) {
      navigate('/admin');
    } else {
      if (remainingAttempts > 1) {
        setError(`Yanlış şifre! ${remainingAttempts - 1} deneme hakkınız kaldı.`);
      } else {
        setError('Hesap 5 dakika süreyle kilitlendi!');
      }
      setPassword('');
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-2xl p-8 w-full max-w-md shadow-2xl"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Admin Paneli</h1>
          <p className="text-gray-400">Güvenli erişim gereklidir</p>
        </div>

        {/* Lockout Warning */}
        {isLocked && (
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg"
          >
            <div className="flex items-center gap-3 text-red-400">
              <AlertTriangle className="w-5 h-5" />
              <div>
                <p className="font-medium">Hesap Kilitli</p>
                <p className="text-sm flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {formatTime(lockoutTimeRemaining)} sonra tekrar deneyin
                </p>
              </div>
            </div>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Şifre
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <Lock className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
                placeholder="Admin şifresini girin"
                required
                disabled={isLocked}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                disabled={isLocked}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5 text-gray-400 hover:text-gray-300" />
                ) : (
                  <Eye className="w-5 h-5 text-gray-400 hover:text-gray-300" />
                )}
              </button>
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg"
            >
              <p className="text-red-400 text-sm flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                {error}
              </p>
            </motion.div>
          )}

          {!isLocked && remainingAttempts < 3 && (
            <div className="p-3 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
              <p className="text-yellow-400 text-sm">
                ⚠️ {remainingAttempts} deneme hakkınız kaldı
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLocked || !password.trim()}
            className={`w-full py-3 rounded-lg font-medium transition-all ${
              isLocked || !password.trim()
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl'
            }`}
          >
            {isLocked ? 'Hesap Kilitli' : 'Giriş Yap'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button
            onClick={() => navigate('/')}
            className="text-gray-400 hover:text-white transition-colors text-sm"
          >
            ← Ana sayfaya dön
          </button>
        </div>

        {/* Security Info */}
        <div className="mt-6 p-3 bg-gray-700/30 rounded-lg">
          <p className="text-xs text-gray-400 text-center">
            🔒 Bu sayfa SSL ile korunmaktadır<br />
            3 yanlış deneme sonrası 5 dakika erişim engeli
          </p>
        </div>
      </motion.div>
    </div>
  );
} 