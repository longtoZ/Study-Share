import { jest } from '@jest/globals';

// Mock the Payment model
jest.unstable_mockModule('../models/payment.model.js', () => ({
    default: {
        updateStripeAccountId: jest.fn(),
        checkMaterialPayment: jest.fn(),
        getPaymentsByUserId: jest.fn(),
        getOrdersByUserId: jest.fn()
    }
}));

// Mock the PaymentService
jest.unstable_mockModule('../services/payment.service.js', () => ({
    default: {
        redirectToCheckout: jest.fn(),
        savePaymentDetails: jest.fn()
    }
}));

// Mock the Stripe config
jest.unstable_mockModule('../config/stripe.config.js', () => ({
    default: {
        accounts: {
            create: jest.fn()
        },
        oauth: {
            token: jest.fn()
        }
    }
}));

// Import after mocking
const PaymentController = (await import('../controllers/payment.controller.js')).default;
const Payment = (await import('../models/payment.model.js')).default;
const PaymentService = (await import('../services/payment.service.js')).default;
const stripe = (await import('../config/stripe.config.js')).default;

describe('Payment Controller Tests', () => {
    let mockReq, mockRes, consoleSpy;

    beforeEach(() => {
        // Reset all mocks
        jest.clearAllMocks();
        
        // Setup mock request and response objects
        mockReq = {
            body: {},
            query: {},
            user: {}
        };
        
        mockRes = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
            redirect: jest.fn()
        };

        // Mock console methods to avoid cluttering test output
        consoleSpy = {
            log: jest.spyOn(console, 'log').mockImplementation(() => {}),
            error: jest.spyOn(console, 'error').mockImplementation(() => {})
        };

        // Mock process.env
        process.env.FRONTEND_ORIGIN = 'https://example.com';
    });

    afterEach(() => {
        // Restore console methods
        consoleSpy.log.mockRestore();
        consoleSpy.error.mockRestore();
    });

    describe('createConnectedAccount', () => {
        it('should create connected account successfully', async () => {
            // Arrange
            const mockAccount = {
                id: 'acct_test123',
                type: 'express',
                country: 'US'
            };

            mockReq.body = { email: 'test@example.com' };
            stripe.accounts.create.mockResolvedValue(mockAccount);

            // Act
            await PaymentController.createConnectedAccount(mockReq, mockRes);

            // Assert
            expect(stripe.accounts.create).toHaveBeenCalledWith({
                type: 'express',
                country: 'US',
                email: 'test@example.com',
                capabilities: {
                    card_payments: { requested: true },
                    transfers: { requested: true }
                }
            });
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({
                accountId: 'acct_test123'
            });
        });

        it('should handle errors when creating connected account', async () => {
            // Arrange
            const error = new Error('Stripe account creation failed');
            mockReq.body = { email: 'test@example.com' };
            stripe.accounts.create.mockRejectedValue(error);

            // Act
            await PaymentController.createConnectedAccount(mockReq, mockRes);

            // Assert
            expect(consoleSpy.error).toHaveBeenCalledWith(error);
            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({
                error: 'Stripe account creation failed'
            });
        });
    });

    describe('redirectToCheckout', () => {
        it('should redirect to checkout successfully', async () => {
            // Arrange
            const checkoutData = {
                material_id: 'mat123',
                name: 'Test Material',
                buyer_id: 'buyer123',
                seller_id: 'seller123',
                amount: 29.99,
                currency: 'usd'
            };
            const mockSession = {
                url: 'https://checkout.stripe.com/pay/session123'
            };

            mockReq.body = checkoutData;
            PaymentService.redirectToCheckout.mockResolvedValue(mockSession);

            // Act
            await PaymentController.redirectToCheckout(mockReq, mockRes);

            // Assert
            expect(PaymentService.redirectToCheckout).toHaveBeenCalledWith(checkoutData);
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({
                url: 'https://checkout.stripe.com/pay/session123'
            });
        });

        it('should handle errors when redirecting to checkout', async () => {
            // Arrange
            const checkoutData = { material_id: 'mat123' };
            const error = new Error('Checkout session creation failed');

            mockReq.body = checkoutData;
            PaymentService.redirectToCheckout.mockRejectedValue(error);

            // Act
            await PaymentController.redirectToCheckout(mockReq, mockRes);

            // Assert
            expect(consoleSpy.error).toHaveBeenCalledWith(error);
            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({
                error: 'Checkout session creation failed'
            });
        });
    });

    describe('paymentSuccess', () => {
        it('should handle payment success and redirect to file URL', async () => {
            // Arrange
            const sessionId = 'cs_test_session123';
            const fileUrl = 'https://example.com/file.pdf';

            mockReq.query = { session_id: sessionId };
            PaymentService.savePaymentDetails.mockResolvedValue(fileUrl);

            // Act
            await PaymentController.paymentSuccess(mockReq, mockRes);

            // Assert
            expect(PaymentService.savePaymentDetails).toHaveBeenCalledWith(sessionId);
            expect(mockRes.redirect).toHaveBeenCalledWith(fileUrl);
        });

        it('should handle errors during payment success processing', async () => {
            // Arrange
            const sessionId = 'cs_test_session123';
            const error = new Error('Payment processing failed');

            mockReq.query = { session_id: sessionId };
            PaymentService.savePaymentDetails.mockRejectedValue(error);

            // Act
            await PaymentController.paymentSuccess(mockReq, mockRes);

            // Assert
            expect(consoleSpy.error).toHaveBeenCalledWith(error);
            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({
                error: 'Payment processing failed'
            });
        });
    });

    describe('accountAuthorizationCallback', () => {
        it('should handle account authorization callback successfully', async () => {
            // Arrange
            const mockOAuthResponse = {
                stripe_user_id: 'acct_connected123'
            };

            mockReq.query = {
                code: 'auth_code_123',
                state: 'user123'
            };
            stripe.oauth.token.mockResolvedValue(mockOAuthResponse);
            Payment.updateStripeAccountId.mockResolvedValue();

            // Act
            await PaymentController.accountAuthorizationCallback(mockReq, mockRes);

            // Assert
            expect(stripe.oauth.token).toHaveBeenCalledWith({
                grant_type: 'authorization_code',
                code: 'auth_code_123'
            });
            expect(Payment.updateStripeAccountId).toHaveBeenCalledWith('user123', 'acct_connected123');
            expect(mockRes.redirect).toHaveBeenCalledWith(
                'https://example.com/dashboard?connected_account_id=acct_connected123'
            );
        });

        it('should handle errors during account authorization callback', async () => {
            // Arrange
            const error = new Error('OAuth authorization failed');

            mockReq.query = {
                code: 'auth_code_123',
                state: 'user123'
            };
            stripe.oauth.token.mockRejectedValue(error);

            // Act
            await PaymentController.accountAuthorizationCallback(mockReq, mockRes);

            // Assert
            expect(consoleSpy.error).toHaveBeenCalledWith(error);
            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({
                error: 'OAuth authorization failed'
            });
        });
    });

    describe('checkMaterialPayment', () => {
        it('should check material payment successfully', async () => {
            // Arrange
            const mockPayment = {
                payment_id: 'pi_test123',
                material_id: 'mat123',
                buyer_id: 'user123',
                status: 'paid'
            };

            mockReq.user = { user_id: 'user123' };
            mockReq.query = { material_id: 'mat123' };
            Payment.checkMaterialPayment.mockResolvedValue(mockPayment);

            // Act
            await PaymentController.checkMaterialPayment(mockReq, mockRes);

            // Assert
            expect(Payment.checkMaterialPayment).toHaveBeenCalledWith('user123', 'mat123');
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith(mockPayment);
        });

        it('should handle errors when checking material payment', async () => {
            // Arrange
            const error = new Error('Payment check failed');

            mockReq.user = { user_id: 'user123' };
            mockReq.query = { material_id: 'mat123' };
            Payment.checkMaterialPayment.mockRejectedValue(error);

            // Act
            await PaymentController.checkMaterialPayment(mockReq, mockRes);

            // Assert
            expect(consoleSpy.error).toHaveBeenCalledWith(error);
            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({
                error: 'Payment check failed'
            });
        });
    });

    describe('getPaymentHistory', () => {
        it('should get payment history successfully with filters', async () => {
            // Arrange
            const mockPayments = [
                {
                    payment_id: 'pi_test1',
                    material_id: 'mat1',
                    amount: 29.99,
                    created_date: '2025-09-20T10:00:00Z'
                },
                {
                    payment_id: 'pi_test2',
                    material_id: 'mat2',
                    amount: 19.99,
                    created_date: '2025-09-19T15:30:00Z'
                }
            ];
            const filter = {
                from: '2025-09-01',
                to: '2025-09-30',
                order: 'date'
            };

            mockReq.user = { user_id: 'user123' };
            mockReq.body = { filter };
            Payment.getPaymentsByUserId.mockResolvedValue(mockPayments);

            // Act
            await PaymentController.getPaymentHistory(mockReq, mockRes);

            // Assert
            expect(Payment.getPaymentsByUserId).toHaveBeenCalledWith('user123', filter);
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({
                payments: mockPayments
            });
        });

        it('should get payment history successfully without filters', async () => {
            // Arrange
            const mockPayments = [];

            mockReq.user = { user_id: 'user123' };
            mockReq.body = {}; // No filter
            Payment.getPaymentsByUserId.mockResolvedValue(mockPayments);

            // Act
            await PaymentController.getPaymentHistory(mockReq, mockRes);

            // Assert
            expect(Payment.getPaymentsByUserId).toHaveBeenCalledWith('user123', {});
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({
                payments: mockPayments
            });
        });

        it('should handle errors when getting payment history', async () => {
            // Arrange
            const error = new Error('Database query failed');

            mockReq.user = { user_id: 'user123' };
            mockReq.body = { filter: {} };
            Payment.getPaymentsByUserId.mockRejectedValue(error);

            // Act
            await PaymentController.getPaymentHistory(mockReq, mockRes);

            // Assert
            expect(consoleSpy.error).toHaveBeenCalledWith(error);
            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({
                error: 'Database query failed'
            });
        });
    });

    describe('getOrdersHistory', () => {
        it('should get orders history successfully with filters', async () => {
            // Arrange
            const mockOrders = [
                {
                    payment_id: 'pi_order1',
                    material_id: 'mat1',
                    amount: 29.99,
                    buyer_id: 'buyer123',
                    created_date: '2025-09-20T10:00:00Z'
                },
                {
                    payment_id: 'pi_order2',
                    material_id: 'mat2',
                    amount: 19.99,
                    buyer_id: 'buyer456',
                    created_date: '2025-09-19T15:30:00Z'
                }
            ];
            const filter = {
                from: '2025-09-01',
                to: '2025-09-30',
                order: 'amount'
            };

            mockReq.user = { user_id: 'seller123' };
            mockReq.body = { filter };
            Payment.getOrdersByUserId.mockResolvedValue(mockOrders);

            // Act
            await PaymentController.getOrdersHistory(mockReq, mockRes);

            // Assert
            expect(Payment.getOrdersByUserId).toHaveBeenCalledWith('seller123', filter);
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({
                orders: mockOrders
            });
        });

        it('should get orders history successfully without filters', async () => {
            // Arrange
            const mockOrders = [];

            mockReq.user = { user_id: 'seller123' };
            mockReq.body = {}; // No filter
            Payment.getOrdersByUserId.mockResolvedValue(mockOrders);

            // Act
            await PaymentController.getOrdersHistory(mockReq, mockRes);

            // Assert
            expect(Payment.getOrdersByUserId).toHaveBeenCalledWith('seller123', {});
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({
                orders: mockOrders
            });
        });

        it('should handle errors when getting orders history', async () => {
            // Arrange
            const error = new Error('Database query failed');

            mockReq.user = { user_id: 'seller123' };
            mockReq.body = { filter: {} };
            Payment.getOrdersByUserId.mockRejectedValue(error);

            // Act
            await PaymentController.getOrdersHistory(mockReq, mockRes);

            // Assert
            expect(consoleSpy.error).toHaveBeenCalledWith(error);
            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({
                error: 'Database query failed'
            });
        });
    });
});
