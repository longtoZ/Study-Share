import React from 'react';
import DropdownList from '@/components/common/DropdownList';
import CircularProgress from '@mui/material/CircularProgress';

interface PersonalInfoStepProps {
    formData: any;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    handlePrevStep: () => void;
    setFormData: (data: any) => void;
    isLoading: boolean;
}

const genderOptions = [
    {
        id: 'male',
        name: 'Male'
    },
    {
        id: 'female',
        name: 'Female'
    },
    {
        id: 'prefer_not_to_say',
        name: 'Prefer not to say'
    }
];

const PersonalInfoStep: React.FC<PersonalInfoStepProps> = ({
    formData,
    handleInputChange,
    handlePrevStep,
    setFormData,
    isLoading
}) => {
    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Personal Information</h2>
            <div className="mb-4">
                <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                </label>
                <input
                    type="text"
                    id="full_name"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleInputChange}
                    placeholder='Enter your full name'
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
            </div>
            <div className="mb-4">
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                    Username *
                </label>
                <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="@username"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
            </div>
            <div className="mb-4">
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
                    Gender
                </label>
                <DropdownList options={genderOptions} placeholder='Select your gender' hideSearch={true} onSelect={(option) => {
                    setFormData((prev: any) => ({
                        ...prev,
                        ['gender']: option
                    }));
                }} />
            </div>
            <div className="mb-4">
                <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Birth
                </label>
                <input
                    type="date"
                    id="dateOfBirth"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
            </div>
            <div className="mb-6">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                </label>
                <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    placeholder='Enter your address'
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
            </div>
            <div className="flex space-x-4">
                <button
                    type="button"
                    onClick={handlePrevStep}
                    className="bg-gray-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-600 transition-colors w-1/2"
                >
                    Previous
                </button>
                <button
                    type="submit"
                    className="button-primary font-medium w-1/2"
                >
                    {isLoading ? <CircularProgress color="inherit" size={24} /> : 'Create Account'}
                </button>
            </div>
        </div>
    );
};

export default PersonalInfoStep;
