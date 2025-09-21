import { jest } from '@jest/globals';

// Mock the Lesson model
jest.unstable_mockModule('../models/lesson.model.js', () => ({
    default: {
        getLessonsByUserId: jest.fn(),
        createLesson: jest.fn(),
        getAllMaterialsByLessonId: jest.fn(),
        addMaterialToLesson: jest.fn(),
        getLessonById: jest.fn(),
        updateLesson: jest.fn(),
        deleteLesson: jest.fn()
    }
}));

// Mock the LessonService
jest.unstable_mockModule('../services/lesson.service.js', () => ({
    default: {
        searchLesson: jest.fn()
    }
}));

// Import after mocking
const LessonController = (await import('../controllers/lesson.controller.js')).default;
const Lesson = (await import('../models/lesson.model.js')).default;
const LessonService = (await import('../services/lesson.service.js')).default;

describe('Lesson Controller Tests', () => {
    let mockReq, mockRes, consoleSpy;

    beforeEach(() => {
        // Reset all mocks
        jest.clearAllMocks();
        
        // Setup mock request and response objects
        mockReq = {
            body: {},
            params: {},
            query: {},
            user: {}
        };
        
        mockRes = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
        };

        // Mock console methods to avoid cluttering test output
        consoleSpy = {
            log: jest.spyOn(console, 'log').mockImplementation(() => {}),
            error: jest.spyOn(console, 'error').mockImplementation(() => {})
        };
    });

    afterEach(() => {
        // Restore console methods
        consoleSpy.log.mockRestore();
        consoleSpy.error.mockRestore();
    });

    describe('getLessonsByUserId', () => {
        it('should get lessons by user ID successfully', async () => {
            // Arrange
            const mockLessons = [
                { lesson_id: 'lesson1', title: 'Math Lesson', user_id: 'user123' },
                { lesson_id: 'lesson2', title: 'Science Lesson', user_id: 'user123' }
            ];

            mockReq.params = { userId: 'user123' };
            mockReq.query = { order: 'newest', from: 0, to: 10 };
            Lesson.getLessonsByUserId.mockResolvedValue(mockLessons);

            // Act
            await LessonController.getLessonsByUserId(mockReq, mockRes);

            // Assert
            expect(Lesson.getLessonsByUserId).toHaveBeenCalledWith('user123', 'newest', 0, 10);
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Lessons fetched successfully',
                lessons: mockLessons
            });
        });

        it('should handle errors when fetching lessons by user ID', async () => {
            // Arrange
            const error = new Error('Database error');
            mockReq.params = { userId: 'user123' };
            mockReq.query = {};
            Lesson.getLessonsByUserId.mockRejectedValue(error);

            // Act
            await LessonController.getLessonsByUserId(mockReq, mockRes);

            // Assert
            expect(consoleSpy.log).toHaveBeenCalledWith('Error fetching lessons');
            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Internal server error while fetching lessons.'
            });
        });
    });

    describe('createLesson', () => {
        it('should create lesson successfully', async () => {
            // Arrange
            const lessonData = {
                title: 'New Math Lesson',
                description: 'Advanced mathematics',
                user_id: 'user123'
            };
            const newLesson = { lesson_id: 'lesson123', ...lessonData };

            mockReq.body = lessonData;
            Lesson.createLesson.mockResolvedValue(newLesson);

            // Act
            await LessonController.createLesson(mockReq, mockRes);

            // Assert
            expect(Lesson.createLesson).toHaveBeenCalledWith(lessonData);
            expect(mockRes.status).toHaveBeenCalledWith(201);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Lesson created successfully',
                lesson: newLesson
            });
        });

        it('should handle errors when creating lesson', async () => {
            // Arrange
            const lessonData = { title: 'New Lesson' };
            const error = new Error('Validation error');

            mockReq.body = lessonData;
            Lesson.createLesson.mockRejectedValue(error);

            // Act
            await LessonController.createLesson(mockReq, mockRes);

            // Assert
            expect(consoleSpy.log).toHaveBeenCalledWith('Error creating lesson:', error);
            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Internal server error while creating lesson.'
            });
        });
    });

    describe('getAllMaterialsByLessonId', () => {
        it('should get all materials by lesson ID successfully', async () => {
            // Arrange
            const mockData = {
                materials: [
                    { material_id: 'mat1', title: 'Material 1' },
                    { material_id: 'mat2', title: 'Material 2' }
                ],
                total: 2
            };

            mockReq.params = { lessonId: 'lesson123' };
            mockReq.query = { order: 'newest' };
            Lesson.getAllMaterialsByLessonId.mockResolvedValue(mockData);

            // Act
            await LessonController.getAllMaterialsByLessonId(mockReq, mockRes);

            // Assert
            expect(Lesson.getAllMaterialsByLessonId).toHaveBeenCalledWith('lesson123', 'newest');
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Materials fetched successfully',
                ...mockData
            });
        });

        it('should handle errors when fetching materials by lesson ID', async () => {
            // Arrange
            const error = new Error('Lesson not found');
            mockReq.params = { lessonId: 'lesson123' };
            mockReq.query = {};
            Lesson.getAllMaterialsByLessonId.mockRejectedValue(error);

            // Act
            await LessonController.getAllMaterialsByLessonId(mockReq, mockRes);

            // Assert
            expect(consoleSpy.error).toHaveBeenCalledWith('Error fetching materials:', error);
            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Internal server error while fetching materials.'
            });
        });
    });

    describe('addMaterialToLesson', () => {
        it('should add material to lesson successfully', async () => {
            // Arrange
            const result = { success: true, message: 'Material added' };
            mockReq.params = { lessonId: 'lesson123' };
            mockReq.query = { 'material-id': 'material456' };
            Lesson.addMaterialToLesson.mockResolvedValue(result);

            // Act
            await LessonController.addMaterialToLesson(mockReq, mockRes);

            // Assert
            expect(Lesson.addMaterialToLesson).toHaveBeenCalledWith('lesson123', 'material456');
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Material added to lesson successfully',
                result
            });
        });

        it('should handle errors when adding material to lesson', async () => {
            // Arrange
            const error = new Error('Material already exists in lesson');
            mockReq.params = { lessonId: 'lesson123' };
            mockReq.query = { 'material-id': 'material456' };
            Lesson.addMaterialToLesson.mockRejectedValue(error);

            // Act
            await LessonController.addMaterialToLesson(mockReq, mockRes);

            // Assert
            expect(consoleSpy.error).toHaveBeenCalledWith('Error adding material to lesson:', error);
            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Internal server error while adding material to lesson.'
            });
        });
    });

    describe('getLessonById', () => {
        it('should get lesson by ID successfully', async () => {
            // Arrange
            const mockLesson = {
                lesson_id: 'lesson123',
                title: 'Math Lesson',
                description: 'Advanced mathematics'
            };

            mockReq.params = { lessonId: 'lesson123' };
            Lesson.getLessonById.mockResolvedValue(mockLesson);

            // Act
            await LessonController.getLessonById(mockReq, mockRes);

            // Assert
            expect(Lesson.getLessonById).toHaveBeenCalledWith('lesson123');
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Lesson fetched successfully',
                lesson: mockLesson
            });
        });

        it('should handle errors when fetching lesson by ID', async () => {
            // Arrange
            const error = new Error('Lesson not found');
            mockReq.params = { lessonId: 'lesson123' };
            Lesson.getLessonById.mockRejectedValue(error);

            // Act
            await LessonController.getLessonById(mockReq, mockRes);

            // Assert
            expect(consoleSpy.error).toHaveBeenCalledWith('Error fetching lesson:', error);
            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Internal server error while fetching lesson.'
            });
        });
    });

    describe('updateLesson', () => {
        it('should update lesson successfully when user is authorized', async () => {
            // Arrange
            const updatedLesson = {
                lesson_id: 'lesson123',
                title: 'Updated Lesson',
                description: 'Updated description'
            };

            mockReq.params = { lessonId: 'lesson123' };
            mockReq.user = { id: 'user123' };
            mockReq.body = {
                authorId: 'user123',
                updatedData: { title: 'Updated Lesson', description: 'Updated description' }
            };
            Lesson.updateLesson.mockResolvedValue(updatedLesson);

            // Act
            await LessonController.updateLesson(mockReq, mockRes);

            // Assert
            expect(Lesson.updateLesson).toHaveBeenCalledWith('lesson123', mockReq.body.updatedData);
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Lesson updated successfully',
                lesson: updatedLesson
            });
        });

        it('should return 403 when user is not authorized to update lesson', async () => {
            // Arrange
            mockReq.params = { lessonId: 'lesson123' };
            mockReq.user = { id: 'user123' };
            mockReq.body = {
                authorId: 'user456',
                updatedData: { title: 'Updated Lesson' }
            };

            // Act
            await LessonController.updateLesson(mockReq, mockRes);

            // Assert
            expect(Lesson.updateLesson).not.toHaveBeenCalled();
            expect(mockRes.status).toHaveBeenCalledWith(403);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Forbidden: You are not the author of this lesson.'
            });
        });

        it('should handle errors when updating lesson', async () => {
            // Arrange
            const error = new Error('Update failed');
            mockReq.params = { lessonId: 'lesson123' };
            mockReq.user = { id: 'user123' };
            mockReq.body = {
                authorId: 'user123',
                updatedData: { title: 'Updated Lesson' }
            };
            Lesson.updateLesson.mockRejectedValue(error);

            // Act
            await LessonController.updateLesson(mockReq, mockRes);

            // Assert
            expect(consoleSpy.error).toHaveBeenCalledWith('Error updating lesson:', error);
            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Internal server error while updating lesson.'
            });
        });
    });

    describe('searchLesson', () => {
        it('should search lessons successfully', async () => {
            // Arrange
            const mockLessons = [
                { lesson_id: 'lesson1', title: 'Math Basics' },
                { lesson_id: 'lesson2', title: 'Advanced Math' }
            ];

            mockReq.query = { query: 'math' };
            mockReq.body = { filters: { subject: 'mathematics' } };
            LessonService.searchLesson.mockResolvedValue(mockLessons);

            // Act
            await LessonController.searchLesson(mockReq, mockRes);

            // Assert
            expect(LessonService.searchLesson).toHaveBeenCalledWith('math', { subject: 'mathematics' });
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Lessons fetched successfully',
                lessons: mockLessons
            });
        });

        it('should handle errors when searching lessons', async () => {
            // Arrange
            const error = new Error('Search failed');
            mockReq.query = { query: 'math' };
            mockReq.body = { filters: {} };
            LessonService.searchLesson.mockRejectedValue(error);

            // Act
            await LessonController.searchLesson(mockReq, mockRes);

            // Assert
            expect(consoleSpy.error).toHaveBeenCalledWith('Error fetching lessons:', error);
            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Internal server error while fetching lessons.'
            });
        });
    });

    describe('deleteLesson', () => {
        it('should delete lesson successfully when user is authorized', async () => {
            // Arrange
            const deletedLesson = { lesson_id: 'lesson123', deleted: true };
            mockReq.params = { lessonId: 'lesson123' };
            mockReq.user = { id: 'user123' };
            mockReq.body = { authorId: 'user123' };
            Lesson.deleteLesson.mockResolvedValue(deletedLesson);

            // Act
            await LessonController.deleteLesson(mockReq, mockRes);

            // Assert
            expect(Lesson.deleteLesson).toHaveBeenCalledWith('lesson123');
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Lesson deleted successfully',
                lesson: deletedLesson
            });
        });

        it('should return 403 when user is not authorized to delete lesson', async () => {
            // Arrange
            mockReq.params = { lessonId: 'lesson123' };
            mockReq.user = { id: 'user123' };
            mockReq.body = { authorId: 'user456' };

            // Act
            await LessonController.deleteLesson(mockReq, mockRes);

            // Assert
            expect(Lesson.deleteLesson).not.toHaveBeenCalled();
            expect(mockRes.status).toHaveBeenCalledWith(403);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Forbidden: You are not the author of this lesson.'
            });
        });

        it('should handle errors when deleting lesson', async () => {
            // Arrange
            const error = new Error('Delete failed');
            mockReq.params = { lessonId: 'lesson123' };
            mockReq.user = { id: 'user123' };
            mockReq.body = { authorId: 'user123' };
            Lesson.deleteLesson.mockRejectedValue(error);

            // Act
            await LessonController.deleteLesson(mockReq, mockRes);

            // Assert
            expect(consoleSpy.error).toHaveBeenCalledWith('Error deleting lesson:', error);
            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Internal server error while deleting lesson.'
            });
        });
    });
});
