import React, { useState, useCallback, useEffect, useRef } from 'react';
import { CardValue } from './types';
import { ResultDisplay } from './components/ResultDisplay';
import { getBlackjackStrategy } from './services/geminiService';
import { StrategyChart } from './components/StrategyChart';
import { Keypad } from './components/Keypad';

const InputDisplay: React.FC<{ label: string; value: string; isActive: boolean }> = ({ label, value, isActive }) => (
    <div className="w-full bg-black bg-opacity-20 rounded-lg p-2 text-center border-2 border-transparent data-[active=true]:border-yellow-400" data-active={isActive}>
        <p className="text-xs uppercase font-semibold text-gray-400">{label}</p>
        <div className="text-3xl font-bold text-white h-10 flex items-center justify-center">
            {value}
            {isActive && <span className="w-0.5 h-6 bg-yellow-400 ml-1 animate-pulse"></span>}
        </div>
    </div>
);

const App: React.FC = () => {
    const [dealerInput, setDealerInput] = useState('');
    const [playerInput, setPlayerInput] = useState('');
    const [activeInput, setActiveInput] = useState<'dealer' | 'player'>('dealer');

    const [strategy, setStrategy] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [isChartVisible, setIsChartVisible] = useState(false);

    // This ref tracks if the last action was a submission, to prevent re-triggering.
    const submittedRef = useRef(false);

    const handleNewHand = useCallback(() => {
        setDealerInput('');
        setPlayerInput('');
        setStrategy(null);
        setError(null);
        setIsLoading(false);
        setActiveInput('dealer');
        submittedRef.current = false;
    }, []);

    const fetchStrategy = useCallback(async (dCard: CardValue, pCard1: CardValue, pCard2: CardValue) => {
        setIsLoading(true);
        setError(null);
        setStrategy(null);
        submittedRef.current = true;

        try {
            const result = await getBlackjackStrategy(dCard, pCard1, pCard2);
            setStrategy(result);
        } catch (e: unknown) {
            if (e instanceof Error) {
                setError(e.message);
            } else {
                setError("An unknown error occurred.");
            }
        } finally {
            setIsLoading(false);
        }
    }, []);


    const handleKeyPress = (key: CardValue) => {
        if (isLoading || submittedRef.current) return;

        if (activeInput === 'dealer') {
            setDealerInput(key);
            setActiveInput('player');
        } else if (activeInput === 'player') {
            const currentCards = playerInput.split(',').filter(Boolean);
            if (currentCards.length === 0) {
                setPlayerInput(key + ',');
            } else if (currentCards.length === 1) {
                setPlayerInput(playerInput + key);
            }
        }
    };
    
    const handleBackspace = () => {
        if (isLoading || submittedRef.current) return;

        if (activeInput === 'player') {
            if (playerInput.length > 0) {
                 setPlayerInput(prev => prev.slice(0, -1).endsWith(',') ? prev.slice(0, -2) : prev.slice(0, -1));
            } else {
                setActiveInput('dealer');
            }
        } else if (activeInput === 'dealer') {
            if (dealerInput.length > 0) {
                setDealerInput('');
            }
        }
    };

    useEffect(() => {
        const playerCards = playerInput.split(',').filter(Boolean);
        if (dealerInput && playerCards.length === 2 && !submittedRef.current) {
            fetchStrategy(dealerInput as CardValue, playerCards[0] as CardValue, playerCards[1] as CardValue);
        }
    }, [dealerInput, playerInput, fetchStrategy]);


    return (
        <div className="h-screen bg-gradient-to-b from-gray-900 to-green-900 text-white flex flex-col items-center justify-center p-2 font-sans overflow-hidden">
            <main className="w-full max-w-md mx-auto bg-gray-800 bg-opacity-70 rounded-2xl shadow-2xl backdrop-blur-sm border border-gray-700 p-4 flex flex-col h-full">
                <header className="text-center mb-2 flex-shrink-0">
                    <h1 className="text-2xl sm:text-3xl font-bold text-yellow-400 tracking-tight">Blackjack Strategy Advisor</h1>
                    <p className="text-gray-300 mt-1 text-xs sm:text-sm">Use the keypad to enter the cards.</p>
                    <button
                        onClick={() => setIsChartVisible(true)}
                        className="mt-2 text-yellow-500 hover:text-yellow-400 transition-colors underline text-xs"
                    >
                        View Strategy Chart
                    </button>
                </header>

                <div className="flex-1 flex flex-col justify-between space-y-2 py-2">
                    <div className="flex flex-col sm:flex-row gap-2">
                        <InputDisplay label="Dealer's Card" value={dealerInput} isActive={activeInput === 'dealer'} />
                        <InputDisplay label="Your Hand" value={playerInput} isActive={activeInput === 'player'} />
                    </div>

                    <div>
                        <ResultDisplay strategy={strategy} isLoading={isLoading} error={error} />
                    </div>

                    <div className="flex-shrink-0">
                        <Keypad onKeyPress={handleKeyPress} onBackspace={handleBackspace} disabled={isLoading || submittedRef.current} />
                         <button
                            onClick={handleNewHand}
                            className="w-full mt-2 bg-gray-700 text-white font-semibold py-2 rounded-lg transition-colors hover:bg-gray-600 disabled:opacity-50"
                        >
                          New Hand
                        </button>
                    </div>
                </div>
                <footer className="text-center mt-2 text-xs text-gray-500 flex-shrink-0">
                    <p>Disclaimer: This tool provides advice based on standard blackjack basic strategy. It does not guarantee winnings. Please gamble responsibly.</p>
                </footer>
            </main>
            <StrategyChart isOpen={isChartVisible} onClose={() => setIsChartVisible(false)} />
        </div>
    );
};

export default App;