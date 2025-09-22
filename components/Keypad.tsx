import React from 'react';
import { CardValue } from '../types';
import { CARD_VALUES } from '../constants';

interface KeypadProps {
  onKeyPress: (value: CardValue) => void;
  onBackspace: () => void;
  disabled?: boolean;
}

const KEYPAD_LAYOUT: (CardValue | 'BS')[] = [
    'A', '2', '3', '4',
    '5', '6', '7', '8',
    '9', '10', 'J', 'Q',
    'K', 'BS'
];


const KeypadButton: React.FC<{
    value: string;
    onClick: () => void;
    disabled: boolean;
    isBackspace?: boolean;
}> = ({ value, onClick, disabled, isBackspace }) => {
    const baseClasses = "rounded-lg font-bold text-lg sm:text-xl transition-all duration-150 flex items-center justify-center h-12";
    const disabledClasses = "bg-gray-700 text-gray-500 cursor-not-allowed";
    const backspaceClasses = "bg-red-800 hover:bg-red-700 col-span-2";
    const regularClasses = "bg-gray-600 hover:bg-gray-500";
    const activeClasses = isBackspace ? backspaceClasses : regularClasses;

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`${baseClasses} ${disabled ? disabledClasses : activeClasses}`}
            style={{ gridColumn: isBackspace ? 'span 2' : 'span 1' }}
        >
            {isBackspace ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 002.828 0L19 12M3 12l6.414-6.414a2 2 0 012.828 0L19 12"></path>
                </svg>
            ) : value}
        </button>
    );
};


export const Keypad: React.FC<KeypadProps> = ({ onKeyPress, onBackspace, disabled = false }) => {
    return (
        <div className="grid grid-cols-4 gap-2 w-full">
            {KEYPAD_LAYOUT.map(key => {
                if (key === 'BS') {
                    return <KeypadButton key="backspace" value="BS" onClick={onBackspace} disabled={disabled} isBackspace />;
                }
                // We know it's a CardValue here because we've handled 'BS'
                const cardKey = key as CardValue;
                return <KeypadButton key={cardKey} value={cardKey} onClick={() => onKeyPress(cardKey)} disabled={disabled} />;
            })}
        </div>
    );
};