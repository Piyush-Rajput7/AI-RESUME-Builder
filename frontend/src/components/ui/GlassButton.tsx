import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface GlassButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

export const GlassButton: React.FC<GlassButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  onClick,
  type = 'button',
  className = ''
}) => {
  const variants = {
    primary: 'bg-gradient-to-r from-blue-500/20 to-purple-600/20 border-blue-400/30 text-white hover:from-blue-500/30 hover:to-purple-600/30',
    secondary: 'bg-white/10 border-white/20 text-white hover:bg-white/20',
    outline: 'bg-transparent border-white/30 text-white hover:bg-white/10',
    ghost: 'bg-transparent border-transparent text-white hover:bg-white/10'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  const baseClasses = `
    ${variants[variant]}
    ${sizes[size]}
    backdrop-blur-md border rounded-lg
    font-medium transition-all duration-200
    flex items-center justify-center gap-2
    shadow-lg shadow-black/10
    disabled:opacity-50 disabled:cursor-not-allowed
    ${className}
  `;

  return (
    <motion.button
      type={type}
      className={baseClasses}
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.1 }}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : icon ? (
        <span className="w-4 h-4">{icon}</span>
      ) : null}
      {children}
    </motion.button>
  );
};