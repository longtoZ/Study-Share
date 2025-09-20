import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ChatPannel from '@/pages/MaterialViewPage/components/ChatPannel';
import { generateResponse } from '@/services/aiChatService';

vi.mock('@/services/aiChatService', () => ({
    generateResponse: vi.fn(),
}));

// Mock DropdownList component
vi.mock('@/components/common/DropdownList', () => ({
    default: ({ options, onSelect, placeholder, className }: any) => (
        <div className={`dropdown-mock ${className}`} data-testid="dropdown-list">
            <select 
                onChange={(e) => onSelect(e.target.value)}
                data-testid="ai-model-select"
            >
                <option value="">{placeholder}</option>
                {options.map((option: any) => (
                    <option key={option.id} value={option.id}>
                        {option.name}
                    </option>
                ))}
            </select>
        </div>
    ),
}));

// Mock react-markdown
vi.mock('react-markdown', () => ({
    default: ({ children }: { children: string }) => <div data-testid="markdown">{children}</div>,
}));

const renderWithRouter = (component: React.ReactElement) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
};

const defaultProps = {
    open: true,
    onClose: vi.fn(),
    userId: 'test-user-id',
    materialId: 'test-material-id',
};

describe('ChatPannel Component', () => {
    const mockGenerateResponse = vi.mocked(generateResponse);
    const mockOnClose = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        mockGenerateResponse.mockResolvedValue('This is a test AI response');
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('Rendering Conditions', () => {
        it('should not render when userId or materialId is missing', () => {
            const { container } = renderWithRouter(
                <ChatPannel 
                    open={true}
                    onClose={mockOnClose}
                    userId=""
                    materialId="test-material-id"
                />
            );
            
            expect(container.firstChild).toBeNull();
        });

        it('should not render when materialId is missing', () => {
            const { container } = renderWithRouter(
                <ChatPannel 
                    open={true}
                    onClose={mockOnClose}
                    userId="test-user-id"
                    materialId=""
                />
            );
            
            expect(container.firstChild).toBeNull();
        });

        it('should render when both userId and materialId are provided', () => {
            renderWithRouter(<ChatPannel {...defaultProps} />);
            
            expect(screen.getByText('AI Chat')).toBeInTheDocument();
        });
    });

    describe('Panel Visibility', () => {
        it('should show panel when open is true', () => {
            renderWithRouter(<ChatPannel {...defaultProps} open={true} />);
            
            const panel = screen.getByText('AI Chat').closest('div');
            expect(panel).not.toHaveClass('translate-x-full');
        });

        it('should hide panel when open is false', () => {
            renderWithRouter(<ChatPannel {...defaultProps} open={false} />);
            
            const chatPanel = document.querySelector('.translate-x-full');
            expect(chatPanel).toBeInTheDocument();
        });

        it('should apply correct overlay classes when open', () => {
            renderWithRouter(<ChatPannel {...defaultProps} open={true} />);
            
            const overlay = document.querySelector('.bg-\\[\\#00000080\\]');
            expect(overlay).toHaveClass('opacity-100');
        });

        it('should apply correct overlay classes when closed', () => {
            renderWithRouter(<ChatPannel {...defaultProps} open={false} />);
            
            const overlay = document.querySelector('.bg-\\[\\#00000080\\]');
            expect(overlay).toHaveClass('opacity-0', 'pointer-events-none');
        });
    });

    describe('Header and Close Functionality', () => {
        it('should render header with AI Chat title', () => {
            renderWithRouter(<ChatPannel {...defaultProps} />);
            
            expect(screen.getByText('AI Chat')).toBeInTheDocument();
        });

        it('should call onClose when close button is clicked', () => {
            renderWithRouter(<ChatPannel {...defaultProps} onClose={mockOnClose} />);
            
            const closeButton = screen.getByRole('button', { name: /close chat/i });
            fireEvent.click(closeButton);
            
            expect(mockOnClose).toHaveBeenCalledTimes(1);
        });

        it('should call onClose when overlay is clicked', () => {
            renderWithRouter(<ChatPannel {...defaultProps} onClose={mockOnClose} />);
            
            const overlay = document.querySelector('.bg-\\[\\#00000080\\]');
            if (overlay) {
                fireEvent.click(overlay);
            }
            
            expect(mockOnClose).toHaveBeenCalledTimes(1);
        });
    });

    describe('AI Model Selection', () => {
        it('should render AI model dropdown', () => {
            renderWithRouter(<ChatPannel {...defaultProps} />);
            
            expect(screen.getByTestId('ai-model-select')).toBeInTheDocument();
            expect(screen.getByDisplayValue('Select AI Model')).toBeInTheDocument();
        });

        it('should add welcome message when model is selected', async () => {
            renderWithRouter(<ChatPannel {...defaultProps} />);
            
            const modelSelect = screen.getByTestId('ai-model-select');
            fireEvent.change(modelSelect, { target: { value: 'gpt-3.5-turbo' } });
            
            await waitFor(() => {
                expect(screen.getByText(/AI model set to GPT-3.5 Turbo/)).toBeInTheDocument();
            });
        });

        it('should disable input when no model is selected', () => {
            renderWithRouter(<ChatPannel {...defaultProps} />);
            
            const input = screen.getByPlaceholderText('Type your message...');
            expect(input).toBeDisabled();
        });

        it('should enable input when model is selected', async () => {
            renderWithRouter(<ChatPannel {...defaultProps} />);
            
            const modelSelect = screen.getByTestId('ai-model-select');
            fireEvent.change(modelSelect, { target: { value: 'gpt-3.5-turbo' } });
            
            await waitFor(() => {
                const input = screen.getByPlaceholderText('Type your message...');
                expect(input).not.toBeDisabled();
            });
        });
    });

    describe('Message Input and Display', () => {
        beforeEach(async () => {
            renderWithRouter(<ChatPannel {...defaultProps} />);
            
            // Select AI model first
            const modelSelect = screen.getByTestId('ai-model-select');
            fireEvent.change(modelSelect, { target: { value: 'gpt-3.5-turbo' } });
            
            await waitFor(() => {
                expect(screen.getByText(/AI model set to GPT-3.5 Turbo/)).toBeInTheDocument();
            });
        });

        it('should update input value when typing', async () => {
            const input = screen.getByPlaceholderText('Type your message...');
            
            fireEvent.change(input, { target: { value: 'Hello AI' } });
            
            expect(input).toHaveValue('Hello AI');
        });

        it('should send message when send button is clicked', async () => {
            const input = screen.getByPlaceholderText('Type your message...');
            const sendButton = screen.getByRole('button', { name: /send message/i });
            
            fireEvent.change(input, { target: { value: 'Hello AI' } });
            fireEvent.click(sendButton);
            
            await waitFor(() => {
                expect(screen.getByText('Hello AI')).toBeInTheDocument();
                expect(mockGenerateResponse).toHaveBeenCalledWith(
                    'test-user-id',
                    'test-material-id',
                    'Hello AI',
                    'gpt-3.5-turbo'
                );
            });
        });

        it('should send message when Enter key is pressed', async () => {
            const input = screen.getByPlaceholderText('Type your message...');
            
            fireEvent.change(input, { target: { value: 'Hello AI' } });
            fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
            
            await waitFor(() => {
                expect(screen.getByText('Hello AI')).toBeInTheDocument();
                expect(mockGenerateResponse).toHaveBeenCalledWith(
                    'test-user-id',
                    'test-material-id',
                    'Hello AI',
                    'gpt-3.5-turbo'
                );
            });
        });

        it('should not send empty messages', async () => {
            const sendButton = screen.getByRole('button', { name: /send/i });
            
            fireEvent.click(sendButton);
            
            expect(mockGenerateResponse).not.toHaveBeenCalled();
        });

        it('should clear input after sending message', async () => {
            const input = screen.getByPlaceholderText('Type your message...');
            const sendButton = screen.getByRole('button', { name: /send/i });
            
            fireEvent.change(input, { target: { value: 'Hello AI' } });
            fireEvent.click(sendButton);
            
            await waitFor(() => {
                expect(input).toHaveValue('');
            });
        });
    });

    describe('Message Conversation', () => {
        beforeEach(async () => {
            renderWithRouter(<ChatPannel {...defaultProps} />);
            
            // Select AI model first
            const modelSelect = screen.getByTestId('ai-model-select');
            fireEvent.change(modelSelect, { target: { value: 'gpt-3.5-turbo' } });
            
            await waitFor(() => {
                expect(screen.getByText(/AI model set to GPT-3.5 Turbo/)).toBeInTheDocument();
            });
        });

        it('should display user messages with correct styling', async () => {
            const input = screen.getByPlaceholderText('Type your message...');
            const sendButton = screen.getByRole('button', { name: /send/i });
            
            fireEvent.change(input, { target: { value: 'Hello AI' } });
            fireEvent.click(sendButton);
            
            await waitFor(() => {
                const userMessage = screen.getByText('Hello AI');
                const messageContainer = userMessage.closest('div');
                expect(messageContainer).toHaveClass('bg-gradient-to-r', 'from-blue-500', 'to-violet-600');
            });
        });

        it('should show thinking message while waiting for AI response', async () => {
            mockGenerateResponse.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve('AI response'), 100)));
            
            const input = screen.getByPlaceholderText('Type your message...');
            const sendButton = screen.getByRole('button', { name: /send message/i });
            
            fireEvent.change(input, { target: { value: 'Hello AI' } });
            fireEvent.click(sendButton);
            
            // Should show thinking message
            await waitFor(() => {
                expect(screen.getByText(/I'm reading/i)).toBeInTheDocument();
            });
            
            // Should show actual response after delay
            await waitFor(() => {
                expect(screen.getByText('AI response')).toBeInTheDocument();
            }, { timeout: 200 });
        });

        it('should show special message for first AI interaction', async () => {
            const input = screen.getByPlaceholderText('Type your message...');
            const sendButton = screen.getByRole('button', { name: /send/i });
            
            fireEvent.change(input, { target: { value: 'First message' } });
            fireEvent.click(sendButton);
            
            await waitFor(() => {
                expect(screen.getByText(/I'm reading the material for the first time/)).toBeInTheDocument();
            });
        });

        it('should display correct AI icon based on selected model', async () => {
            // Test GPT icon
            const modelSelect = screen.getByTestId('ai-model-select');
            fireEvent.change(modelSelect, { target: { value: 'gpt-3.5-turbo' } });
            
            const input = screen.getByPlaceholderText('Type your message...');
            const sendButton = screen.getByRole('button', { name: /send/i });
            
            fireEvent.change(input, { target: { value: 'Hello' } });
            fireEvent.click(sendButton);
            
            await waitFor(() => {
                const aiIcon = document.querySelector('img[alt="AI"]');
                expect(aiIcon).toHaveAttribute('src', expect.stringContaining('chatgpt-icon'));
            });
        });

        it('should display Gemini icon for Gemini model', async () => {
            // Test Gemini icon
            const modelSelect = screen.getByTestId('ai-model-select');
            fireEvent.change(modelSelect, { target: { value: 'gemini-2.0-flash-lite' } });
            
            const input = screen.getByPlaceholderText('Type your message...');
            const sendButton = screen.getByRole('button', { name: /send/i });
            
            fireEvent.change(input, { target: { value: 'Hello' } });
            fireEvent.click(sendButton);
            
            await waitFor(() => {
                const aiIcon = document.querySelector('img[alt="AI"]');
                expect(aiIcon).toHaveAttribute('src', expect.stringContaining('google-gemini-icon'));
            });
        });
    });

    describe('Empty State', () => {
        it('should show "No messages yet" when there are no messages', () => {
            renderWithRouter(<ChatPannel {...defaultProps} />);
            
            expect(screen.getByText('No messages yet.')).toBeInTheDocument();
        });

        it('should hide empty state when messages exist', async () => {
            renderWithRouter(<ChatPannel {...defaultProps} />);
            
            // Select AI model first
            const modelSelect = screen.getByTestId('ai-model-select');
            fireEvent.change(modelSelect, { target: { value: 'gpt-3.5-turbo' } });
            
            await waitFor(() => {
                expect(screen.queryByText('No messages yet.')).not.toBeInTheDocument();
            });
        });
    });

    describe('Error Handling', () => {
        beforeEach(async () => {
            renderWithRouter(<ChatPannel {...defaultProps} />);
            
            // Select AI model first
            const modelSelect = screen.getByTestId('ai-model-select');
            fireEvent.change(modelSelect, { target: { value: 'gpt-3.5-turbo' } });
            
            await waitFor(() => {
                expect(screen.getByText(/AI model set to GPT-3.5 Turbo/)).toBeInTheDocument();
            });
        });

        it('should handle AI response errors gracefully', async () => {
            mockGenerateResponse.mockRejectedValue(new Error('AI service error'));
            
            const input = screen.getByPlaceholderText('Type your message...');
            const sendButton = screen.getByRole('button', { name: /send/i });
            
            fireEvent.change(input, { target: { value: 'Hello AI' } });
            fireEvent.click(sendButton);
            
            await waitFor(() => {
                expect(screen.getByText('Hello AI')).toBeInTheDocument();
            });
        });
    });

    describe('Accessibility', () => {
        it('should have proper ARIA labels', () => {
            renderWithRouter(<ChatPannel {...defaultProps} />);
            
            const input = screen.getByPlaceholderText('Type your message...');
            expect(input).toHaveAttribute('autocomplete', 'off');
        });

        it('should support keyboard navigation', async () => {
            renderWithRouter(<ChatPannel {...defaultProps} />);
            
            // Select AI model first
            const modelSelect = screen.getByTestId('ai-model-select');
            fireEvent.change(modelSelect, { target: { value: 'gpt-3.5-turbo' } });
            
            await waitFor(() => {
                const input = screen.getByPlaceholderText('Type your message...');
                expect(input).not.toBeDisabled();
            });
            
            const input = screen.getByPlaceholderText('Type your message...');
            
            // Test Enter key functionality
            fireEvent.change(input, { target: { value: 'Test message' } });
            fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
            
            await waitFor(() => {
                expect(mockGenerateResponse).toHaveBeenCalled();
            });
        });
    });
});