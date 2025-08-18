import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface GlassInputProps {
  label?: string;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  required?: boolean;
  multiline?: boolean;
  rows?: number;
  icon?: React.ReactNode;
  className?: string;
}

export const GlassInput: React.FC<GlassInputProps> = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  required = false,
  multiline = false,
  rows = 3,
  icon,
  className = ''
}) => {
  const [focused, setFocused] = useState(false);

  const baseClasses = `
    w-full px-4 py-3 
    bg-white/10 backdrop-blur-md
    border border-white/20 rounded-lg
    text-white placeholder-white/60
    focus:outline-none focus:border-white/40 focus:bg-white/15
    transition-all duration-200
    ${error ? 'border-red-400/50 focus:border-red-400' : ''}
    ${icon ? 'pl-12' : ''}
    ${className}
  `;

  const InputComponent = multiline ? 'textarea' : 'input';

  return (
    <div className="relative">
      {label && (
        <motion.label
          className={`
            absolute left-4 transition-all duration-200 pointer-events-none
            ${focused || value ? 'top-2 text-xs text-white/80' : 'top-3 text-base text-white/60'}
          `}
          animate={{
            y: focused || value ? -8 : 0,
            scale: focused || value ? 0.85 : 1,
          }}
        >
          {label} {required && <span className="text-red-400">*</span>}
        </motion.label>
      )}
      
      {icon && (
        <div className="absolute left-4 top-3 text-white/60 w-4 h-4">
          {icon}
        </div>
      )}

      <InputComponent
        type={multiline ? undefined : type}
        placeholder={focused ? placeholder : ''}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        rows={multiline ? rows : undefined}
        className={baseClasses}
        style={{ paddingTop: label ? '1.5rem' : '0.75rem' }}
      />

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1 text-sm text-red-400"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
};