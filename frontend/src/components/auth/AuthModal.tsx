import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { GlassModal } from '../ui/GlassModal';
import { GlassInput } from '../ui/GlassInput';
import { GlassButton } from '../ui/GlassButton';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'signin' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'signin'
}) => {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    if (mode === 'signup' && password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      if (mode === 'signin') {
        await signIn(email, password);
        toast.success('Signed in successfully!');
      } else {
        await signUp(email, password);
        toast.success('Account created successfully! You can now sign in.');
      }
      onClose();
      resetForm();
    } catch (error: any) {
      toast.error(error.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setShowPassword(false);
  };

  const switchMode = () => {
    setMode(mode === 'signin' ? 'signup' : 'signin');
    resetForm();
  };

  return (
    <GlassModal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'signin' ? 'Sign In' : 'Create Account'}
      size="sm"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <GlassInput
          label="Email Address"
          type="email"
          value={email}
          onChange={setEmail}
          icon={<Mail />}
          required
        />

        <div className="relative">
          <GlassInput
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={setPassword}
            icon={<Lock />}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-white/60 hover:text-white"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        {mode === 'signup' && (
          <GlassInput
            label="Confirm Password"
            type={showPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={setConfirmPassword}
            icon={<Lock />}
            required
          />
        )}

        <GlassButton
          type="submit"
          variant="primary"
          loading={loading}
          className="w-full"
        >
          {mode === 'signin' ? 'Sign In' : 'Create Account'}
        </GlassButton>

        <div className="text-center">
          <button
            type="button"
            onClick={switchMode}
            className="text-white/70 hover:text-white transition-colors"
          >
            {mode === 'signin' 
              ? "Don't have an account? Sign up" 
              : "Already have an account? Sign in"
            }
          </button>
        </div>

        {mode === 'signup' && (
          <div className="text-xs text-white/60 text-center">
            By creating an account, you agree to our Terms of Service and Privacy Policy.
          </div>
        )}
      </form>
    </GlassModal>
  );
};