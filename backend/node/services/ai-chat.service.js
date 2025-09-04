import { gemini } from "../config/ai.js";
import MaterialSummary from "../models/material-summary.model.js";

class AIChatService {
    constructor() {
        this.chatSessions = new Map(); // Map to store chat sessions
    }

    async generateResponse(userId, materialId, message, model) {
        const sessionKey = `${userId}-${materialId}`;
        let chat = this.chatSessions.get(sessionKey);

        if (!chat) {
            const summary = await MaterialSummary.getSummaryByMaterialId(materialId);
            chat = gemini.chats.create({
                model,
                history: [
                    { role: 'user', parts: [{ text: summary.content }] }
                ],
                config: {
                    temperature: 0.7,
                    maxOutputTokens: 512, 
                    responseMimeType: 'text/plain',
                    systemInstruction: {
                        parts: [{ text: 'You are a helpful assistant. Always provide concise, complete responses within 10 sentences. For any non-english queries, respond in the same language as the prompt unless otherwise specified by the user. Summarize complex topics clearly and avoid abrupt endings.'}]
                    }
                 }
            });
            this.chatSessions.set(sessionKey, chat);
        } else {
            // Trim history to avoid exceeding token limits
            if (chat.history.length > 10) {
                chat.history = chat.history.slice(-10);
            }
        }

        const response = await chat.sendMessage({ message });
        console.log("AI Response:", response, response.text);
        this.chatSessions.set(sessionKey, chat);

        return response.text;
    }

    clearSession(userId, materialId) {
        const sessionKey = `${userId}-${materialId}`;
        this.chatSessions.delete(sessionKey);
    }
}

export default new AIChatService();