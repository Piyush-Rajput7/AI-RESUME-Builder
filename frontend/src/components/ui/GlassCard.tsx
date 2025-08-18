import React from 'react';
import { motion } from 'framer-motion';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  blur?: 'sm' | 'md' | 'lg';
  opacity?: 'low' | 'medium' | 'high';
  gradient?: boolean;
  onClick?: () => void;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  hover = true,
  blur = 'md',
  opacity = 'medium',
  gradient = false,
  onClick
}) => {
  const blurClasses = {
    sm: 'backdrop-blur-sm',
    md: 'backdrop-blur-md',
    lg: 'backdrop-blur-lg'
  };

  const opacityClasses = {
    low: 'bg-white/5 border-white/10',
    medium: 'bg-white/10 border-white/20',
    high: 'bg-white/20 border-white/30'
  };

  const baseClasses = `
    ${blurClasses[blur]}
    ${opacityClasses[opacity]}
    border rounded-xl
    shadow-lg shadow-black/10
    ${gradient ? 'bg-gradient-to-br from-white/20 to-white/5' : ''}
    ${onClick ? 'cursor-pointer' : ''}
    ${className}
  `;

  const hoverAnimation = hover ? {
    scale: 1.02,
    y: -2,
    transition: { duration: 0.2 }
  } : {};

  return (
    <motion.div
      className={baseClasses}
      whileHover={hoverAnimation}
      whileTap={onClick ? { scale: 0.98 } : {}}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
};