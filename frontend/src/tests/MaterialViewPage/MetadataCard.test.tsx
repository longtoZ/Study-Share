import { render, screen } from '@testing-library/react';
import MetadataCard from '@/pages/MaterialViewPage/components/MetadataCard';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';

describe('MetadataCard Component', () => {
    const defaultProps = {
        icon: <SchoolOutlinedIcon data-testid="test-icon" />,
        label: 'Subject',
        value: 'Mathematics',
    };

    describe('Label and Value Display', () => {
        it('should render label with correct styling', () => {
            render(<MetadataCard {...defaultProps} />);
            
            const label = screen.getByText('Subject');
            expect(label).toHaveClass('text-sm', 'font-semibold', 'text-gray-500');
        });

        it('should render value with correct styling', () => {
            render(<MetadataCard {...defaultProps} />);
            
            const value = screen.getByText('Mathematics');
            expect(value).toHaveClass('font-bold');
        });

        it('should handle numeric values', () => {
            render(<MetadataCard {...defaultProps} value={42} />);
            
            expect(screen.getByText('42')).toBeInTheDocument();
        });

        it('should handle string values', () => {
            render(<MetadataCard {...defaultProps} value="Science" />);
            
            expect(screen.getByText('Science')).toBeInTheDocument();
        });

        it('should handle empty string values', () => {
            render(<MetadataCard {...defaultProps} value="" />);
            
            const valueElement = screen.getByText('Subject').nextElementSibling;
            expect(valueElement).toHaveTextContent('');
        });

        it('should handle zero as a value', () => {
            render(<MetadataCard {...defaultProps} value={0} />);
            
            expect(screen.getByText('0')).toBeInTheDocument();
        });
    });

    describe('Capitalize Option', () => {
        it('should not capitalize by default', () => {
            render(<MetadataCard {...defaultProps} value="mathematics" />);
            
            const value = screen.getByText('mathematics');
            expect(value).not.toHaveClass('capitalize');
        });

        it('should apply capitalize class when capitalize prop is true', () => {
            render(<MetadataCard {...defaultProps} value="mathematics" capitalize={true} />);
            
            const value = screen.getByText('mathematics');
            expect(value).toHaveClass('capitalize');
        });

        it('should not apply capitalize class when capitalize prop is false', () => {
            render(<MetadataCard {...defaultProps} value="mathematics" capitalize={false} />);
            
            const value = screen.getByText('mathematics');
            expect(value).not.toHaveClass('capitalize');
        });

        it('should capitalize first letter of each word visually', () => {
            render(<MetadataCard {...defaultProps} value="advanced mathematics" capitalize={true} />);
            
            const value = screen.getByText('advanced mathematics');
            expect(value).toHaveClass('capitalize');
        });
    });

    describe('Paid Content Styling', () => {
        it('should use default styling when isPaid is false', () => {
            render(<MetadataCard {...defaultProps} isPaid={false} />);
            
            const container = screen.getByText('Subject').parentElement?.parentElement;
            expect(container).toHaveClass('bg-zinc-100', 'text-zinc-700');
            expect(container).not.toHaveClass('bg-red-50', 'text-red-700');
        });

        it('should use paid styling when isPaid is true', () => {
            render(<MetadataCard {...defaultProps} isPaid={true} />);
            
            const container = screen.getByText('Subject').parentElement?.parentElement;
            expect(container).toHaveClass('bg-red-50', 'text-red-700');
            expect(container).not.toHaveClass('bg-zinc-100', 'text-zinc-700');
        });
    });

    describe('Combined Props', () => {
        it('should handle isPaid and capitalize together', () => {
            render(
                <MetadataCard 
                    {...defaultProps} 
                    value="premium content" 
                    isPaid={true} 
                    capitalize={true} 
                />
            );
            
            const container = screen.getByText('Subject').parentElement?.parentElement;
            const value = screen.getByText('premium content');
            
            expect(container).toHaveClass('bg-red-50', 'text-red-700');
            expect(value).toHaveClass('capitalize');
        });

        it('should handle all props together', () => {
            const customIcon = <span data-testid="price-icon">$</span>;
            
            render(
                <MetadataCard 
                    icon={customIcon}
                    label="Price"
                    value="premium plan"
                    isPaid={true}
                    capitalize={true}
                />
            );
            
            expect(screen.getByText('Price')).toBeInTheDocument();
            expect(screen.getByText('premium plan')).toBeInTheDocument();
            expect(screen.getByTestId('price-icon')).toBeInTheDocument();
            
            const container = screen.getByText('Price').parentElement?.parentElement;
            const value = screen.getByText('premium plan');
            
            expect(container).toHaveClass('bg-red-50', 'text-red-700');
            expect(value).toHaveClass('capitalize', 'font-bold');
        });
    });

    describe('Layout Structure', () => {
        it('should have correct DOM structure', () => {
            render(<MetadataCard {...defaultProps} />);
            
            const container = screen.getByText('Subject').parentElement?.parentElement;
            const iconContainer = screen.getByTestId('test-icon').closest('div');
            const textContainer = screen.getByText('Subject').closest('div');
            
            expect(container).toContainElement(iconContainer);
            expect(container).toContainElement(textContainer);
        });
    });

    describe('Edge Cases', () => {
        it('should handle very long labels', () => {
            const longLabel = 'This is a very long label that should still display properly';
            
            render(<MetadataCard {...defaultProps} label={longLabel} />);
            
            expect(screen.getByText(longLabel)).toBeInTheDocument();
        });

        it('should handle very long values', () => {
            const longValue = 'This is a very long value that should still display properly without breaking the layout';
            
            render(<MetadataCard {...defaultProps} value={longValue} />);
            
            expect(screen.getByText(longValue)).toBeInTheDocument();
        });

        it('should handle special characters in values', () => {
            const specialValue = '!@#$%^&*()_+-=[]{}|;:,.<>?';
            
            render(<MetadataCard {...defaultProps} value={specialValue} />);
            
            expect(screen.getByText(specialValue)).toBeInTheDocument();
        });

        it('should handle Unicode characters', () => {
            const unicodeValue = '数学 - Mathematics - 数学';
            
            render(<MetadataCard {...defaultProps} value={unicodeValue} />);
            
            expect(screen.getByText(unicodeValue)).toBeInTheDocument();
        });

        it('should handle negative numbers', () => {
            render(<MetadataCard {...defaultProps} value={-42} />);
            
            expect(screen.getByText('-42')).toBeInTheDocument();
        });

        it('should handle decimal numbers', () => {
            render(<MetadataCard {...defaultProps} value={3.14159} />);
            
            expect(screen.getByText('3.14159')).toBeInTheDocument();
        });

        it('should handle large numbers', () => {
            render(<MetadataCard {...defaultProps} value={1234567890} />);
            
            expect(screen.getByText('1234567890')).toBeInTheDocument();
        });
    });

    describe('Accessibility', () => {
        it('should be accessible with screen readers', () => {
            render(<MetadataCard {...defaultProps} />);
            
            const label = screen.getByText('Subject');
            const value = screen.getByText('Mathematics');
            
            expect(label).toBeInTheDocument();
            expect(value).toBeInTheDocument();
        });

        it('should maintain semantic structure', () => {
            render(<MetadataCard {...defaultProps} />);
            
            const label = screen.getByText('Subject');
            const value = screen.getByText('Mathematics');
            
            expect(label.tagName).toBe('P');
            expect(value.tagName).toBe('P');
        });

        it('should have appropriate contrast with paid styling', () => {
            render(<MetadataCard {...defaultProps} isPaid={true} />);
            
            const container = screen.getByText('Subject').parentElement?.parentElement;
            expect(container).toHaveClass('text-red-700'); // Should provide good contrast
        });

        it('should have appropriate contrast with default styling', () => {
            render(<MetadataCard {...defaultProps} />);
            
            const container = screen.getByText('Subject').parentElement?.parentElement;
            expect(container).toHaveClass('text-zinc-700'); // Should provide good contrast
        });
    });

    describe('CSS Classes Verification', () => {
        it('should apply all required CSS classes for default state', () => {
            render(<MetadataCard {...defaultProps} />);
            
            const container = screen.getByText('Subject').parentElement?.parentElement;
            
            expect(container).toHaveClass(
                'flex',
                'items-center', 
                'gap-3',
                'p-4',
                'rounded-xl',
                'transition-all',
                'duration-200',
                'bg-zinc-100',
                'text-zinc-700'
            );
        });

        it('should apply all required CSS classes for paid state', () => {
            render(<MetadataCard {...defaultProps} isPaid={true} />);
            
            const container = screen.getByText('Subject').parentElement?.parentElement;
            
            expect(container).toHaveClass(
                'flex',
                'items-center',
                'gap-3', 
                'p-4',
                'rounded-xl',
                'transition-all',
                'duration-200',
                'bg-red-50',
                'text-red-700'
            );
        });
    });
});