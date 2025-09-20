import { render, screen, fireEvent } from '@testing-library/react';
import PersonalInfoStep from '@/pages/SignupPage/components/PersonalInfoStep';

// Mock the DropdownList component
vi.mock('@/components/common/DropdownList', () => ({
    __esModule: true,
    default: ({ options, placeholder, onSelect }: any) => (
        <select 
            data-testid="gender-dropdown"
            onChange={(e) => {
                const selectedOption = options.find((opt: any) => opt.id === e.target.value);
                onSelect(selectedOption);
            }}
        >
            <option value="">{placeholder}</option>
            {options.map((option: any) => (
                <option key={option.id} value={option.id}>
                    {option.name}
                </option>
            ))}
        </select>
    )
}));

// Mock Material-UI components
vi.mock('@mui/material/CircularProgress', () => ({
    __esModule: true,
    default: ({ ...props }) => <div data-testid="loading-spinner" {...props}>Loading...</div>
}));

const mockProps = {
    formData: {
        full_name: '',
        username: '',
        gender: '',
        dateOfBirth: '',
        address: ''
    },
    handleInputChange: vi.fn(),
    handlePrevStep: vi.fn(),
    setFormData: vi.fn(),
    isLoading: false
};

describe('PersonalInfoStep Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('Initial Rendering', () => {
        it('should render title', () => {
            render(<PersonalInfoStep {...mockProps} />);
            
            expect(screen.getByText('Personal Information')).toBeInTheDocument();
        });

        it('should render full name input field', () => {
            render(<PersonalInfoStep {...mockProps} />);
            
            expect(screen.getByLabelText('Full Name *')).toBeInTheDocument();
            expect(screen.getByPlaceholderText('Enter your full name')).toBeInTheDocument();
        });

        it('should render username input field', () => {
            render(<PersonalInfoStep {...mockProps} />);
            
            expect(screen.getByLabelText('Username *')).toBeInTheDocument();
            expect(screen.getByPlaceholderText('@username')).toBeInTheDocument();
        });

        it('should render date of birth input field', () => {
            render(<PersonalInfoStep {...mockProps} />);
            
            expect(screen.getByLabelText('Date of Birth')).toBeInTheDocument();
        });

        it('should render address input field', () => {
            render(<PersonalInfoStep {...mockProps} />);
            
            expect(screen.getByLabelText('Address')).toBeInTheDocument();
            expect(screen.getByPlaceholderText('Enter your address')).toBeInTheDocument();
        });

        it('should render previous and create account buttons', () => {
            render(<PersonalInfoStep {...mockProps} />);
            
            expect(screen.getByRole('button', { name: /previous/i })).toBeInTheDocument();
            expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
        });
    });

    describe('Form Data Display', () => {
        it('should display full name value from formData', () => {
            const propsWithData = {
                ...mockProps,
                formData: {
                    ...mockProps.formData,
                    full_name: 'John Doe'
                }
            };
            
            render(<PersonalInfoStep {...propsWithData} />);
            
            const fullNameInput = screen.getByDisplayValue('John Doe');
            expect(fullNameInput).toBeInTheDocument();
        });

        it('should display username value from formData', () => {
            const propsWithData = {
                ...mockProps,
                formData: {
                    ...mockProps.formData,
                    username: 'johndoe'
                }
            };
            
            render(<PersonalInfoStep {...propsWithData} />);
            
            const usernameInput = screen.getByDisplayValue('johndoe');
            expect(usernameInput).toBeInTheDocument();
        });

        it('should display date of birth value from formData', () => {
            const propsWithData = {
                ...mockProps,
                formData: {
                    ...mockProps.formData,
                    dateOfBirth: '1990-01-01'
                }
            };
            
            render(<PersonalInfoStep {...propsWithData} />);
            
            const dateInput = screen.getByDisplayValue('1990-01-01');
            expect(dateInput).toBeInTheDocument();
        });

        it('should display address value from formData', () => {
            const propsWithData = {
                ...mockProps,
                formData: {
                    ...mockProps.formData,
                    address: '123 Main St'
                }
            };
            
            render(<PersonalInfoStep {...propsWithData} />);
            
            const addressInput = screen.getByDisplayValue('123 Main St');
            expect(addressInput).toBeInTheDocument();
        });
    });

    describe('User Interactions', () => {
        it('should call handleInputChange when full name input changes', () => {
            render(<PersonalInfoStep {...mockProps} />);
            
            const fullNameInput = screen.getByLabelText('Full Name *');
            fireEvent.change(fullNameInput, { target: { value: 'Jane Doe' } });
            
            expect(mockProps.handleInputChange).toHaveBeenCalled();
        });

        it('should call handleInputChange when username input changes', () => {
            render(<PersonalInfoStep {...mockProps} />);
            
            const usernameInput = screen.getByLabelText('Username *');
            fireEvent.change(usernameInput, { target: { value: 'janedoe' } });
            
            expect(mockProps.handleInputChange).toHaveBeenCalled();
        });

        it('should call handleInputChange when date of birth input changes', () => {
            render(<PersonalInfoStep {...mockProps} />);
            
            const dateInput = screen.getByLabelText('Date of Birth');
            fireEvent.change(dateInput, { target: { value: '1995-01-01' } });
            
            expect(mockProps.handleInputChange).toHaveBeenCalled();
        });

        it('should call handleInputChange when address input changes', () => {
            render(<PersonalInfoStep {...mockProps} />);
            
            const addressInput = screen.getByLabelText('Address');
            fireEvent.change(addressInput, { target: { value: '456 Oak St' } });
            
            expect(mockProps.handleInputChange).toHaveBeenCalled();
        });

        it('should call setFormData when gender is selected', () => {
            render(<PersonalInfoStep {...mockProps} />);
            
            const genderDropdown = screen.getByTestId('gender-dropdown');
            fireEvent.change(genderDropdown, { target: { value: 'male' } });
            
            expect(mockProps.setFormData).toHaveBeenCalledWith(expect.any(Function));
        });

        it('should call handlePrevStep when previous button is clicked', () => {
            render(<PersonalInfoStep {...mockProps} />);
            
            const prevButton = screen.getByRole('button', { name: /previous/i });
            fireEvent.click(prevButton);
            
            expect(mockProps.handlePrevStep).toHaveBeenCalled();
        });
    });

    describe('Gender Dropdown Options', () => {
        it('should render all gender options', () => {
            render(<PersonalInfoStep {...mockProps} />);
            
            expect(screen.getByText('Select your gender')).toBeInTheDocument();
            expect(screen.getByText('Male')).toBeInTheDocument();
            expect(screen.getByText('Female')).toBeInTheDocument();
            expect(screen.getByText('Prefer not to say')).toBeInTheDocument();
        });

        it('should handle gender selection correctly', () => {
            render(<PersonalInfoStep {...mockProps} />);
            
            const genderDropdown = screen.getByTestId('gender-dropdown');
            fireEvent.change(genderDropdown, { target: { value: 'female' } });
            
            expect(mockProps.setFormData).toHaveBeenCalledWith(expect.any(Function));
        });
    });

    describe('Loading State', () => {
        it('should show loading spinner when loading', () => {
            const loadingProps = {
                ...mockProps,
                isLoading: true
            };
            
            render(<PersonalInfoStep {...loadingProps} />);
            
            expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
        });

        it('should show create account text when not loading', () => {
            render(<PersonalInfoStep {...mockProps} />);
            
            expect(screen.getByText('Create Account')).toBeInTheDocument();
            expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
        });
    });

    describe('Form Validation', () => {
        it('should have required attribute on full name input', () => {
            render(<PersonalInfoStep {...mockProps} />);
            
            const fullNameInput = screen.getByLabelText('Full Name *');
            expect(fullNameInput).toHaveAttribute('required');
        });

        it('should have required attribute on username input', () => {
            render(<PersonalInfoStep {...mockProps} />);
            
            const usernameInput = screen.getByLabelText('Username *');
            expect(usernameInput).toHaveAttribute('required');
        });

        it('should have text type on text inputs', () => {
            render(<PersonalInfoStep {...mockProps} />);
            
            const fullNameInput = screen.getByLabelText('Full Name *');
            const usernameInput = screen.getByLabelText('Username *');
            const addressInput = screen.getByLabelText('Address');
            
            expect(fullNameInput).toHaveAttribute('type', 'text');
            expect(usernameInput).toHaveAttribute('type', 'text');
            expect(addressInput).toHaveAttribute('type', 'text');
        });

        it('should have date type on date input', () => {
            render(<PersonalInfoStep {...mockProps} />);
            
            const dateInput = screen.getByLabelText('Date of Birth');
            expect(dateInput).toHaveAttribute('type', 'date');
        });
    });

    describe('Input Properties', () => {
        it('should have correct input attributes', () => {
            render(<PersonalInfoStep {...mockProps} />);
            
            const fullNameInput = screen.getByLabelText('Full Name *');
            const usernameInput = screen.getByLabelText('Username *');
            
            expect(fullNameInput).toHaveAttribute('id', 'full_name');
            expect(fullNameInput).toHaveAttribute('name', 'full_name');
            expect(usernameInput).toHaveAttribute('id', 'username');
            expect(usernameInput).toHaveAttribute('name', 'username');
        });

        it('should have proper styling classes on inputs', () => {
            render(<PersonalInfoStep {...mockProps} />);
            
            const inputs = [
                screen.getByLabelText('Full Name *'),
                screen.getByLabelText('Username *'),
                screen.getByLabelText('Date of Birth'),
                screen.getByLabelText('Address')
            ];
            
            inputs.forEach(input => {
                expect(input).toHaveClass('w-full', 'px-4', 'py-2', 'border', 'border-gray-300', 'rounded-lg');
            });
        });

        it('should have proper styling classes on buttons', () => {
            render(<PersonalInfoStep {...mockProps} />);
            
            const prevButton = screen.getByRole('button', { name: /previous/i });
            const submitButton = screen.getByRole('button', { name: /create account/i });
            
            expect(prevButton).toHaveClass('bg-gray-500', 'text-white', 'py-3', 'px-4', 'rounded-lg');
            expect(submitButton).toHaveClass('button-primary', 'font-medium', 'w-1/2');
        });
    });

    describe('Accessibility', () => {
        it('should have proper labels for form inputs', () => {
            render(<PersonalInfoStep {...mockProps} />);
            
            expect(screen.getByLabelText('Full Name *')).toBeInTheDocument();
            expect(screen.getByLabelText('Username *')).toBeInTheDocument();
            expect(screen.getByLabelText('Date of Birth')).toBeInTheDocument();
            expect(screen.getByLabelText('Address')).toBeInTheDocument();
        });

        it('should have proper button roles', () => {
            render(<PersonalInfoStep {...mockProps} />);
            
            expect(screen.getByRole('button', { name: /previous/i })).toBeInTheDocument();
            expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
        });

        it('should support keyboard navigation', () => {
            render(<PersonalInfoStep {...mockProps} />);
            
            const fullNameInput = screen.getByLabelText('Full Name *');
            fullNameInput.focus();
            
            expect(document.activeElement).toBe(fullNameInput);
        });
    });

    describe('Component Structure', () => {
        it('should have proper container structure', () => {
            render(<PersonalInfoStep {...mockProps} />);
            
            const title = screen.getByText('Personal Information');
            expect(title).toHaveClass('text-2xl', 'font-bold', 'text-gray-800', 'mb-6');
        });

        it('should have button container with proper layout', () => {
            render(<PersonalInfoStep {...mockProps} />);
            
            const buttonContainer = document.querySelector('.flex.space-x-4');
            expect(buttonContainer).toBeInTheDocument();
        });
    });
});