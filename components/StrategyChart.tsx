import React from 'react';
import { STRATEGY_CHART } from '../constants';

interface StrategyChartProps {
    isOpen: boolean;
    onClose: () => void;
}

const getActionColor = (action: string) => {
    switch (action) {
        case 'H': return 'bg-green-500 text-white';
        case 'S': return 'bg-red-500 text-white';
        case 'D': return 'bg-green-700 text-white';
        case 'P': return 'bg-blue-500 text-white';
        case 'Sr': return 'bg-gray-500 text-white';
        default: return 'bg-gray-700 text-gray-300';
    }
};

const dealerCards = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'A'];

// FIX: Define a more generic type for the chart data to accept hard, soft, or pair totals.
interface ChartTableData {
    title: string;
    legend: string;
    rows: Record<string, Record<string, string>>;
}

const ChartTable: React.FC<{ data: ChartTableData }> = ({ data }) => (
    <div className="mb-8">
        <h3 className="text-xl sm:text-2xl font-bold text-yellow-400 mb-2">{data.title}</h3>
        <p className="text-gray-400 text-sm mb-4">{data.legend}</p>
        <div className="overflow-x-auto">
            <table className="w-full border-collapse text-center">
                <thead>
                    <tr className="bg-gray-900">
                        <th className="p-2 border border-gray-600 text-sm">Player</th>
                        {dealerCards.map(card => <th key={card} className="p-2 border border-gray-600 text-sm w-10">{card}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {Object.entries(data.rows).map(([playerHand, actions]) => (
                        <tr key={playerHand} className="bg-gray-800">
                            <td className="p-2 border border-gray-600 font-semibold text-sm">{playerHand}</td>
                            {dealerCards.map(card => (
                                <td key={`${playerHand}-${card}`} className={`p-2 border border-gray-600 font-bold text-xs sm:text-sm ${getActionColor(actions[card as keyof typeof actions])}`}>
                                    {actions[card as keyof typeof actions]}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);


export const StrategyChart: React.FC<StrategyChartProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="chart-title"
        >
            <div 
                className="bg-gray-800 border border-gray-600 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-4 sm:p-6"
                onClick={(e) => e.stopPropagation()} // Prevent closing modal when clicking inside
            >
                <div className="flex justify-between items-center mb-4">
                    <h2 id="chart-title" className="text-2xl sm:text-3xl font-bold text-yellow-400">Blackjack Basic Strategy</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white" aria-label="Close">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>
                
                <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs sm:text-sm mb-6 p-3 bg-gray-900 rounded-md">
                    <span className="font-bold mr-2">Legend:</span>
                    <span className="flex items-center"><div className="w-3 h-3 rounded-sm bg-green-500 mr-1.5"></div>Hit</span>
                    <span className="flex items-center"><div className="w-3 h-3 rounded-sm bg-red-500 mr-1.5"></div>Stand</span>
                    <span className="flex items-center"><div className="w-3 h-3 rounded-sm bg-green-700 mr-1.5"></div>Double</span>
                    <span className="flex items-center"><div className="w-3 h-3 rounded-sm bg-blue-500 mr-1.5"></div>Split</span>
                    <span className="flex items-center"><div className="w-3 h-3 rounded-sm bg-gray-500 mr-1.5"></div>Surrender</span>
                </div>

                <ChartTable data={STRATEGY_CHART.hard} />
                <ChartTable data={STRATEGY_CHART.soft} />
                <ChartTable data={STRATEGY_CHART.pairs} />
            </div>
        </div>
    );
};
