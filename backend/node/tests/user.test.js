import { jest } from '@jest/globals';

// Mock dependencies
jest.unstable_mockModule('../models/user.model.js', () => ({
    default: {
        create: jest.fn(),
        findByID: jest.fn(),
        findByEmail: jest.fn(),
        updateInfo: jest.fn(),
        updateImage: jest.fn(),
        delete: jest.fn(),
        getUserStripeAccountId: jest.fn(),
        verifyEmail: jest.fn()
    }
}));

jest.unstable_mockModule('../services/user.service.js', () => ({
    default: {
        signupUser: jest.fn(),
        loginUser: jest.fn(),
        getUserById: jest.fn(),
        updateUserInfo: jest.fn(),
        deleteUser: jest.fn(),
        verifyEmail: jest.fn(),
        notifyResetPassword: jest.fn(),
        verifyResetPassword: jest.fn(),
        googleLogin: jest.fn()
    }
}));

// Import after mocking
const UserController = (await import('../controllers/user.controller.js')).default;
const User = (await import('../models/user.model.js')).default;
const UserService = (await import('../services/user.service.js')).default;

describe('User Controller Tests', () => {
    let mockReq, mockRes;

    beforeEach(() => {
        // Reset all mocks
        jest.clearAllMocks();
        
        // Setup mock request and response objects
        mockReq = {
            body: {},
            params: {},
            query: {},
            user: { user_id: 'user123' },
            files: []
        };
        
        mockRes = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
        };
    });

    describe('signup', () => {
        it('should create user successfully', async () => {
            // Arrange
            const userData = {
                username: 'testuser',
                password: 'password123',
                full_name: 'Test User',
                email: 'test@example.com',
                gender: 'male',
                dateOfBirth: '1990-01-01',
                address: '123 Test St'
            };

            const mockCreatedUser = {
                user_id: 'testuser',
                email: 'test@example.com',
                full_name: 'Test User',
                is_verified: false
            };

            mockReq.body = userData;
            UserService.signupUser.mockResolvedValue({ user: mockCreatedUser });

            // Act
            await UserController.signup(mockReq, mockRes);

            // Assert
            expect(UserService.signupUser).toHaveBeenCalledWith({
                user_id: userData.username,
                email: userData.email,
                full_name: userData.full_name,
                gender: userData.gender,
                bio: '',
                profile_picture_url: '',
                date_of_birth: userData.dateOfBirth,
                address: userData.address,
                password: userData.password,
                created_date: expect.any(Date),
                last_login: null,
                is_admin: false
            });
            expect(mockRes.status).toHaveBeenCalledWith(201);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'User signed up successfully',
                user: mockCreatedUser
            });
        });

        it('should handle email already exists error', async () => {
            // Arrange
            const userData = {
                username: 'testuser',
                email: 'existing@example.com',
                password: 'password123'
            };

            mockReq.body = userData;
            const error = new Error('User with this email already exists');
            UserService.signupUser.mockRejectedValue(error);

            // Act
            await UserController.signup(mockReq, mockRes);

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(409);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'User with this email already exists'
            });
        });

        it('should handle server error during signup', async () => {
            // Arrange
            const userData = { username: 'testuser', email: 'test@example.com' };
            mockReq.body = userData;
            const error = new Error('Database connection failed');
            UserService.signupUser.mockRejectedValue(error);

            // Act
            await UserController.signup(mockReq, mockRes);

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Internal server error during signing up.'
            });
        });
    });

    describe('login', () => {
        it('should login user successfully', async () => {
            // Arrange
            const loginData = {
                email: 'test@example.com',
                password: 'password123'
            };

            const mockUser = {
                user_id: 'testuser',
                email: 'test@example.com',
                full_name: 'Test User'
            };
            const mockToken = 'jwt.token.here';

            mockReq.body = loginData;
            UserService.loginUser.mockResolvedValue({ user: mockUser, token: mockToken });

            // Act
            await UserController.login(mockReq, mockRes);

            // Assert
            expect(UserService.loginUser).toHaveBeenCalledWith(loginData.email, loginData.password);
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Logged in successfully',
                user: mockUser,
                token: mockToken
            });
        });

        it('should return 401 for incorrect password', async () => {
            // Arrange
            const loginData = { email: 'test@example.com', password: 'wrongpassword' };
            mockReq.body = loginData;
            const error = new Error('Password is not correct');
            UserService.loginUser.mockRejectedValue(error);

            // Act
            await UserController.login(mockReq, mockRes);

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(401);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Password is not correct'
            });
        });

        it('should return 400 for third-party auth conflict', async () => {
            // Arrange
            const loginData = { email: 'test@example.com', password: 'password123' };
            mockReq.body = loginData;
            const error = new Error('This email is registered via google. Please use google to log in.');
            UserService.loginUser.mockRejectedValue(error);

            // Act
            await UserController.login(mockReq, mockRes);

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'This email is registered via google. Please use google to log in.'
            });
        });
    });

    describe('getUserProfile', () => {
        it('should get user profile successfully', async () => {
            // Arrange
            const userId = 'testuser';
            const mockUser = {
                user_id: userId,
                full_name: 'Test User',
                email: 'test@example.com'
            };

            mockReq.params = { userId };
            mockReq.query = { 'require-email': 'true' };
            UserService.getUserById.mockResolvedValue(mockUser);

            // Act
            await UserController.getUserProfile(mockReq, mockRes);

            // Assert
            expect(UserService.getUserById).toHaveBeenCalledWith(userId, true, false);
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'User profile fetched successfully',
                user: mockUser
            });
        });

        it('should return 404 when user not found', async () => {
            // Arrange
            const userId = 'nonexistent';
            mockReq.params = { userId };
            UserService.getUserById.mockResolvedValue(null);

            // Act
            await UserController.getUserProfile(mockReq, mockRes);

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(404);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'User not found'
            });
        });
    });

    describe('getUserStripeAccountId', () => {
        it('should get user stripe account ID successfully', async () => {
            // Arrange
            const stripeAccountId = 'acct_1234567890';
            mockReq.user = { user_id: 'user123' };
            User.getUserStripeAccountId.mockResolvedValue(stripeAccountId);

            // Act
            await UserController.getUserStripeAccountId(mockReq, mockRes);

            // Assert
            expect(User.getUserStripeAccountId).toHaveBeenCalledWith('user123');
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({
                stripe_account_id: stripeAccountId
            });
        });

        it('should handle error when getting stripe account ID', async () => {
            // Arrange
            mockReq.user = { user_id: 'user123' };
            const error = new Error('Database error');
            User.getUserStripeAccountId.mockRejectedValue(error);

            // Act
            await UserController.getUserStripeAccountId(mockReq, mockRes);

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Internal server error while fetching Stripe account ID.'
            });
        });
    });

    describe('updateUserProfile', () => {
        it('should update user profile successfully', async () => {
            // Arrange
            const authorId = 'user123';
            const metadata = { full_name: 'Updated Name', bio: 'Updated bio' };

            mockReq.params = { authorId };
            mockReq.user = { user_id: authorId };
            mockReq.body = { metadata: JSON.stringify(metadata) };
            mockReq.files = [];
            UserService.updateUserInfo.mockResolvedValue();

            // Act
            await UserController.updateUserProfile(mockReq, mockRes);

            // Assert
            expect(UserService.updateUserInfo).toHaveBeenCalledWith(authorId, {
                metadata,
                profilePictureFile: null,
                backgroundImageFile: null
            });
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'User profile updated successfully'
            });
        });

        it('should return 403 when user tries to update other user profile', async () => {
            // Arrange
            mockReq.params = { authorId: 'otheruser' };
            mockReq.user = { user_id: 'user123' };

            // Act
            await UserController.updateUserProfile(mockReq, mockRes);

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(403);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Forbidden: You can only update your own profile.'
            });
        });
    });

    describe('deleteUser', () => {
        it('should delete user successfully', async () => {
            // Arrange
            const authorId = 'user123';
            const password = 'password123';

            mockReq.params = { authorId };
            mockReq.user = { user_id: authorId };
            mockReq.body = { password };
            UserService.deleteUser.mockResolvedValue();

            // Act
            await UserController.deleteUser(mockReq, mockRes);

            // Assert
            expect(UserService.deleteUser).toHaveBeenCalledWith(authorId, password);
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'User deleted successfully'
            });
        });

        it('should return 403 when user tries to delete other user', async () => {
            // Arrange
            mockReq.params = { authorId: 'otheruser' };
            mockReq.user = { user_id: 'user123' };

            // Act
            await UserController.deleteUser(mockReq, mockRes);

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(403);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Forbidden: You can only delete your own account.'
            });
        });

        it('should return 401 for incorrect password', async () => {
            // Arrange
            const authorId = 'user123';
            mockReq.params = { authorId };
            mockReq.user = { user_id: authorId };
            mockReq.body = { password: 'wrongpassword' };
            const error = new Error('Password is not correct');
            UserService.deleteUser.mockRejectedValue(error);

            // Act
            await UserController.deleteUser(mockReq, mockRes);

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(401);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Password is not correct'
            });
        });
    });

    describe('checkEmailExists', () => {
        it('should return true when email exists', async () => {
            // Arrange
            const email = 'existing@example.com';
            mockReq.query = { email };
            User.findByEmail.mockResolvedValue({ user_id: 'testuser', email });

            // Act
            await UserController.checkEmailExists(mockReq, mockRes);

            // Assert
            expect(User.findByEmail).toHaveBeenCalledWith(email);
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({ exists: true });
        });

        it('should return false when email does not exist', async () => {
            // Arrange
            const email = 'nonexistent@example.com';
            mockReq.query = { email };
            User.findByEmail.mockResolvedValue(null);

            // Act
            await UserController.checkEmailExists(mockReq, mockRes);

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({ exists: false });
        });
    });

    describe('googleLogin', () => {
        it('should login with Google successfully', async () => {
            // Arrange
            const token = 'google.jwt.token';
            const mockUser = { user_id: 'googleuser', email: 'user@gmail.com' };
            const jwtToken = 'jwt.token.here';

            mockReq.body = { token };
            UserService.googleLogin.mockResolvedValue({ user: mockUser, jwtToken });

            // Act
            await UserController.googleLogin(mockReq, mockRes);

            // Assert
            expect(UserService.googleLogin).toHaveBeenCalledWith(token);
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Logged in with Google successfully',
                user: mockUser,
                token: jwtToken
            });
        });
    });

    describe('verifyEmail', () => {
        it('should verify email successfully', async () => {
            // Arrange
            const email = 'test@example.com';
            const code = '123456';
            const mockUser = { user_id: 'testuser', email };

            mockReq.body = { email, code };
            UserService.verifyEmail.mockResolvedValue(mockUser);

            // Act
            await UserController.verifyEmail(mockReq, mockRes);

            // Assert
            expect(UserService.verifyEmail).toHaveBeenCalledWith(email, code);
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Email verified successfully',
                user: mockUser
            });
        });

        it('should return 400 for incorrect verification code', async () => {
            // Arrange
            const email = 'test@example.com';
            const code = 'wrongcode';

            mockReq.body = { email, code };
            const error = new Error('Email verification code is incorrect or has expired.');
            UserService.verifyEmail.mockRejectedValue(error);

            // Act
            await UserController.verifyEmail(mockReq, mockRes);

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Email verification code is incorrect or has expired.'
            });
        });
    });

    describe('notifyResetPassword', () => {
        it('should send password reset email successfully', async () => {
            // Arrange
            const email = 'test@example.com';
            mockReq.body = { email };
            UserService.notifyResetPassword.mockResolvedValue();

            // Act
            await UserController.notifyResetPassword(mockReq, mockRes);

            // Assert
            expect(UserService.notifyResetPassword).toHaveBeenCalledWith(email);
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Password reset email sent successfully'
            });
        });
    });

    describe('verifyResetPassword', () => {
        it('should reset password successfully', async () => {
            // Arrange
            const email = 'test@example.com';
            const code = '123456';
            const newPassword = 'newpassword123';

            mockReq.body = { email, code, newPassword };
            UserService.verifyResetPassword.mockResolvedValue();

            // Act
            await UserController.verifyResetPassword(mockReq, mockRes);

            // Assert
            expect(UserService.verifyResetPassword).toHaveBeenCalledWith(email, code, newPassword);
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Password reset successfully'
            });
        });

        it('should return 400 for incorrect reset code', async () => {
            // Arrange
            const email = 'test@example.com';
            const code = 'wrongcode';
            const newPassword = 'newpassword123';

            mockReq.body = { email, code, newPassword };
            const error = new Error('Password reset code is incorrect or has expired.');
            UserService.verifyResetPassword.mockRejectedValue(error);

            // Act
            await UserController.verifyResetPassword(mockReq, mockRes);

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Password reset code is incorrect or has expired.'
            });
        });
    });
});