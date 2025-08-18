import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, User, LogOut, Menu, X } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { GlassButton } from '../ui/GlassButton';
import { AuthModal } from '../auth/AuthModal';
import { useAuth } from '../../hooks/useAuth';

export const Navbar: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const openAuthModal = (mode: 'signin' | 'signup') => {
    setAuthMode(mode);
    setShowAuthModal(true);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-40 p-4">
        <GlassCard className="px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <Sparkles className="w-8 h-8 text-blue-400" />
              <span className="text-xl font-bold text-white">AI Resume</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              <Link 
                to="/" 
                className="text-white/80 hover:text-white transition-colors"
              >
                Home
              </Link>
              <Link 
                to="/builder" 
                className="text-white/80 hover:text-white transition-colors"
              >
                Builder
              </Link>
              {user && (
                <Link 
                  to="/dashboard" 
                  className="text-white/80 hover:text-white transition-colors"
                >
                  Dashboard
                </Link>
              )}
            </div>

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center gap-3">
              {user ? (
                <div className="flex items-center gap-3">
                  <span className="text-white/80 text-sm">
                    {user.email}
                  </span>
                  <GlassButton
                    variant="outline"
                    size="sm"
                    icon={<LogOut />}
                    onClick={handleSignOut}
                  >
                    Sign Out
                  </GlassButton>
                </div>
              ) : (
                <>
                  <GlassButton
                    variant="outline"
                    size="sm"
                    onClick={() => openAuthModal('signin')}
                  >
                    Sign In
                  </GlassButton>
                  <GlassButton
                    variant="primary"
                    size="sm"
                    onClick={() => openAuthModal('signup')}
                  >
                    Sign Up
                  </GlassButton>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <GlassButton
              variant="ghost"
              size="sm"
              icon={mobileMenuOpen ? <X /> : <Menu />}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden"
            />
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mt-4 pt-4 border-t border-white/20"
            >
              <div className="flex flex-col gap-4">
                <Link 
                  to="/" 
                  className="text-white/80 hover:text-white transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </Link>
                <Link 
                  to="/builder" 
                  className="text-white/80 hover:text-white transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Builder
                </Link>
                {user && (
                  <Link 
                    to="/dashboard" 
                    className="text-white/80 hover:text-white transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                )}
                
                <div className="flex flex-col gap-2 pt-2 border-t border-white/20">
                  {user ? (
                    <>
                      <span className="text-white/80 text-sm">
                        {user.email}
                      </span>
                      <GlassButton
                        variant="outline"
                        size="sm"
                        icon={<LogOut />}
                        onClick={handleSignOut}
                        className="w-full"
                      >
                        Sign Out
                      </GlassButton>
                    </>
                  ) : (
                    <>
                      <GlassButton
                        variant="outline"
                        size="sm"
                        onClick={() => openAuthModal('signin')}
                        className="w-full"
                      >
                        Sign In
                      </GlassButton>
                      <GlassButton
                        variant="primary"
                        size="sm"
                        onClick={() => openAuthModal('signup')}
                        className="w-full"
                      >
                        Sign Up
                      </GlassButton>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </GlassCard>
      </nav>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode={authMode}
      />
    </>
  );
};