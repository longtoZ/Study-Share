import { jest } from '@jest/globals';

// Mock the Subject model
jest.unstable_mockModule('../models/subject.model.js', () => ({
    default: {
        getAll: jest.fn(),
        getById: jest.fn()
    }
}));

// Import after mocking
const SubjectController = (await import('../controllers/subject.controller.js')).default;
const Subject = (await import('../models/subject.model.js')).default;

describe('Subject Controller Tests', () => {
    let mockReq, mockRes;

    beforeEach(() => {
        // Reset all mocks
        jest.clearAllMocks();
        
        // Setup mock request and response objects
        mockReq = {
            params: {}
        };
        
        mockRes = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
        };
    });

    describe('getAllSubject', () => {
        it('should get all subjects successfully', async () => {
            // Arrange
            const mockSubjects = [
                { subject_id: 'subj1', name: 'Mathematics', description: 'Math subjects' },
                { subject_id: 'subj2', name: 'Science', description: 'Science subjects' },
                { subject_id: 'subj3', name: 'History', description: 'History subjects' }
            ];

            Subject.getAll.mockResolvedValue(mockSubjects);

            // Act
            await SubjectController.getAllSubject(mockReq, mockRes);

            // Assert
            expect(Subject.getAll).toHaveBeenCalled();
            expect(mockRes.status).toHaveBeenCalledWith(201);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Subjects retrieved successfully',
                subjects: mockSubjects
            });
        });

        it('should handle errors when getting all subjects', async () => {
            // Arrange
            const error = new Error('Database connection failed');
            Subject.getAll.mockRejectedValue(error);

            // Act
            await SubjectController.getAllSubject(mockReq, mockRes);

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Internal server error during subjects retrieving'
            });
        });
    });

    describe('getSubjectById', () => {
        it('should get subject by ID successfully', async () => {
            // Arrange
            const subjectId = 'subj123';
            const mockSubject = {
                subject_id: subjectId,
                name: 'Mathematics',
                description: 'Advanced mathematics course'
            };

            mockReq.params = { subject_id: subjectId };
            Subject.getById.mockResolvedValue(mockSubject);

            // Act
            await SubjectController.getSubjectById(mockReq, mockRes);

            // Assert
            expect(Subject.getById).toHaveBeenCalledWith(subjectId);
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Subject retrieved successfully',
                subject: mockSubject
            });
        });

        it('should return 404 when subject not found', async () => {
            // Arrange
            const subjectId = 'nonexistent';
            mockReq.params = { subject_id: subjectId };
            Subject.getById.mockResolvedValue(null);

            // Act
            await SubjectController.getSubjectById(mockReq, mockRes);

            // Assert
            expect(Subject.getById).toHaveBeenCalledWith(subjectId);
            expect(mockRes.status).toHaveBeenCalledWith(404);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Subject not found'
            });
        });

        it('should return 404 for PGRST116 error code', async () => {
            // Arrange
            const subjectId = 'subj123';
            const error = new Error('No rows returned');
            error.code = 'PGRST116';

            mockReq.params = { subject_id: subjectId };
            Subject.getById.mockRejectedValue(error);

            // Act
            await SubjectController.getSubjectById(mockReq, mockRes);

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(404);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Subject not found'
            });
        });

        it('should handle other errors when getting subject by ID', async () => {
            // Arrange
            const subjectId = 'subj123';
            const error = new Error('Database connection failed');

            mockReq.params = { subject_id: subjectId };
            Subject.getById.mockRejectedValue(error);

            // Act
            await SubjectController.getSubjectById(mockReq, mockRes);

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Internal server error during subject retrieving'
            });
        });
    });
});