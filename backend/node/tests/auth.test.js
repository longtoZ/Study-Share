import { jest } from '@jest/globals';

// Mock the JWT config
jest.unstable_mockModule('../config/jwt.config.js', () => ({
    default: {
        secret: 'test-secret-key',
        expiresIn: '7d'
    }
}));

// Mock JWT library
jest.unstable_mockModule('jsonwebtoken', () => ({
    default: {
        verify: jest.fn()
    }
}));

// Import after mocking
const AuthController = (await import('../controllers/auth.controller.js')).default;
const AuthMiddleware = (await import('../middleware/auth.middleware.js')).default;
const jwt = (await import('jsonwebtoken')).default;

describe('Authentication System Tests', () => {
    let mockReq, mockRes, mockNext;

    beforeEach(() => {
        // Reset all mocks
        jest.clearAllMocks();
        
        // Setup mock request and response objects
        mockReq = {
            headers: {},
            query: {},
            user: {}
        };
        
        mockRes = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
        };

        mockNext = jest.fn();
    });

    describe('AuthController', () => {
        describe('verifyUser', () => {
            it('should verify user successfully without authorId', async () => {
                // Arrange
                mockReq.user = {
                    user_id: 'user123'
                };
                mockReq.query = {};

                // Act
                await AuthController.verifyUser(mockReq, mockRes);

                // Assert
                expect(mockRes.status).toHaveBeenCalledWith(200);
                expect(mockRes.json).toHaveBeenCalledWith({ message: 'User is verified' });
            });

            it('should verify user successfully when authorId matches userId', async () => {
                // Arrange
                mockReq.user = {
                    user_id: 'user123'
                };
                mockReq.query = {
                    authorId: 'user123'
                };

                // Act
                await AuthController.verifyUser(mockReq, mockRes);

                // Assert
                expect(mockRes.status).toHaveBeenCalledWith(200);
                expect(mockRes.json).toHaveBeenCalledWith({ message: 'User is verified' });
            });

            it('should return forbidden when authorId does not match userId', async () => {
                // Arrange
                mockReq.user = {
                    user_id: 'user123'
                };
                mockReq.query = {
                    authorId: 'user456'
                };

                // Act
                await AuthController.verifyUser(mockReq, mockRes);

                // Assert
                expect(mockRes.status).toHaveBeenCalledWith(403);
                expect(mockRes.json).toHaveBeenCalledWith({ 
                    message: 'Forbidden: You are not allowed to perform this action.' 
                });
            });

            it('should handle missing user in request', async () => {
                // Arrange
                mockReq.user = {}; // No user_id
                mockReq.query = {
                    authorId: 'user456'
                };

                // Act
                await AuthController.verifyUser(mockReq, mockRes);

                // Assert
                expect(mockRes.status).toHaveBeenCalledWith(403);
                expect(mockRes.json).toHaveBeenCalledWith({ 
                    message: 'Forbidden: You are not allowed to perform this action.' 
                });
            });
        });
    });

    describe('AuthMiddleware', () => {
        describe('verifyUser', () => {
            it('should verify valid token successfully', () => {
                // Arrange
                const mockToken = 'valid.jwt.token';
                const mockDecoded = {
                    user_id: 'user123',
                    email: 'test@example.com',
                    iat: Date.now(),
                    exp: Date.now() + 3600000
                };

                mockReq.headers.authorization = `Bearer ${mockToken}`;
                jwt.verify.mockReturnValue(mockDecoded);

                // Act
                AuthMiddleware.verifyUser(mockReq, mockRes, mockNext);

                // Assert
                expect(jwt.verify).toHaveBeenCalledWith(mockToken, 'test-secret-key');
                expect(mockReq.user).toEqual(mockDecoded);
                expect(mockNext).toHaveBeenCalled();
                expect(mockRes.status).not.toHaveBeenCalled();
                expect(mockRes.json).not.toHaveBeenCalled();
            });

            it('should return 401 when no authorization header is provided', () => {
                // Arrange
                mockReq.headers = {}; // No authorization header

                // Act
                AuthMiddleware.verifyUser(mockReq, mockRes, mockNext);

                // Assert
                expect(mockRes.status).toHaveBeenCalledWith(401);
                expect(mockRes.json).toHaveBeenCalledWith({ 
                    message: 'No token, authorization denied.' 
                });
                expect(mockNext).not.toHaveBeenCalled();
            });

            it('should return 401 when authorization header does not start with Bearer', () => {
                // Arrange
                mockReq.headers.authorization = 'InvalidToken abc123';

                // Act
                AuthMiddleware.verifyUser(mockReq, mockRes, mockNext);

                // Assert
                expect(mockRes.status).toHaveBeenCalledWith(401);
                expect(mockRes.json).toHaveBeenCalledWith({ 
                    message: 'No token, authorization denied.' 
                });
                expect(mockNext).not.toHaveBeenCalled();
            });

            it('should return 401 when token is expired', () => {
                // Arrange
                const mockToken = 'expired.jwt.token';
                mockReq.headers.authorization = `Bearer ${mockToken}`;
                
                const expiredError = new Error('Token expired');
                expiredError.name = 'TokenExpiredError';
                jwt.verify.mockImplementation(() => {
                    throw expiredError;
                });

                // Act
                AuthMiddleware.verifyUser(mockReq, mockRes, mockNext);

                // Assert
                expect(jwt.verify).toHaveBeenCalledWith(mockToken, 'test-secret-key');
                expect(mockRes.status).toHaveBeenCalledWith(401);
                expect(mockRes.json).toHaveBeenCalledWith({ 
                    message: 'Token expired.' 
                });
                expect(mockNext).not.toHaveBeenCalled();
            });

            it('should return 401 when token is invalid', () => {
                // Arrange
                const mockToken = 'invalid.jwt.token';
                mockReq.headers.authorization = `Bearer ${mockToken}`;
                
                const invalidError = new Error('Invalid token');
                invalidError.name = 'JsonWebTokenError';
                jwt.verify.mockImplementation(() => {
                    throw invalidError;
                });

                // Act
                AuthMiddleware.verifyUser(mockReq, mockRes, mockNext);

                // Assert
                expect(jwt.verify).toHaveBeenCalledWith(mockToken, 'test-secret-key');
                expect(mockRes.status).toHaveBeenCalledWith(401);
                expect(mockRes.json).toHaveBeenCalledWith({ 
                    message: 'Token is not valid.' 
                });
                expect(mockNext).not.toHaveBeenCalled();
            });

            it('should return 500 when unexpected error occurs during verification', () => {
                // Arrange
                const mockToken = 'some.jwt.token';
                mockReq.headers.authorization = `Bearer ${mockToken}`;
                
                jwt.verify.mockImplementation(() => {
                    throw new Error('Database connection failed');
                });

                // Spy on console.error to verify error logging
                const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

                // Act
                AuthMiddleware.verifyUser(mockReq, mockRes, mockNext);

                // Assert
                expect(jwt.verify).toHaveBeenCalledWith(mockToken, 'test-secret-key');
                expect(consoleSpy).toHaveBeenCalledWith('JWT verification error:', 'Database connection failed');
                expect(mockRes.status).toHaveBeenCalledWith(500);
                expect(mockRes.json).toHaveBeenCalledWith({ 
                    message: 'Server error during token verification.' 
                });
                expect(mockNext).not.toHaveBeenCalled();

                // Restore console.error
                consoleSpy.mockRestore();
            });

            it('should handle malformed Bearer token', () => {
                // Arrange
                mockReq.headers.authorization = 'Bearer '; // Missing token part

                // Act
                AuthMiddleware.verifyUser(mockReq, mockRes, mockNext);

                // Assert
                expect(mockRes.status).toHaveBeenCalledWith(401);
                expect(mockRes.json).toHaveBeenCalledWith({ 
                    message: 'Token is missing.'
                });
                expect(mockNext).not.toHaveBeenCalled();
            });

            it('should extract token correctly from Bearer header', () => {
                // Arrange
                const mockToken = 'valid.jwt.token.with.multiple.dots';
                const mockDecoded = { user_id: 'user123' };

                mockReq.headers.authorization = `Bearer ${mockToken}`;
                jwt.verify.mockReturnValue(mockDecoded);

                // Act
                AuthMiddleware.verifyUser(mockReq, mockRes, mockNext);

                // Assert
                expect(jwt.verify).toHaveBeenCalledWith(mockToken, 'test-secret-key');
                expect(mockReq.user).toEqual(mockDecoded);
                expect(mockNext).toHaveBeenCalled();
            });
        });
    });

    describe('Integration Tests', () => {
        describe('Controller with Middleware', () => {
            it('should work together for valid authenticated request', () => {
                // Arrange - First middleware verification
                const mockToken = 'valid.jwt.token';
                const mockDecoded = {
                    user_id: 'user123',
                    email: 'test@example.com'
                };

                mockReq.headers.authorization = `Bearer ${mockToken}`;
                mockReq.query = { authorId: 'user123' };
                jwt.verify.mockReturnValue(mockDecoded);

                // Act - Middleware
                AuthMiddleware.verifyUser(mockReq, mockRes, mockNext);

                // Assert middleware worked
                expect(mockReq.user).toEqual(mockDecoded);
                expect(mockNext).toHaveBeenCalled();

                // Act - Controller (simulate the middleware added user to req)
                AuthController.verifyUser(mockReq, mockRes);

                // Assert controller worked
                expect(mockRes.status).toHaveBeenCalledWith(200);
                expect(mockRes.json).toHaveBeenCalledWith({ message: 'User is verified' });
            });

            it('should fail at middleware level for invalid token', () => {
                // Arrange
                const mockToken = 'invalid.jwt.token';
                mockReq.headers.authorization = `Bearer ${mockToken}`;
                
                const invalidError = new Error('Invalid token');
                invalidError.name = 'JsonWebTokenError';
                jwt.verify.mockImplementation(() => {
                    throw invalidError;
                });

                // Act - Middleware should fail
                AuthMiddleware.verifyUser(mockReq, mockRes, mockNext);

                // Assert - Should fail at middleware level
                expect(mockRes.status).toHaveBeenCalledWith(401);
                expect(mockRes.json).toHaveBeenCalledWith({ 
                    message: 'Token is not valid.' 
                });
                expect(mockNext).not.toHaveBeenCalled();
                // Controller should never be reached
            });
        });
    });
});
