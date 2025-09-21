import { jest } from '@jest/globals';

// Import after mocking
const AIChatController = (await import('../controllers/ai-chat.controller.js')).default;
const AIChatService = (await import('../services/ai-chat.service.js')).default;

describe('AI Chat System Tests', () => {
    let mockReq, mockRes;

    beforeEach(() => {
        // Reset all mocks
        jest.clearAllMocks();
        
        // Setup mock request and response objects
        mockReq = {
            body: {}
        };
        
        mockRes = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
        };
    });

    describe('AIChatController', () => {
        describe('generateResponse', () => {
            it('should generate AI response successfully', async () => {
                // Arrange
                mockReq.body = {
                    userId: 'user123',
                    materialId: 'material456',
                    message: 'Test message',
                    model: 'gemini-pro'
                };

                const mockResponse = 'This is a test AI response';
                
                // Mock the service method
                jest.spyOn(AIChatService, 'generateResponse').mockResolvedValue(mockResponse);

                // Act
                await AIChatController.generateResponse(mockReq, mockRes);

                // Assert
                expect(AIChatService.generateResponse).toHaveBeenCalledWith(
                    'user123',
                    'material456',
                    'Test message',
                    'gemini-pro'
                );
                expect(mockRes.json).toHaveBeenCalledWith({ response: mockResponse });
            });

            it('should handle errors when generating AI response', async () => {
                // Arrange
                mockReq.body = {
                    userId: 'user123',
                    materialId: 'material456',
                    message: 'Test message',
                    model: 'gemini-pro'
                };

                const mockError = new Error('AI service error');
                jest.spyOn(AIChatService, 'generateResponse').mockRejectedValue(mockError);

                // Act
                await AIChatController.generateResponse(mockReq, mockRes);

                // Assert
                expect(mockRes.status).toHaveBeenCalledWith(500);
                expect(mockRes.json).toHaveBeenCalledWith({ error: 'Failed to generate AI response' });
            });

            it('should handle missing required parameters', async () => {
                // Arrange
                mockReq.body = {
                    userId: 'user123'
                    // Missing materialId, message, model
                };

                jest.spyOn(AIChatService, 'generateResponse').mockRejectedValue(new Error('Missing parameters'));

                // Act
                await AIChatController.generateResponse(mockReq, mockRes);

                // Assert
                expect(mockRes.status).toHaveBeenCalledWith(500);
                expect(mockRes.json).toHaveBeenCalledWith({ error: 'Failed to generate AI response' });
            });
        });

        describe('clearSession', () => {
            it('should clear session successfully', () => {
                // Arrange
                mockReq.body = {
                    userId: 'user123',
                    materialId: 'material456'
                };

                jest.spyOn(AIChatService, 'clearSession').mockImplementation(() => {});

                // Act
                AIChatController.clearSession(mockReq, mockRes);

                // Assert
                expect(AIChatService.clearSession).toHaveBeenCalledWith('user123', 'material456');
                expect(mockRes.json).toHaveBeenCalledWith({ message: 'Session cleared successfully' });
            });

            it('should handle errors when clearing session', () => {
                // Arrange
                mockReq.body = {
                    userId: 'user123',
                    materialId: 'material456'
                };

                jest.spyOn(AIChatService, 'clearSession').mockImplementation(() => {
                    throw new Error('Clear session error');
                });

                // Act
                AIChatController.clearSession(mockReq, mockRes);

                // Assert
                expect(mockRes.status).toHaveBeenCalledWith(500);
                expect(mockRes.json).toHaveBeenCalledWith({ error: 'Failed to clear session' });
            });
        });
    });
});
