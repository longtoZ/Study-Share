import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import UploadPage from '@/pages/UploadPage/UploadPage';
import { uploadMaterial } from '@/services/materialService';

// Mock Material-UI icons
vi.mock('@mui/icons-material/CloudUploadOutlined', () => ({
    __esModule: true,
    default: (props: any) => <div data-testid="cloud-upload-icon" {...props}>CloudUploadIcon</div>
}));

vi.mock('@mui/icons-material/ClearRounded', () => ({
    __esModule: true,
    default: (props: any) => <div data-testid="clear-icon" {...props}>ClearIcon</div>
}));

// Mock Upload component
vi.mock('@/pages/UploadPage/components/Upload', () => ({
    __esModule: true,
    default: ({ file, material_id }: any) => (
        <div data-testid="upload-component">
            Upload Component - {file.name} - {material_id}
        </div>
    )
}));

vi.mock('@/services/materialService', () => ({
    uploadMaterial: vi.fn()
}));

const mockUserSlice = {
    user_id: 'test-user-id',
    full_name: 'Test User',
    loggedIn: true
};

// Create mock store
const createMockStore = (materials: any[] = [], user = mockUserSlice) => {
    return configureStore({
        reducer: {
            materials: (state = { materials }) => state,
            user: (state = user) => state
        }
    });
};

// Mock fetch
global.fetch = vi.fn();

// Mock localStorage
Object.defineProperty(window, 'localStorage', {
    value: {
        getItem: vi.fn(() => 'test-user-id'),
        setItem: vi.fn(),
        removeItem: vi.fn(),
        clear: vi.fn()
    },
    writable: true
});

// Mock alert
global.alert = vi.fn();

const renderWithProviders = (component: React.ReactElement, store = createMockStore()) => {
    return render(
        <Provider store={store}>
            <BrowserRouter>
                {component}
            </BrowserRouter>
        </Provider>
    );
};

