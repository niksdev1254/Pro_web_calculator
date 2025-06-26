import React from 'react';
import { Copy } from 'lucide-react';

interface DisplayProps {
  display: string;
  expression: string;
  memory: number;
  isDarkMode: boolean;
}

const Display: React.FC<DisplayProps> = ({ display, expression, memory, isDarkMode }) => {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(display);
  };

  return (
    <div className="mb-6">
      {/* Memory Indicator */}
      {memory !== 0 && (
        <div className="text-right mb-2">
          <span className="text-xs text-white/60 bg-white/10 px-2 py-1 rounded-full">
            M: {memory}
          </span>
        </div>
      )}
      
      {/* Expression */}
      <div className="text-right mb-2 h-6">
        <span className="text-white/70 text-sm font-mono">
          {expression || '\u00A0'}
        </span>
      </div>
      
      {/* Main Display */}
      <div className="relative">
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex-1 text-right overflow-hidden">
              <span className="text-white text-3xl md:text-4xl font-light font-mono leading-none block truncate">
                {display}
              </span>
            </div>
            <button
              onClick={copyToClipboard}
              className="ml-3 p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
              title="Copy to clipboard"
            >
              <Copy className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* Animated underline */}
        <div className="h-0.5 bg-gradient-to-r from-transparent via-white/50 to-transparent rounded-full mt-2 animate-pulse" />
      </div>
    </div>
  );
};

export default Display;