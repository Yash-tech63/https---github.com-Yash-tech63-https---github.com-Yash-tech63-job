import React from 'react';

export const GlassCard = ({
  children,
  className = '',
  hoverEffect = true,
  glow = false,
  onClick,
  ...props
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-[#FFFFFF] rounded-xl p-6 border border-[#E9E6DF] text-[#202124] shadow-card transition-all duration-200 ${
        hoverEffect ? 'hover:border-[#C6A15B] hover:shadow-subtle' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