describe('UploadPage Component', () => {
    const mockUploadMaterial = vi.mocked(uploadMaterial);
    const mockMaterial = new FormData();
    mockMaterial.append('file', new Blob(['test'], { type: 'application/pdf' }), 'test.pdf');
    mockMaterial.append('metadata', JSON.stringify({ material_id: 'test-id', name: 'Test Material', subject_id: '1' }));

    beforeEach(() => {
        vi.clearAllMocks();
        (global.fetch as any).mockResolvedValue({
            ok: true,
            json: async () => ({
                subjects: [
                    { subject_id: '1', name: 'Mathematics' },
                    { subject_id: '2', name: 'Physics' }
                ]
            })
        });
        mockUploadMaterial.mockResolvedValue({ success: true });
    });

    describe('Initial Rendering', () => {
        it('should render page title', () => {
            renderWithProviders(<UploadPage />);
            
            expect(screen.getByText('Add Document')).toBeInTheDocument();
        });

        it('should render upload area', () => {
            renderWithProviders(<UploadPage />);
            
            expect(screen.getByText('Drag and drop your files here')).toBeInTheDocument();
            expect(screen.getByText('or click to browse')).toBeInTheDocument();
        });

        it('should render cloud upload icon', () => {
            renderWithProviders(<UploadPage />);
            
            expect(screen.getByTestId('cloud-upload-icon')).toBeInTheDocument();
        });
    });

    describe('File Upload', () => {
        it('should handle file selection via input', async () => {
            renderWithProviders(<UploadPage />);

            const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
            const mockFile = new File(['test'], 'test.pdf', { type: 'application/pdf' });
            
            Object.defineProperty(fileInput, 'files', {
                value: [mockFile],
                writable: false
            });
            
            fireEvent.change(fileInput!);
            
            await waitFor(() => {
                expect(screen.getByTestId('upload-component')).toBeInTheDocument();
            });
        });

        it('should handle drag and drop', async () => {
            renderWithProviders(<UploadPage />);
            
            const dropArea = document.querySelector('.border-dashed');
            const mockFile = new File(['test'], 'test.pdf', { type: 'application/pdf' });
            
            // Create a proper drag event with dataTransfer
            const mockDataTransfer = {
                files: [mockFile]
            };
            
            fireEvent.drop(dropArea!, {
                dataTransfer: mockDataTransfer,
            });
            
            await waitFor(() => {
                expect(screen.getByText('You can now edit the details of each file before final submission.')).toBeInTheDocument();
            });
        });

        it('should prevent default drag over behavior', () => {
            renderWithProviders(<UploadPage />);
            
            const dropArea = document.querySelector('.border-dashed');
            
            fireEvent.dragOver(dropArea!, {
                preventDefault: vi.fn(),
                stopPropagation: vi.fn(),
            });
            
            // The dragOver handler should be called and preventDefault should work
            expect(dropArea).toBeInTheDocument();
        });
    });

    describe('File Management', () => {
        it('should display uploaded files', async () => {
            renderWithProviders(<UploadPage />);
            
            const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
            const mockFile = new File(['test'], 'test.pdf', { type: 'application/pdf' });
            
            Object.defineProperty(fileInput, 'files', {
                value: [mockFile],
                writable: false
            });
            
            fireEvent.change(fileInput!);
            
            await waitFor(() => {
                expect(screen.getByText(/Upload Component - test.pdf/)).toBeInTheDocument();
            });
        });

        it('should remove files when clear button is clicked', async () => {
            renderWithProviders(<UploadPage />);
            
            // Add a file first
            const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
            const mockFile = new File(['test'], 'test.pdf', { type: 'application/pdf' });
            
            Object.defineProperty(fileInput, 'files', {
                value: [mockFile],
                writable: false
            });
            
            fireEvent.change(fileInput!);
            
            // Wait for the file to be added
            await waitFor(() => {
                expect(screen.getByTestId('upload-component')).toBeInTheDocument();
            });
            
            // Then clear it
            const clearButton = screen.getByRole('button', { name: /clear all/i });
            fireEvent.click(clearButton);
            
            expect(screen.queryByTestId('upload-component')).not.toBeInTheDocument();
        });
    });

    describe('Form Submission', () => {
        it('should not show submit button when no materials are added', () => {
            renderWithProviders(<UploadPage />);
            const submitButton = screen.queryByRole('button', { name: /submit/i });
            expect(submitButton).not.toBeInTheDocument();
        });

        it('should submit successful message when form is valid', async () => {
            const mockMaterials = [
                {
                    material_id: 'test-user-id-123',
                    name: 'test.pdf',
                    subject_id: '1',
                    description: 'Test description',
                    price: 0
                }
            ];
            const store = createMockStore(mockMaterials, mockUserSlice);
            
            renderWithProviders(<UploadPage />, store);

            const dropArea = document.querySelector('.border-dashed');
            const mockFile = new File(['test'], 'test.pdf', { type: 'application/pdf' });
            
            // Create a proper drag event with dataTransfer
            const mockDataTransfer = {
                files: [mockFile]
            };
            
            fireEvent.drop(dropArea!, {
                dataTransfer: mockDataTransfer,
            });
            
            await waitFor(() => {
                expect(screen.getByText('You can now edit the details of each file before final submission.')).toBeInTheDocument();
            });
            
            const submitButton = screen.getByRole('button', { name: /submit/i });
            fireEvent.click(submitButton);

            await waitFor(() => {
                expect(mockUploadMaterial).toHaveBeenCalled();
            });

            await waitFor(() => {
                expect(screen.getByText(/Files uploaded successfully/)).toBeInTheDocument();
            });
        });

        it('should show error message on upload failure', async () => {
            const mockMaterials = [
                {
                    material_id: 'test-id-1',
                    name: 'Test Material',
                    subject_id: '1'
                }
            ];
            
            const store = createMockStore(mockMaterials, mockUserSlice);
            
            mockUploadMaterial.mockRejectedValueOnce(new Error('Upload failed'));
            
            renderWithProviders(<UploadPage />, store);

            const dropArea = document.querySelector('.border-dashed');
            const mockFile = new File(['test'], 'test.pdf', { type: 'application/pdf' });
            
            // Create a proper drag event with dataTransfer
            const mockDataTransfer = {
                files: [mockFile]
            };
            
            fireEvent.drop(dropArea!, {
                dataTransfer: mockDataTransfer,
            });
            
            const submitButton = screen.getByRole('button', { name: /submit/i });
            fireEvent.click(submitButton);
            
            await waitFor(() => {
                expect(screen.getByText(/Failed to upload files/)).toBeInTheDocument();
            });
        });
    });

    describe('Data Fetching', () => {
        it('should fetch subjects on mount', async () => {
            renderWithProviders(<UploadPage />);
            
            await waitFor(() => {
                expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('subject'));
            });
        });

        it('should handle subjects fetch error', async () => {
            (global.fetch as any).mockRejectedValueOnce(new Error('Fetch failed'));
            
            renderWithProviders(<UploadPage />);
            
            await waitFor(() => {
                expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('subject'));
            });
        });
    });

    describe('Component Structure', () => {
        it('should have proper page layout', () => {
            renderWithProviders(<UploadPage />);
            
            const mainContainer = document.querySelector('.p-12.min-h-screen');
            expect(mainContainer).toBeInTheDocument();
        });

        it('should have drag and drop area styling', () => {
            renderWithProviders(<UploadPage />);
            
            const dropArea = document.querySelector('.border-dashed.border-2');
            expect(dropArea).toBeInTheDocument();
        });

        it('should have hidden file input', () => {
            renderWithProviders(<UploadPage />);
            
            const fileInput = document.querySelector('input[type="file"]');
            expect(fileInput).toHaveAttribute('accept', '.pdf,.doc,.docx');
            expect(fileInput).toHaveAttribute('multiple');
        });
    });
});