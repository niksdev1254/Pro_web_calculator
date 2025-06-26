import React from 'react';
import { Copy, ArrowUpRight } from 'lucide-react';
import { CalculatorHistory } from './Calculator';

interface HistoryProps {
  history: CalculatorHistory[];
  onCopy: (text: string) => void;
  onUse: (expression: string) => void;
}

const History: React.FC<HistoryProps> = ({ history, onCopy, onUse }) => {
  if (history.length === 0) {
    return (
      <div className="text-center text-white/50 py-8">
        <p>No calculations yet</p>
        <p className="text-sm mt-2">Your calculation history will appear here</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
      {history.map((item) => (
        <div
          key={item.id}
          className="bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/10 hover:bg-white/10 transition-all duration-200 group"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="text-white/70 text-sm font-mono truncate">
                {item.expression}
              </div>
              <div className="text-white text-lg font-semibold font-mono">
                = {item.result}
              </div>
              <div className="text-white/40 text-xs mt-1">
                {item.timestamp.toLocaleTimeString()}
              </div>
            </div>
            
            <div className="flex flex-col space-y-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <button
                onClick={() => onCopy(item.result)}
                className="p-1 text-white/60 hover:text-white hover:bg-white/10 rounded transition-all duration-200"
                title="Copy result"
              >
                <Copy className="w-3 h-3" />
              </button>
              <button
                onClick={() => onUse(item.result)}
                className="p-1 text-white/60 hover:text-white hover:bg-white/10 rounded transition-all duration-200"
                title="Use result"
              >
                <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default History;