import { ENDPOINTS } from "@/constants/endpoints";

const GENERATE_AI_RESPONSE_ENDPOINT = ENDPOINTS.GENERATE_AI_RESPONSE;
const CLEAR_AI_SESSION_ENDPOINT = ENDPOINTS.CLEAR_AI_SESSION;

const generateResponse = async (userId: string, materialId: string, message: string, model: string | null) => {
    if (!model) {
        throw new Error('AI model not selected');
    }

    try {
        const response = await fetch(GENERATE_AI_RESPONSE_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId, materialId, message, model }),
        });

        if (!response.ok) {
            throw new Error('Failed to generate AI response');
        }

        const data = await response.json();
        return data.response;
    } catch (error) {
        console.error('Error generating AI response:', error);
        return "Sorry, something went wrong while generating the response.";
    }
};

const clearSession = async (userId: string, materialId: string) => {
    try {
        const response = await fetch(CLEAR_AI_SESSION_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId, materialId }),
        });

        if (!response.ok) {
            throw new Error('Failed to clear AI session');
        }
    } catch (error) {
        console.error('Error clearing AI session:', error);
        throw error;
    }
};

export {
    generateResponse,
    clearSession,
};