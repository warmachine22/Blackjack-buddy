import React from 'react';

interface ResultDisplayProps {
  strategy: string | null;
  isLoading: boolean;
  error: string | null;
}

const getStrategyColor = (strategy: string | null): string => {
  switch (strategy?.toLowerCase()) {
    case 'hit':
      return 'text-green-400';
    case 'double down':
      return 'text-green-300';
    case 'stand':
      return 'text-red-400';
    case 'split':
      return 'text-blue-400';
    case 'surrender':
        return 'text-gray-400';
    default:
      return 'text-white';
  }
};

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ strategy, isLoading, error }) => {
  return (
    <div className="w-full bg-black bg-opacity-30 rounded-lg p-2 h-28 flex items-center justify-center text-center border border-gray-700">
      {isLoading ? (
        <div className="flex flex-col items-center gap-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400"></div>
          <p className="text-yellow-400 text-sm">Calculating...</p>
        </div>
      ) : error ? (
        <div className="text-red-400 p-2">
            <p className="font-bold text-base">Error</p>
            <p className="text-xs mt-1">{error}</p>
        </div>
      ) : strategy ? (
        <div>
            <p className="text-gray-400 text-xs uppercase tracking-widest">Recommended Action</p>
            <p className={`text-4xl sm:text-5xl font-black tracking-wider mt-1 ${getStrategyColor(strategy)}`}>
                {strategy.toUpperCase()}
            </p>
        </div>
      ) : (
        <p className="text-gray-500 text-sm px-4">Select cards to see the result.</p>
      )}
    </div>
  );
};