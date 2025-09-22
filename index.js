document.addEventListener('DOMContentLoaded', () => {
    // --- CONSTANTS ---
    const CARD_VALUES = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    const KEYPAD_LAYOUT = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'BS'];
    const STRATEGY_CHART = {
        hard: { title: 'Hard Totals', legend: 'Your hand does not contain an Ace counted as 11.', rows: { '17-21': { '2': 'S', '3': 'S', '4': 'S', '5': 'S', '6': 'S', '7': 'S', '8': 'S', '9': 'S', '10': 'S', A: 'S' }, '16': { '2': 'S', '3': 'S', '4': 'S', '5': 'S', '6': 'S', '7': 'H', '8': 'H', '9': 'Sr', '10': 'Sr', A: 'Sr' }, '15': { '2': 'S', '3': 'S', '4': 'S', '5': 'S', '6': 'S', '7': 'H', '8': 'H', '9': 'H', '10': 'Sr', A: 'H' }, '14': { '2': 'S', '3': 'S', '4': 'S', '5': 'S', '6': 'S', '7': 'H', '8': 'H', '9': 'H', '10': 'H', A: 'H' }, '13': { '2': 'S', '3': 'S', '4': 'S', '5': 'S', '6': 'S', '7': 'H', '8': 'H', '9': 'H', '10': 'H', A: 'H' }, '12': { '2': 'H', '3': 'H', '4': 'S', '5': 'S', '6': 'S', '7': 'H', '8': 'H', '9': 'H', '10': 'H', A: 'H' }, '11': { '2': 'D', '3': 'D', '4': 'D', '5': 'D', '6': 'D', '7': 'D', '8': 'D', '9': 'D', '10': 'D', A: 'D' }, '10': { '2': 'D', '3': 'D', '4': 'D', '5': 'D', '6': 'D', '7': 'D', '8': 'D', '9': 'D', '10': 'H', A: 'H' }, '9': { '2': 'H', '3': 'D', '4': 'D', '5': 'D', '6': 'D', '7': 'H', '8': 'H', '9': 'H', '10': 'H', A: 'H' }, '5-8': { '2': 'H', '3': 'H', '4': 'H', '5': 'H', '6': 'H', '7': 'H', '8': 'H', '9': 'H', '10': 'H', A: 'H' }}},
        soft: { title: 'Soft Totals', legend: 'Your hand contains an Ace counted as 11.', rows: { 'A,9': { '2': 'S', '3': 'S', '4': 'S', '5': 'S', '6': 'S', '7': 'S', '8': 'S', '9': 'S', '10': 'S', A: 'S' }, 'A,8': { '2': 'S', '3': 'S', '4': 'S', '5': 'S', '6': 'D', '7': 'S', '8': 'S', '9': 'S', '10': 'S', A: 'S' }, 'A,7': { '2': 'D', '3': 'D', '4': 'D', '5': 'D', '6': 'D', '7': 'S', '8': 'S', '9': 'H', '10': 'H', A: 'H' }, 'A,6': { '2': 'H', '3': 'D', '4': 'D', '5': 'D', '6': 'D', '7': 'H', '8': 'H', '9': 'H', '10': 'H', A: 'H' }, 'A,5': { '2': 'H', '3': 'H', '4': 'D', '5': 'D', '6': 'D', '7': 'H', '8': 'H', '9': 'H', '10': 'H', A: 'H' }, 'A,4': { '2': 'H', '3': 'H', '4': 'D', '5': 'D', '6': 'D', '7': 'H', '8': 'H', '9': 'H', '10': 'H', A: 'H' }, 'A,3': { '2': 'H', '3': 'H', '4': 'H', '5': 'D', '6': 'D', '7': 'H', '8': 'H', '9': 'H', '10': 'H', A: 'H' }, 'A,2': { '2': 'H', '3': 'H', '4': 'H', '5': 'D', '6': 'D', '7': 'H', '8': 'H', '9': 'H', '10': 'H', A: 'H' }}},
        pairs: { title: 'Pairs', legend: 'Your hand consists of two cards of the same rank.', rows: { 'A,A': { '2': 'P', '3': 'P', '4': 'P', '5': 'P', '6': 'P', '7': 'P', '8': 'P', '9': 'P', '10': 'P', A: 'P' }, '10,10': { '2': 'S', '3': 'S', '4': 'S', '5': 'S', '6': 'S', '7': 'S', '8': 'S', '9': 'S', '10': 'S', A: 'S' }, '9,9': { '2': 'P', '3': 'P', '4': 'P', '5': 'P', '6': 'P', '7': 'S', '8': 'P', '9': 'P', '10': 'S', A: 'S' }, '8,8': { '2': 'P', '3': 'P', '4': 'P', '5': 'P', '6': 'P', '7': 'P', '8': 'P', '9': 'P', '10': 'P', A: 'P' }, '7,7': { '2': 'P', '3': 'P', '4': 'P', '5': 'P', '6': 'P', '7': 'P', '8': 'H', '9': 'H', '10': 'H', A: 'H' }, '6,6': { '2': 'P', '3': 'P', '4': 'P', '5': 'P', '6': 'P', '7': 'H', '8': 'H', '9': 'H', '10': 'H', A: 'H' }, '5,5': { '2': 'D', '3': 'D', '4': 'D', '5': 'D', '6': 'D', '7': 'D', '8': 'D', '9': 'D', '10': 'H', A: 'H' }, '4,4': { '2': 'H', '3': 'H', '4': 'H', '5': 'P', '6': 'P', '7': 'H', '8': 'H', '9': 'H', '10': 'H', A: 'H' }, '3,3': { '2': 'P', '3': 'P', '4': 'P', '5': 'P', '6': 'P', '7': 'P', '8': 'H', '9': 'H', '10': 'H', A: 'H' }, '2,2': { '2': 'P', '3': 'P', '4': 'P', '5': 'P', '6': 'P', '7': 'P', '8': 'H', '9': 'H', '10': 'H', A: 'H' }}}
    };

    // --- DOM ELEMENTS ---
    const dom = {
        dealerDisplay: document.getElementById('dealer-display'),
        playerDisplay: document.getElementById('player-display'),
        dealerCardValue: document.getElementById('dealer-card-value'),
        playerCardsValue: document.getElementById('player-cards-value'),
        dealerCursor: document.getElementById('dealer-cursor'),
        playerCursor: document.getElementById('player-cursor'),
        keypad: document.getElementById('keypad'),
        newHandBtn: document.getElementById('new-hand-btn'),
        result: {
            container: document.getElementById('result-display'),
            initial: document.getElementById('initial-message'),
            loading: document.getElementById('loading-spinner'),
            error: document.getElementById('error-message'),
            strategy: document.getElementById('strategy-result'),
            strategyText: document.getElementById('strategy-text'),
        },
        chart: {
            modal: document.getElementById('chart-modal'),
            content: document.getElementById('chart-modal-content'),
            tables: document.getElementById('chart-tables'),
            viewBtn: document.getElementById('view-chart-btn'),
            closeBtn: document.getElementById('close-chart-btn'),
        }
    };

    // --- STATE ---
    let state = {
        dealerCard: null,
        playerCards: [],
        activeInput: 'dealer', // 'dealer' or 'player'
        isSubmitted: false,
    };

    // --- STATE MANAGEMENT & UI UPDATE ---
    const resetState = () => {
        state.dealerCard = null;
        state.playerCards = [];
        state.activeInput = 'dealer';
        state.isSubmitted = false;
        updateUI();
        setResultState('initial');
    };

    const updateUI = () => {
        // Update display values
        dom.dealerCardValue.textContent = state.dealerCard || '';
        dom.playerCardsValue.textContent = state.playerCards.join(', ');

        // Update active input visuals
        const isDealerActive = state.activeInput === 'dealer' && !state.isSubmitted;
        const isPlayerActive = state.activeInput === 'player' && !state.isSubmitted;

        dom.dealerDisplay.classList.toggle('border-yellow-400', isDealerActive);
        dom.playerDisplay.classList.toggle('border-yellow-400', isPlayerActive);
        dom.dealerCursor.classList.toggle('hidden', !isDealerActive);
        dom.dealerCursor.classList.toggle('cursor-blink', isDealerActive);
        dom.playerCursor.classList.toggle('hidden', !isPlayerActive);
        dom.playerCursor.classList.toggle('cursor-blink', isPlayerActive);
        
        // Disable keypad if submitted
        document.querySelectorAll('#keypad button').forEach(button => {
            button.disabled = state.isSubmitted;
        });
    };

    const setResultState = (mode) => { // 'initial', 'loading', 'error', 'strategy'
        Object.values(dom.result).forEach(el => el.classList?.add('hidden'));
        dom.result.container.classList.remove('hidden');
        dom.result[mode].classList.remove('hidden');
    };

    // --- CORE LOGIC ---
    const handleKeyPress = (key) => {
        if (state.isSubmitted) return;

        if (state.activeInput === 'dealer') {
            state.dealerCard = key;
            state.activeInput = 'player';
        } else if (state.activeInput === 'player' && state.playerCards.length < 2) {
            state.playerCards.push(key);
        }
        
        updateUI();

        if (state.dealerCard && state.playerCards.length === 2) {
            state.isSubmitted = true;
            updateUI();
            calculateAndDisplayStrategy();
        }
    };
    
    const handleBackspace = () => {
        if (state.isSubmitted) return;

        if (state.activeInput === 'player') {
            if (state.playerCards.length > 0) {
                state.playerCards.pop();
            } else {
                state.activeInput = 'dealer';
            }
        } else if (state.activeInput === 'dealer') {
            state.dealerCard = null;
        }
        updateUI();
    };

    const calculateAndDisplayStrategy = () => {
        setResultState('loading');
        setTimeout(() => {
            const [pCard1, pCard2] = state.playerCards;
            const actionCode = getStrategyFromChart(state.dealerCard, pCard1, pCard2);
            if (actionCode) {
                const actionMap = { H: 'Hit', S: 'Stand', D: 'Double Down', P: 'Split', Sr: 'Surrender' };
                const colorMap = { H: 'text-green-400', S: 'text-red-400', D: 'text-green-300', P: 'text-blue-400', Sr: 'text-gray-400' };
                
                dom.result.strategyText.textContent = actionMap[actionCode]?.toUpperCase() || 'ERROR';
                dom.result.strategyText.className = `text-4xl sm:text-5xl font-black tracking-wider mt-1 ${colorMap[actionCode] || 'text-white'}`;
                setResultState('strategy');
            } else {
                setResultState('error');
            }
        }, 300); // Simulate calculation
    };

    const getStrategyFromChart = (dealerCard, pCard1, pCard2) => {
        const getCardNumericValue = (card) => {
            if (['J', 'Q', 'K', '10'].includes(card)) return 10;
            if (card === 'A') return 11;
            return parseInt(card, 10);
        };

        const getCardLookupValue = (card) => {
            if (['J', 'Q', 'K'].includes(card)) return '10';
            return card;
        };
        
        const lookupP1 = getCardLookupValue(pCard1);
        const lookupP2 = getCardLookupValue(pCard2);
        const dealerLookup = getCardLookupValue(dealerCard);

        // 1. Check for Pairs
        if (lookupP1 === lookupP2) {
            const key = `${lookupP1},${lookupP1}`;
            return STRATEGY_CHART.pairs.rows[key]?.[dealerLookup];
        }

        // 2. Check for Soft Hands (one Ace)
        if (lookupP1 === 'A' || lookupP2 === 'A') {
            const otherCard = lookupP1 === 'A' ? lookupP2 : lookupP1;
            const key = `A,${otherCard}`;
            if (STRATEGY_CHART.soft.rows[key]) {
                return STRATEGY_CHART.soft.rows[key]?.[dealerLookup];
            }
        }

        // 3. Handle Hard Totals
        const total = getCardNumericValue(pCard1) + getCardNumericValue(pCard2);
        const hardKeys = Object.keys(STRATEGY_CHART.hard.rows);
        const matchedKey = hardKeys.find(key => {
            if (key.includes('-')) {
                const [min, max] = key.split('-').map(Number);
                return total >= min && total <= max;
            }
            return parseInt(key, 10) === total;
        });

        return matchedKey ? STRATEGY_CHART.hard.rows[matchedKey]?.[dealerLookup] : null;
    };
    
    // --- UI RENDERING & EVENT LISTENERS ---
    const renderKeypad = () => {
        KEYPAD_LAYOUT.forEach(key => {
            const isBackspace = key === 'BS';
            const button = document.createElement('button');
            button.className = `rounded-lg font-bold text-lg sm:text-xl transition-all duration-150 flex items-center justify-center h-12 ${isBackspace ? 'bg-red-800 hover:bg-red-700 col-span-2' : 'bg-gray-600 hover:bg-gray-500'}`;
            if (isBackspace) {
                button.innerHTML = `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 002.828 0L19 12M3 12l6.414-6.414a2 2 0 012.828 0L19 12"></path></svg>`;
                button.addEventListener('click', handleBackspace);
            } else {
                button.textContent = key;
                button.addEventListener('click', () => handleKeyPress(key));
            }
            dom.keypad.appendChild(button);
        });
    };

    const renderStrategyChart = () => {
        const dealerCards = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'A'];
        const getActionColor = (action) => ({ H: 'bg-green-500', S: 'bg-red-500', D: 'bg-green-700', P: 'bg-blue-500', Sr: 'bg-gray-500' }[action] || 'bg-gray-700');
        
        Object.values(STRATEGY_CHART).forEach(chart => {
            let tableHTML = `
                <div class="mb-8">
                    <h3 class="text-xl sm:text-2xl font-bold text-yellow-400 mb-2">${chart.title}</h3>
                    <p class="text-gray-400 text-sm mb-4">${chart.legend}</p>
                    <div class="overflow-x-auto">
                        <table class="w-full border-collapse text-center text-white">
                            <thead>
                                <tr class="bg-gray-900">
                                    <th class="p-2 border border-gray-600 text-sm">Player</th>
                                    ${dealerCards.map(c => `<th class="p-2 border border-gray-600 text-sm w-10">${c}</th>`).join('')}
                                </tr>
                            </thead>
                            <tbody>
                                ${Object.entries(chart.rows).map(([playerHand, actions]) => `
                                    <tr class="bg-gray-800">
                                        <td class="p-2 border border-gray-600 font-semibold text-sm">${playerHand}</td>
                                        ${dealerCards.map(dc => `<td class="p-2 border border-gray-600 font-bold text-xs sm:text-sm ${getActionColor(actions[dc])}">${actions[dc]}</td>`).join('')}
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            `;
            dom.chart.tables.innerHTML += tableHTML;
        });
    };

    const setupEventListeners = () => {
        dom.newHandBtn.addEventListener('click', resetState);
        dom.chart.viewBtn.addEventListener('click', () => dom.chart.modal.classList.remove('hidden'));
        dom.chart.closeBtn.addEventListener('click', () => dom.chart.modal.classList.add('hidden'));
        dom.chart.modal.addEventListener('click', (e) => {
            if (e.target === dom.chart.modal) dom.chart.modal.classList.add('hidden');
        });
    };

    // --- INITIALIZATION ---
    const init = () => {
        renderKeypad();
        renderStrategyChart();
        setupEventListeners();
        resetState();
    };

    init();
});