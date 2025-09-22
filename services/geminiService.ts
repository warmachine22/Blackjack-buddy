
import { GoogleGenAI } from "@google/genai";
import { CardValue } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const mapCardValueToName = (card: CardValue): string => {
    switch (card) {
        case 'A': return 'Ace';
        case 'J': return 'Jack';
        case 'Q': return 'Queen';
        case 'K': return 'King';
        default: return card;
    }
};

export const getBlackjackStrategy = async (dealerCard: CardValue, playerCard1: CardValue, playerCard2: CardValue): Promise<string> => {
    const dealerCardName = mapCardValueToName(dealerCard);
    const playerCard1Name = mapCardValueToName(playerCard1);
    const playerCard2Name = mapCardValueToName(playerCard2);

    const prompt = `
      You are an expert blackjack strategy advisor providing advice based on standard basic strategy rules.
      What is the single best action for a player with a hand of ${playerCard1Name} and ${playerCard2Name} when the dealer's up card is ${dealerCardName}?
      Your answer must be one of the following exact phrases: "Hit", "Stand", "Double Down", "Split", or "Surrender".
      Do not provide any explanation or extra text. Only return the action.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                temperature: 0,
                thinkingConfig: { thinkingBudget: 0 }
            }
        });

        const text = response.text.trim().replace(/[^a-zA-Z\s]/g, '');

        const validActions = ["Hit", "Stand", "Double Down", "Split", "Surrender"];
        if (validActions.some(action => text.toLowerCase().includes(action.toLowerCase()))) {
             // Find the valid action that is present in the text
            const foundAction = validActions.find(action => text.toLowerCase().includes(action.toLowerCase()));
            return foundAction || "Error: Invalid action";
        }
        
        console.error("Gemini API returned an unexpected response:", text);
        throw new Error("Could not determine a valid strategy. Please try again.");
    } catch (error) {
        console.error("Error fetching blackjack strategy:", error);
        throw new Error("Failed to get strategy from the AI. Please check your connection or API key.");
    }
};
