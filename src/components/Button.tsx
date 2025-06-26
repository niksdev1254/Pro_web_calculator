import React from 'react';

interface ButtonProps {
  value: React.ReactNode;
  onClick?: () => void;
  type?: 'number' | 'operator' | 'equals' | 'clear' | 'function' | 'memory' | 'constant';
  className?: string;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  value, 
  onClick, 
  type = 'number', 
  className = '', 
  disabled = false 
}) => {
  const getButtonStyles = () => {
    const baseStyles = "h-12 sm:h-14 rounded-2xl font-semibold text-sm sm:text-lg transition-all duration-200 transform active:scale-95 backdrop-blur-sm border border-white/10 shadow-lg hover:shadow-xl flex items-center justify-center";
    
    switch (type) {
      case 'number':
        return `${baseStyles} bg-white/20 text-white hover:bg-white/30 active:bg-white/40`;
      case 'operator':
        return `${baseStyles} bg-orange-500/80 text-white hover:bg-orange-500/90 active:bg-orange-500`;
      case 'equals':
        return `${baseStyles} bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 active:from-green-700 active:to-emerald-700`;
      case 'clear':
        return `${baseStyles} bg-red-500/80 text-white hover:bg-red-500/90 active:bg-red-500`;
      case 'function':
        return `${baseStyles} bg-purple-500/80 text-white hover:bg-purple-500/90 active:bg-purple-500 text-xs sm:text-sm`;
      case 'memory':
        return `${baseStyles} bg-blue-500/80 text-white hover:bg-blue-500/90 active:bg-blue-500 text-xs sm:text-sm`;
      case 'constant':
        return `${baseStyles} bg-indigo-500/80 text-white hover:bg-indigo-500/90 active:bg-indigo-500`;
      default:
        return `${baseStyles} bg-white/20 text-white hover:bg-white/30`;
    }
  };

  return (
    <button
      className={`${getButtonStyles()} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {value}
    </button>
  );
};

export default Button;