import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import OrdersPage from '@/pages/OrdersPage/OrdersPage';
import { getOrdersHistory } from '@/services/paymentService';

// Mock the payment service
vi.mock('@/services/paymentService', () => ({
    getOrdersHistory: vi.fn()
}));

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate
    };
});

// Mock Material-UI components
vi.mock('@mui/material/CircularProgress', () => ({
    __esModule: true,
    default: (props: any) => <div data-testid="loading-spinner" {...props}>Loading...</div>
}));

// Mock DropdownList component
vi.mock('@/components/common/DropdownList', () => ({
    __esModule: true,
    default: ({ options, defaultValue, onSelect, className }: any) => (
        <select 
            data-testid="sort-dropdown"
            className={className}
            defaultValue={defaultValue}
            onChange={(e) => {
                const selectedOption = options.find((opt: any) => opt.name === e.target.value);
                onSelect(selectedOption?.id);
            }}
        >
            {options.map((option: any) => (
                <option key={option.id} value={option.name}>
                    {option.name}
                </option>
            ))}
        </select>
    )
}));

const mockOrders = [
    {
        payment_id: 'payment-1',
        material_id: 'material-1',
        material_name: 'Advanced Calculus Notes',
        buyer_id: 'buyer-1',
        buyer_name: 'John Doe',
        amount: 15.99,
        created_date: '2024-01-15T10:30:00Z',
        status: 'paid'
    },
    {
        payment_id: 'payment-2',
        material_id: 'material-2',
        material_name: 'Data Structures Guide',
        buyer_id: 'buyer-2',
        buyer_name: 'Jane Smith',
        amount: 25.50,
        created_date: '2024-01-10T14:45:00Z',
        status: 'pending'
    },
    {
        payment_id: 'payment-3',
        material_id: 'material-3',
        material_name: 'Physics Lab Manual',
        buyer_id: 'buyer-3',
        buyer_name: 'Bob Johnson',
        amount: 12.00,
        created_date: '2024-01-05T09:15:00Z',
        status: 'failed'
    }
];

const renderWithRouter = (component: React.ReactNode) => {
    return render(
        <BrowserRouter>
            {component}
        </BrowserRouter>
    );
};

