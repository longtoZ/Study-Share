import React from 'react'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';

const SearchBar = ({ className = '', placeholder = 'Search...', onSearch = () => {} }: { className?: string, placeholder?: string, onSearch?: (query: string) => void }) => {
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onSearch?.(e.target.value);
    };

    return (
        <div className='bg-primary border border-primary rounded-lg p-2 inset-shadow-sm shadow-lg shadow-zinc-200'>
            <div className={`flex items-center ${className}`}>
                <SearchOutlinedIcon className='text-gray-500' />
                <input
                    type='text'
                    placeholder={placeholder}
                    className='ml-2 flex-grow outline-none'
                    onChange={handleInputChange}
                />
            </div>
        </div>
    )
}

export default SearchBar