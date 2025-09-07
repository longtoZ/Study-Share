import React, { useState, useRef, useEffect } from 'react';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

interface Option {
    id: string;
    name: string;
}

interface DropdownListProps {
    options: Option[];
    defaultValue?: string;
    placeholder?: string;
    onSelect: (value: string) => void;
    className?: string;
    hideSearch?: boolean;
    reversePosition?: boolean;
}

const DropdownList = ({
    options,
    defaultValue = '',
    placeholder = "Select an option...",
    onSelect,
    className = "",
    hideSearch = false,
    reversePosition = false,
}: DropdownListProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedValue, setSelectedValue] = useState(defaultValue);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const filteredOptions = options.filter(option =>
        option.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (option: Option) => {
        setSelectedValue(option.name);
        setSearchTerm('');
        setIsOpen(false);
        onSelect(option.id);
    };

    return (
        <div ref={dropdownRef} className={`relative ${className}`}>
            <div
                className="border border-gray-300 rounded-lg px-3 py-2 cursor-pointer bg-white hover:border-zinc-400"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className={selectedValue ? 'text-gray-900' : 'text-gray-500'}>
                    {selectedValue || placeholder}
                </span>
                <span className="float-right">
                    <ArrowDropDownIcon className="text-gray-500" style={{fontSize: '1.5rem', transform: `${isOpen ? 'rotate(180deg)' : 'rotate(0deg)'}`}} />
                </span>
            </div>

            {isOpen && (
                <div className={`absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg ${ reversePosition && 'bottom-12'}`}>
                    { !hideSearch && <input
                        type="text"
                        className="w-full px-3 py-2 border-b border-gray-200 focus:outline-none"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        autoFocus
                    /> }
                    <div className="max-h-60 overflow-y-auto">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map(option => (
                                <div
                                    key={option.id}
                                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                                    onClick={() => handleSelect(option)}
                                >
                                    {option.name}
                                </div>
                            ))
                        ) : (
                            <div className="px-3 py-2 text-gray-500">No options found</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DropdownList;