describe('OrdersPage Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        (getOrdersHistory as any).mockResolvedValue(mockOrders);
    });

    describe('Initial Rendering', () => {
        it('should render page title', () => {
            renderWithRouter(<OrdersPage />);
            
            expect(screen.getByText('Orders History')).toBeInTheDocument();
        });

        it('should render sort dropdown with default value', () => {
            renderWithRouter(<OrdersPage />);
            
            const dropdown = screen.getByTestId('sort-dropdown');
            expect(dropdown).toBeInTheDocument();
            expect(dropdown).toHaveValue('Most Recent');
        });

        it('should render date filter inputs', () => {
            renderWithRouter(<OrdersPage />);
            
            expect(screen.getByText('From')).toBeInTheDocument();
            expect(screen.getByText('To')).toBeInTheDocument();
            
            const dateInputs = screen.getAllByDisplayValue(/\d{4}-\d{2}-\d{2}/);
            expect(dateInputs).toHaveLength(2);
        });

        it('should render table headers', () => {
            renderWithRouter(<OrdersPage />);
            
            expect(screen.getByText('No.')).toBeInTheDocument();
            expect(screen.getByText('Material Name')).toBeInTheDocument();
            expect(screen.getByText('Buyer')).toBeInTheDocument();
            expect(screen.getByText('Price (USD)')).toBeInTheDocument();
            expect(screen.getByText('Purchased Date')).toBeInTheDocument();
            expect(screen.getByText('Status')).toBeInTheDocument();
        });
    });

    describe('Loading State', () => {
        it('should show loading spinner initially', async () => {
            (getOrdersHistory as any).mockImplementation(() => new Promise(resolve => setTimeout(() => resolve(mockOrders), 100)));
            
            renderWithRouter(<OrdersPage />);
            
            expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
            expect(screen.getByText('Fetching orders...')).toBeInTheDocument();
        });

        it('should hide loading spinner after data loads', async () => {
            renderWithRouter(<OrdersPage />);
            
            await waitFor(() => {
                expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
            });
        });

        it('should show loading state with proper colspan', () => {
            (getOrdersHistory as any).mockImplementation(() => new Promise(resolve => setTimeout(() => resolve(mockOrders), 100)));
            
            renderWithRouter(<OrdersPage />);
            
            const loadingCell = screen.getByTestId('loading-spinner').closest('td');
            expect(loadingCell).toHaveAttribute('colSpan', '6');
        });
    });

    describe('Orders Display', () => {
        it('should display orders when data is loaded', async () => {
            renderWithRouter(<OrdersPage />);
            
            await waitFor(() => {
                expect(screen.getByText('Advanced Calculus Notes')).toBeInTheDocument();
                expect(screen.getByText('Data Structures Guide')).toBeInTheDocument();
                expect(screen.getByText('Physics Lab Manual')).toBeInTheDocument();
            });
        });

        it('should display buyer names', async () => {
            renderWithRouter(<OrdersPage />);
            
            await waitFor(() => {
                expect(screen.getByText('John Doe')).toBeInTheDocument();
                expect(screen.getByText('Jane Smith')).toBeInTheDocument();
                expect(screen.getByText('Bob Johnson')).toBeInTheDocument();
            });
        });

        it('should display formatted prices', async () => {
            renderWithRouter(<OrdersPage />);
            
            await waitFor(() => {
                expect(screen.getByText('$15.99')).toBeInTheDocument();
                expect(screen.getByText('$25.50')).toBeInTheDocument();
                expect(screen.getByText('$12.00')).toBeInTheDocument();
            });
        });

        it('should display row numbers correctly', async () => {
            renderWithRouter(<OrdersPage />);
            
            await waitFor(() => {
                const rows = screen.getAllByRole('row');
                // Skip header row (index 0), check data rows
                expect(rows[1]).toHaveTextContent('1');
                expect(rows[2]).toHaveTextContent('2');
                expect(rows[3]).toHaveTextContent('3');
            });
        });

        it('should display formatted dates', async () => {
            renderWithRouter(<OrdersPage />);
            
            await waitFor(() => {
                // Check that dates are displayed (exact format may vary by locale)
                expect(screen.getByText(/1\/15\/2024/)).toBeInTheDocument();
            });
        });
    });

    describe('Status Display', () => {
        it('should display paid status with green styling', async () => {
            renderWithRouter(<OrdersPage />);
            
            await waitFor(() => {
                const paidStatus = screen.getByText('Paid');
                expect(paidStatus).toBeInTheDocument();
                expect(paidStatus.closest('span')).toHaveClass('from-emerald-500', 'to-lime-500');
            });
        });

        it('should display pending status with yellow styling', async () => {
            renderWithRouter(<OrdersPage />);
            
            await waitFor(() => {
                const pendingStatus = screen.getByText('Pending');
                expect(pendingStatus).toBeInTheDocument();
                expect(pendingStatus.closest('span')).toHaveClass('from-yellow-500', 'to-amber-500');
            });
        });

        it('should display failed status with red styling', async () => {
            renderWithRouter(<OrdersPage />);
            
            await waitFor(() => {
                const failedStatus = screen.getByText('Failed');
                expect(failedStatus).toBeInTheDocument();
                expect(failedStatus.closest('span')).toHaveClass('from-red-500', 'to-amber-500');
            });
        });

        it('should capitalize status text', async () => {
            renderWithRouter(<OrdersPage />);
            
            await waitFor(() => {
                expect(screen.getByText('Paid')).toBeInTheDocument(); // 'paid' -> 'Paid'
                expect(screen.getByText('Pending')).toBeInTheDocument(); // 'pending' -> 'Pending'
                expect(screen.getByText('Failed')).toBeInTheDocument(); // 'failed' -> 'Failed'
            });
        });
    });

    describe('Empty State', () => {
        it('should display no orders message when orders array is empty', async () => {
            (getOrdersHistory as any).mockResolvedValue([]);
            
            renderWithRouter(<OrdersPage />);
            
            await waitFor(() => {
                expect(screen.getByText('No orders history found.')).toBeInTheDocument();
            });
        });

        it('should show empty message with proper colspan', async () => {
            (getOrdersHistory as any).mockResolvedValue([]);
            
            renderWithRouter(<OrdersPage />);
            
            await waitFor(() => {
                const emptyCell = screen.getByText('No orders history found.').closest('td');
                expect(emptyCell).toHaveAttribute('colSpan', '6');
            });
        });
    });

    describe('Sorting Functionality', () => {
        it('should have correct sort options', () => {
            renderWithRouter(<OrdersPage />);
            
            const dropdown = screen.getByTestId('sort-dropdown');
            expect(dropdown).toContainHTML('Lowest to Highest');
            expect(dropdown).toContainHTML('Highest to Lowest');
            expect(dropdown).toContainHTML('Most Recent');
        });

        it('should call getOrdersHistory when sort order changes', async () => {
            renderWithRouter(<OrdersPage />);
            
            // Clear the initial call
            vi.clearAllMocks();
            
            const dropdown = screen.getByTestId('sort-dropdown');
            fireEvent.change(dropdown, { target: { value: 'Lowest to Highest' } });
            
            await waitFor(() => {
                expect(getOrdersHistory).toHaveBeenCalledWith(
                    expect.objectContaining({ 
                        from: expect.any(Date), 
                        to: expect.any(Date) 
                    })
                );
            });
        });

        it('should trigger API call when sort changes', async () => {
            renderWithRouter(<OrdersPage />);
            
            // Clear the initial call
            vi.clearAllMocks();
            
            const dropdown = screen.getByTestId('sort-dropdown');
            fireEvent.change(dropdown, { target: { value: 'Highest to Lowest' } });
            
            await waitFor(() => {
                expect(getOrdersHistory).toHaveBeenCalled();
            });
        });
    });

    describe('Date Filtering', () => {
        it('should have default date values', () => {
            renderWithRouter(<OrdersPage />);
            
            const dateInputs = screen.getAllByDisplayValue(/\d{4}-\d{2}-\d{2}/);
            expect(dateInputs).toHaveLength(2);
            
            // First input should be epoch start, second should be today
            expect(dateInputs[0]).toHaveValue('1970-01-01');
            expect(dateInputs[1]).toHaveValue(new Date().toISOString().split('T')[0]);
        });

        it('should update from date when changed', () => {
            renderWithRouter(<OrdersPage />);
            
            const dateInputs = screen.getAllByDisplayValue(/\d{4}-\d{2}-\d{2}/);
            const fromInput = dateInputs[0];
            
            fireEvent.change(fromInput, { target: { value: '2024-01-01' } });
            
            expect((fromInput as HTMLInputElement).value).toBe('2024-01-01');
        });

        it('should update to date when changed', () => {
            renderWithRouter(<OrdersPage />);
            
            const dateInputs = screen.getAllByDisplayValue(/\d{4}-\d{2}-\d{2}/);
            const toInput = dateInputs[1];
            
            fireEvent.change(toInput, { target: { value: '2024-12-31' } });
            
            expect((toInput as HTMLInputElement).value).toBe('2024-12-31');
        });

        it('should have proper date input styling', () => {
            renderWithRouter(<OrdersPage />);
            
            const dateInputs = screen.getAllByDisplayValue(/\d{4}-\d{2}-\d{2}/);
            
            dateInputs.forEach(input => {
                expect(input).toHaveClass('p-2', 'rounded-md', 'border');
            });
        });
    });

    describe('Navigation', () => {
        it('should navigate to material page when material name is clicked', async () => {
            renderWithRouter(<OrdersPage />);
            
            await waitFor(() => {
                const materialLink = screen.getByText('Advanced Calculus Notes');
                fireEvent.click(materialLink);
                
                expect(mockNavigate).toHaveBeenCalledWith('/material/material-1');
            });
        });

        it('should navigate to user page when buyer name is clicked', async () => {
            renderWithRouter(<OrdersPage />);
            
            await waitFor(() => {
                const buyerLink = screen.getByText('John Doe');
                fireEvent.click(buyerLink);
                
                expect(mockNavigate).toHaveBeenCalledWith('/user/buyer-1');
            });
        });

        it('should have proper styling for clickable material names', async () => {
            renderWithRouter(<OrdersPage />);
            
            await waitFor(() => {
                const materialLink = screen.getByText('Advanced Calculus Notes');
                expect(materialLink).toHaveClass('text-blue-500', 'font-semibold', 'hover:underline', 'cursor-pointer');
            });
        });
    });

    describe('Table Structure', () => {
        it('should have proper table structure', () => {
            renderWithRouter(<OrdersPage />);
            
            const table = screen.getByRole('table');
            expect(table).toBeInTheDocument();
            expect(table).toHaveClass('w-full', 'border-collapse');
        });

        it('should have responsive table container', () => {
            renderWithRouter(<OrdersPage />);
            
            const tableContainer = document.querySelector('.overflow-x-auto');
            expect(tableContainer).toBeInTheDocument();
        });

        it('should have proper header styling', () => {
            renderWithRouter(<OrdersPage />);
            
            const headers = screen.getAllByRole('columnheader');
            headers.forEach(header => {
                expect(header).toHaveClass('text-left', 'py-3', 'px-4', 'font-semibold', 'text-gray-700');
            });
        });

        it('should have hover effects on table rows', async () => {
            renderWithRouter(<OrdersPage />);
            
            await waitFor(() => {
                const dataRows = screen.getAllByRole('row').slice(1); // Skip header row
                dataRows.forEach((row, index) => {
                    if (index < mockOrders.length) { // Only check actual data rows
                        expect(row).toHaveClass('hover:bg-gray-50');
                    }
                });
            });
        });
    });

    describe('Component Layout', () => {
        it('should have proper page container styling', () => {
            renderWithRouter(<OrdersPage />);
            
            const container = document.querySelector('.p-6.overflow-y-auto');
            expect(container).toBeInTheDocument();
        });

        it('should have proper card styling', () => {
            renderWithRouter(<OrdersPage />);
            
            const card = document.querySelector('.bg-white.rounded-3xl.shadow-xl');
            expect(card).toBeInTheDocument();
        });

        it('should have proper spacing between elements', () => {
            renderWithRouter(<OrdersPage />);
            
            const title = screen.getByText('Orders History');
            expect(title).toHaveClass('text-2xl', 'font-bold', 'mb-8', 'mt-4');
        });
    });

    describe('Error Handling', () => {
        it('should handle API errors gracefully', async () => {
            (getOrdersHistory as any).mockRejectedValue(new Error('API Error'));
            
            renderWithRouter(<OrdersPage />);
            
            // Component should not crash and should show loading initially
            expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
        });

        it('should handle undefined orders response', async () => {
            (getOrdersHistory as any).mockResolvedValue(undefined);
            
            renderWithRouter(<OrdersPage />);
            
            await waitFor(() => {
                expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
            });
        });

        it('should handle orders with missing fields', async () => {
            const incompleteOrders = [
                {
                    payment_id: 'payment-1',
                    material_name: 'Test Material',
                    // Missing other fields
                }
            ];
            
            (getOrdersHistory as any).mockResolvedValue(incompleteOrders);
            
            renderWithRouter(<OrdersPage />);
            
            await waitFor(() => {
                expect(screen.getByText('Test Material')).toBeInTheDocument();
            });
        });
    });

    describe('Data Formatting', () => {
        it('should format dates in UTC timezone', async () => {
            renderWithRouter(<OrdersPage />);
            
            await waitFor(() => {
                // Check that toLocaleString is called with UTC timezone
                // The exact format depends on the browser/locale, but should contain date parts
                const dateElements = screen.getAllByText(/2024/);
                expect(dateElements.length).toBeGreaterThan(0);
            });
        });

        it('should format prices with 2 decimal places', async () => {
            renderWithRouter(<OrdersPage />);
            
            await waitFor(() => {
                expect(screen.getByText('$15.99')).toBeInTheDocument();
                expect(screen.getByText('$25.50')).toBeInTheDocument();
                expect(screen.getByText('$12.00')).toBeInTheDocument(); // Should show .00 for whole numbers
            });
        });

        it('should handle very large amounts', async () => {
            const orderWithLargeAmount = [{
                ...mockOrders[0],
                amount: 999999.99
            }];
            
            (getOrdersHistory as any).mockResolvedValue(orderWithLargeAmount);
            
            renderWithRouter(<OrdersPage />);
            
            await waitFor(() => {
                expect(screen.getByText('$999999.99')).toBeInTheDocument();
            });
        });
    });

    describe('Accessibility', () => {
        it('should have proper table accessibility', () => {
            renderWithRouter(<OrdersPage />);
            
            const table = screen.getByRole('table');
            const headers = screen.getAllByRole('columnheader');
            const rows = screen.getAllByRole('row');
            
            expect(table).toBeInTheDocument();
            expect(headers.length).toBe(6);
            expect(rows.length).toBeGreaterThan(0);
        });

        it('should have proper form labels', () => {
            renderWithRouter(<OrdersPage />);
            
            expect(screen.getByText('From')).toBeInTheDocument();
            expect(screen.getByText('To')).toBeInTheDocument();
            expect(screen.getByText('Sort by')).toBeInTheDocument();
        });

        it('should have proper heading hierarchy', () => {
            renderWithRouter(<OrdersPage />);
            
            const mainTitle = screen.getByText('Orders History');
            const sortLabel = screen.getByText('Sort by');
            
            expect(mainTitle.tagName).toBe('H1');
            expect(sortLabel.tagName).toBe('H2');
        });
    });
});