import React from 'react';
import { Loader2 } from 'lucide-react';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  className = '',
  icon: Icon,
  ...props
}) => {
  const baseStyles =
    'relative inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-150 focus:outline-none focus:ring-1 focus:ring-[#C6A15B] focus:ring-offset-1 disabled:opacity-40 disabled:cursor-not-allowed select-none cursor-pointer';

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2 gap-2',
    lg: 'text-base px-6 py-2.5 gap-2.5'
  };

  const variants = {
    // Primary Gold Button with Charcoal Text
    primary:
      'bg-[#C6A15B] hover:bg-[#A98443] text-[#202124] border border-[#C6A15B] shadow-subtle font-bold',
    // Secondary Charcoal Button with White Text
    secondary:
      'bg-[#202124] hover:bg-[#343538] text-[#FFFFFF] border border-[#202124] shadow-subtle',
    // Outline Charcoal Button
    outline:
      'bg-transparent hover:bg-[#E9E6DF]/50 text-[#202124] border border-[#202124]',
    // Dark Charcoal Button
    dark:
      'bg-[#343538] hover:bg-[#202124] text-[#FFFFFF] border border-[#343538] shadow-subtle',
    // Ghost Button
    ghost:
      'bg-transparent hover:bg-[#E9E6DF]/50 text-[#202124] hover:text-[#C6A15B]',
    // Danger Button
    danger:
      'bg-[#202124] hover:bg-[#343538] text-[#FFFFFF] border border-[#343538]',
    // Legacy variant fallbacks
    yellow:
      'bg-[#C6A15B] hover:bg-[#A98443] text-[#202124] border border-[#C6A15B]',
    coral:
      'bg-[#202124] hover:bg-[#343538] text-[#FFFFFF] border border-[#202124]',
    success:
      'bg-[#C6A15B] hover:bg-[#A98443] text-[#202124] border border-[#C6A15B]'
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size] || sizeStyles.md} ${variants[variant] || variants.primary} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin shrink-0" />
      ) : Icon ? (
        <Icon className="w-4 h-4 shrink-0" />
      ) : null}
      {children}
    </button>
  );
};
