import { jest } from '@jest/globals';

// Mock the Material model
jest.unstable_mockModule('../models/material.model.js', () => ({
    default: {
        getMaterialsByUserId: jest.fn(),
        getMaterialById: jest.fn(),
        getMaterialUrlById: jest.fn(),
        updateMaterial: jest.fn(),
        deleteMaterial: jest.fn()
    }
}));

// Mock the MaterialService
jest.unstable_mockModule('../services/material.service.js', () => ({
    default: {
        uploadFile: jest.fn(),
        getStatistics: jest.fn(),
        getMaterialPage: jest.fn(),
        searchMaterial: jest.fn()
    }
}));

// Mock crypto module
jest.unstable_mockModule('crypto', () => ({
    default: {
        createHash: jest.fn(() => ({
            update: jest.fn(() => ({
                digest: jest.fn(() => 'mocked-etag-hash')
            }))
        }))
    }
}));

// Import after mocking
const MaterialController = (await import('../controllers/material.controller.js')).default;
const Material = (await import('../models/material.model.js')).default;
const MaterialService = (await import('../services/material.service.js')).default;

describe('Material Controller Tests', () => {
    let mockReq, mockRes, consoleSpy;

    beforeEach(() => {
        // Reset all mocks
        jest.clearAllMocks();
        
        // Setup mock request and response objects
        mockReq = {
            body: {},
            params: {},
            query: {},
            user: {},
            file: null,
            headers: {}
        };
        
        mockRes = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
            set: jest.fn(),
            end: jest.fn()
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

    describe('upload', () => {
        it('should upload material successfully', async () => {
            // Arrange
            const mockFile = {
                originalname: 'test.pdf',
                mimetype: 'application/pdf',
                path: '/tmp/test.pdf'
            };
            const metadata = {
                material_id: 'mat123',
                name: 'Test Material',
                description: 'Test Description',
                subject_id: 'subj123',
                size: 1024,
                file_type: 'pdf',
                is_paid: false,
                price: 0,
                user_id: 'user123',
                lesson_id: 'lesson123'
            };
            const uploadResult = {
                material: { material_id: 'mat123', name: 'Test Material' }
            };

            mockReq.file = mockFile;
            mockReq.body = { metadata: JSON.stringify(metadata) };
            MaterialService.uploadFile.mockResolvedValue(uploadResult);

            // Act
            await MaterialController.upload(mockReq, mockRes);

            // Assert
            expect(MaterialService.uploadFile).toHaveBeenCalledWith(
                expect.objectContaining({
                    material_id: 'mat123',
                    name: 'Test Material',
                    upload_date: expect.any(Date),
                    download_count: 0,
                    total_rating: 0
                }),
                mockFile
            );
            expect(mockRes.status).toHaveBeenCalledWith(201);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Material uploaded successfully',
                material: uploadResult.material
            });
        });

        it('should handle upload errors', async () => {
            // Arrange
            const mockFile = { originalname: 'test.pdf' };
            const metadata = { material_id: 'mat123', name: 'Test Material' };
            const error = new Error('Upload failed');

            mockReq.file = mockFile;
            mockReq.body = { metadata: JSON.stringify(metadata) };
            MaterialService.uploadFile.mockRejectedValue(error);

            // Act
            await MaterialController.upload(mockReq, mockRes);

            // Assert
            expect(consoleSpy.error).toHaveBeenCalledWith('Upload error:', error);
            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Internal server error during file upload.'
            });
        });
    });

    describe('getStatistics', () => {
        it('should get statistics successfully', async () => {
            // Arrange
            const mockStats = {
                total_materials: 10,
                total_lessons: 5,
                total_downloads: 100,
                average_rating: 4.5
            };

            mockReq.params = { userId: 'user123' };
            MaterialService.getStatistics.mockResolvedValue(mockStats);

            // Act
            await MaterialController.getStatistics(mockReq, mockRes);

            // Assert
            expect(MaterialService.getStatistics).toHaveBeenCalledWith('user123');
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Statistics fetched successfully',
                statistics: mockStats
            });
        });

        it('should handle statistics fetch errors', async () => {
            // Arrange
            const error = new Error('Statistics fetch failed');
            mockReq.params = { userId: 'user123' };
            MaterialService.getStatistics.mockRejectedValue(error);

            // Act
            await MaterialController.getStatistics(mockReq, mockRes);

            // Assert
            expect(consoleSpy.error).toHaveBeenCalledWith('Error fetching statistics:', error);
            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Internal server error while fetching statistics.'
            });
        });
    });

    describe('getMaterialsByUserId', () => {
        it('should get materials by user ID successfully', async () => {
            // Arrange
            const mockMaterials = [
                { material_id: 'mat1', name: 'Material 1' },
                { material_id: 'mat2', name: 'Material 2' }
            ];

            mockReq.params = { userId: 'user123' };
            mockReq.query = { order: 'newest', from: 0, to: 10 };
            Material.getMaterialsByUserId.mockResolvedValue(mockMaterials);

            // Act
            await MaterialController.getMaterialsByUserId(mockReq, mockRes);

            // Assert
            expect(Material.getMaterialsByUserId).toHaveBeenCalledWith('user123', 'newest', 0, 10);
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Materials fetched successfully',
                materials: Array.from(mockMaterials)
            });
        });

        it('should handle errors when fetching materials by user ID', async () => {
            // Arrange
            const error = new Error('Database error');
            mockReq.params = { userId: 'user123' };
            mockReq.query = {};
            Material.getMaterialsByUserId.mockRejectedValue(error);

            // Act
            await MaterialController.getMaterialsByUserId(mockReq, mockRes);

            // Assert
            expect(consoleSpy.error).toHaveBeenCalledWith('Error fetching materials:', error);
            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Internal server error while fetching materials.'
            });
        });
    });

    describe('getMaterialById', () => {
        it('should get material by ID successfully', async () => {
            // Arrange
            const mockMaterial = {
                material_id: 'mat123',
                name: 'Test Material',
                description: 'Test Description'
            };

            mockReq.params = { materialId: 'mat123' };
            Material.getMaterialById.mockResolvedValue(mockMaterial);

            // Act
            await MaterialController.getMaterialById(mockReq, mockRes);

            // Assert
            expect(Material.getMaterialById).toHaveBeenCalledWith('mat123');
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Material fetched successfully',
                material: mockMaterial
            });
        });

        it('should handle errors when fetching material by ID', async () => {
            // Arrange
            const error = new Error('Material not found');
            mockReq.params = { materialId: 'mat123' };
            Material.getMaterialById.mockRejectedValue(error);

            // Act
            await MaterialController.getMaterialById(mockReq, mockRes);

            // Assert
            expect(consoleSpy.error).toHaveBeenCalledWith('Error fetching material:', error);
            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Internal server error while fetching material.'
            });
        });
    });

    describe('getMaterialUrlById', () => {
        it('should get material URL successfully', async () => {
            // Arrange
            const mockUrl = 'https://example.com/material.pdf';
            mockReq.params = { materialId: 'mat123' };
            Material.getMaterialUrlById.mockResolvedValue(mockUrl);

            // Act
            await MaterialController.getMaterialUrlById(mockReq, mockRes);

            // Assert
            expect(Material.getMaterialUrlById).toHaveBeenCalledWith('mat123');
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Material URL fetched successfully',
                fileUrl: mockUrl
            });
        });

        it('should return 404 when material URL not found', async () => {
            // Arrange
            mockReq.params = { materialId: 'mat123' };
            Material.getMaterialUrlById.mockResolvedValue(null);

            // Act
            await MaterialController.getMaterialUrlById(mockReq, mockRes);

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(404);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Material URL not found'
            });
        });

        it('should handle errors when fetching material URL', async () => {
            // Arrange
            const error = new Error('Database error');
            mockReq.params = { materialId: 'mat123' };
            Material.getMaterialUrlById.mockRejectedValue(error);

            // Act
            await MaterialController.getMaterialUrlById(mockReq, mockRes);

            // Assert
            expect(consoleSpy.error).toHaveBeenCalledWith('Error fetching material URL:', error);
            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Internal server error while fetching material URL.'
            });
        });
    });

    describe('getMaterialPage', () => {
        it('should get material page successfully', async () => {
            // Arrange
            const mockBuffer = Buffer.from('image data');
            const mockResult = {
                contentType: 'image/webp',
                imgBuffer: mockBuffer
            };

            mockReq.params = { materialId: 'mat123', page: '1' };
            mockReq.body = { isPaid: false };
            mockReq.headers = {};
            MaterialService.getMaterialPage.mockResolvedValue(mockResult);

            // Act
            await MaterialController.getMaterialPage(mockReq, mockRes);

            // Assert
            expect(MaterialService.getMaterialPage).toHaveBeenCalledWith('mat123', '1', false);
            expect(mockRes.set).toHaveBeenCalledWith({
                "Cache-Control": "public, max-age=86400",
                "ETag": 'mocked-etag-hash',
                "Content-Type": 'image/webp'
            });
            expect(mockRes.send).toHaveBeenCalledWith(mockBuffer);
        });

        it('should return 304 for cached content', async () => {
            // Arrange
            const mockBuffer = Buffer.from('image data');
            const mockResult = {
                contentType: 'image/webp',
                imgBuffer: mockBuffer
            };

            mockReq.params = { materialId: 'mat123', page: '1' };
            mockReq.body = { isPaid: false };
            mockReq.headers = { 'if-none-match': 'mocked-etag-hash' };
            MaterialService.getMaterialPage.mockResolvedValue(mockResult);

            // Act
            await MaterialController.getMaterialPage(mockReq, mockRes);

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(304);
            expect(mockRes.end).toHaveBeenCalled();
        });

        it('should handle errors when fetching material page', async () => {
            // Arrange
            const error = new Error('Page not found');
            mockReq.params = { materialId: 'mat123', page: '1' };
            mockReq.body = { isPaid: false };
            MaterialService.getMaterialPage.mockRejectedValue(error);

            // Act
            await MaterialController.getMaterialPage(mockReq, mockRes);

            // Assert
            expect(consoleSpy.error).toHaveBeenCalledWith('Error fetching material page:', error);
            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Internal server error while fetching material page.'
            });
        });
    });

    describe('updateMaterial', () => {
        it('should update material successfully when user is authorized', async () => {
            // Arrange
            const updatedMaterial = {
                material_id: 'mat123',
                name: 'Updated Material',
                description: 'Updated Description'
            };

            mockReq.params = { materialId: 'mat123' };
            mockReq.user = { user_id: 'user123' };
            mockReq.body = {
                authorId: 'user123',
                updatedData: { name: 'Updated Material', description: 'Updated Description' }
            };
            Material.updateMaterial.mockResolvedValue(updatedMaterial);

            // Act
            await MaterialController.updateMaterial(mockReq, mockRes);

            // Assert
            expect(Material.updateMaterial).toHaveBeenCalledWith('mat123', mockReq.body.updatedData);
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Material updated successfully',
                material: updatedMaterial
            });
        });

        it('should return 403 when user is not authorized to update material', async () => {
            // Arrange
            mockReq.params = { materialId: 'mat123' };
            mockReq.user = { user_id: 'user123' };
            mockReq.body = {
                authorId: 'user456',
                updatedData: { name: 'Updated Material' }
            };

            // Act
            await MaterialController.updateMaterial(mockReq, mockRes);

            // Assert
            expect(Material.updateMaterial).not.toHaveBeenCalled();
            expect(mockRes.status).toHaveBeenCalledWith(403);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Forbidden: You are not the author of this material.'
            });
        });

        it('should handle errors when updating material', async () => {
            // Arrange
            const error = new Error('Update failed');
            mockReq.params = { materialId: 'mat123' };
            mockReq.user = { user_id: 'user123' };
            mockReq.body = {
                authorId: 'user123',
                updatedData: { name: 'Updated Material' }
            };
            Material.updateMaterial.mockRejectedValue(error);

            // Act
            await MaterialController.updateMaterial(mockReq, mockRes);

            // Assert
            expect(consoleSpy.error).toHaveBeenCalledWith('Error updating material:', error);
            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Internal server error while updating material.'
            });
        });
    });

    describe('searchMaterial', () => {
        it('should search materials successfully', async () => {
            // Arrange
            const mockMaterials = [
                { material_id: 'mat1', name: 'Math Material' },
                { material_id: 'mat2', name: 'Advanced Math' }
            ];

            mockReq.query = { query: 'math' };
            mockReq.body = { filters: { subject_id: 'subj123', sort_by: 'name', order: 'asc' } };
            MaterialService.searchMaterial.mockResolvedValue(mockMaterials);

            // Act
            await MaterialController.searchMaterial(mockReq, mockRes);

            // Assert
            expect(MaterialService.searchMaterial).toHaveBeenCalledWith('math', mockReq.body.filters);
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Search results fetched successfully',
                materials: mockMaterials
            });
        });

        it('should handle errors when searching materials', async () => {
            // Arrange
            const error = new Error('Search failed');
            mockReq.query = { query: 'math' };
            mockReq.body = { filters: {} };
            MaterialService.searchMaterial.mockRejectedValue(error);

            // Act
            await MaterialController.searchMaterial(mockReq, mockRes);

            // Assert
            expect(consoleSpy.error).toHaveBeenCalledWith('Error fetching search results:', error);
            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Internal server error while fetching search results.'
            });
        });
    });

    describe('deleteMaterial', () => {
        it('should delete material successfully when user is authorized', async () => {
            // Arrange
            const deletedMaterial = { material_id: 'mat123', deleted: true };
            mockReq.params = { materialId: 'mat123' };
            mockReq.user = { user_id: 'user123' };
            mockReq.body = { authorId: 'user123' };
            Material.deleteMaterial.mockResolvedValue(deletedMaterial);

            // Act
            await MaterialController.deleteMaterial(mockReq, mockRes);

            // Assert
            expect(Material.deleteMaterial).toHaveBeenCalledWith('mat123');
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Material deleted successfully',
                material: deletedMaterial
            });
        });

        it('should return 403 when user is not authorized to delete material', async () => {
            // Arrange
            mockReq.params = { materialId: 'mat123' };
            mockReq.user = { user_id: 'user123' };
            mockReq.body = { authorId: 'user456' };

            // Act
            await MaterialController.deleteMaterial(mockReq, mockRes);

            // Assert
            expect(Material.deleteMaterial).not.toHaveBeenCalled();
            expect(mockRes.status).toHaveBeenCalledWith(403);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Forbidden: You are not the author of this material.'
            });
        });

        it('should handle errors when deleting material', async () => {
            // Arrange
            const error = new Error('Delete failed');
            mockReq.params = { materialId: 'mat123' };
            mockReq.user = { user_id: 'user123' };
            mockReq.body = { authorId: 'user123' };
            Material.deleteMaterial.mockRejectedValue(error);

            // Act
            await MaterialController.deleteMaterial(mockReq, mockRes);

            // Assert
            expect(consoleSpy.error).toHaveBeenCalledWith('Error deleting material:', error);
            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Internal server error while deleting material.'
            });
        });
    });
});
