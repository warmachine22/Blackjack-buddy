import React from 'react';
import { CardValue } from '../types';
import { CARD_VALUES } from '../constants';

interface CardSelectorProps {
  label: string;
  selectedValue: CardValue | null;
  onSelect: (value: CardValue) => void;
  disabled?: boolean;
}

const Card: React.FC<{ value: CardValue; isSelected: boolean; onClick: () => void; disabled: boolean }> = ({ value, isSelected, onClick, disabled }) => {
  const baseClasses = "w-14 h-20 sm:w-16 sm:h-24 rounded-lg flex items-center justify-center font-bold text-2xl border-2 transition-all duration-200 shrink-0";
  const disabledClasses = "bg-gray-700 border-gray-600 text-gray-500 cursor-not-allowed";
  const activeClasses = isSelected 
    ? "bg-white text-black border-yellow-400 scale-105 shadow-lg shadow-yellow-500/30" 
    : "bg-gray-800 border-gray-600 text-white hover:border-yellow-400 hover:scale-105 cursor-pointer";

  return (
    <div
      onClick={!disabled ? onClick : undefined}
      className={`${baseClasses} ${disabled ? disabledClasses : activeClasses}`}
      aria-pressed={isSelected}
      role="button"
      tabIndex={disabled ? -1 : 0}
    >
      {value}
    </div>
  );
};

export const CardSelector: React.FC<CardSelectorProps> = ({ label, selectedValue, onSelect, disabled = false }) => {
  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold text-yellow-400 mb-4 text-center">{label}</h3>
      <div className="grid grid-flow-col auto-cols-max justify-center gap-2 sm:gap-3 overflow-x-auto py-4 px-2 -mx-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {CARD_VALUES.map(card => (
          <Card
            key={card}
            value={card}
            isSelected={selectedValue === card}
            onClick={() => onSelect(card)}
            disabled={disabled}
          />
        ))}
      </div>
    </div>
  );
};