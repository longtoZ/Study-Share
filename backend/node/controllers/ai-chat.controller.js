import aiChatService from "../services/ai-chat.service.js";

class AIChatController {
    async generateResponse(req, res) {
        try {
            const { userId, materialId, message, model } = req.body;
            const response = await aiChatService.generateResponse(userId, materialId, message, model);
            res.json({ response });
        } catch (error) {
            console.error("Error generating AI response:", error.message);
            res.status(500).json({ error: "Failed to generate AI response" });
        }
    }

    clearSession(req, res) {
        try {
            const { userId, materialId } = req.body;
            aiChatService.clearSession(userId, materialId);
            res.json({ message: "Session cleared successfully" });
        } catch (error) {
            console.error("Error clearing session:", error.message);
            res.status(500).json({ error: "Failed to clear session" });
        }
    }
};

export default new AIChatController();