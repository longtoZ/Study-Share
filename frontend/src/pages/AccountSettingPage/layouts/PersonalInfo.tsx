import { useState, useEffect } from 'react'
import { retrieveUserData, updateUserProfile } from '@/services/userService';
import type { User } from '@/interfaces/table.d';

import ImageUpload from '../components/ImageUpload';

import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';

const PersonalInfo = () => {
    const [personalInfo, setPersonalInfo] = useState<User>({
        user_id: '',
        full_name: '',
        email: '',
        gender: '',
        date_of_birth: new Date(),
        bio: '',
        profile_picture_url: '',
        background_image_url: '',
        address: '',
        stripe_account_id: null,
    });

    const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);
    const [backgroundImageFile, setBackgroundImageFile] = useState<File | null>(null);

    const [profilePicture, setProfilePicture] = useState<string | null>(null);
    const [backgroundImage, setBackgroundImage] = useState<string | null>(null);

    const userId = localStorage.getItem('user_id') || '';

    const handleInputChange = (field: keyof User, value: string) => {
        setPersonalInfo(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSave = async () => {
        const updates = new FormData();
        updates.append('metadata', JSON.stringify(personalInfo));
        if (profilePictureFile) {
            updates.append('profile_picture_file', profilePictureFile);
        }
        if (backgroundImageFile) {
            updates.append('background_image_file', backgroundImageFile);
        }
        const result = await updateUserProfile(userId, updates);
        console.log('Profile updated:', result);
    };

    useEffect(() => {
        const fetchData = async () => {
            const data = await retrieveUserData(userId, true);
            setPersonalInfo({
                user_id: data.user_id || '',
                full_name: data.full_name || '',
                email: data.email || '',
                gender: data.gender || '',
                date_of_birth: new Date(data.date_of_birth) || new Date(),
                bio: data.bio || '',
                profile_picture_url: data.profile_picture_url || '',
                background_image_url: data.background_image_url || '',
                address: data.address || '',
                stripe_account_id: data.stripe_account_id || null,
            });

            if (data.profile_picture_url) {
                setProfilePicture(data.profile_picture_url);
            }

            if (data.background_image_url) {
                setBackgroundImage(data.background_image_url);
            }
        };

        fetchData();
    }, []);

    const handleProfilePictureChange = (e: any) => {
        const file = e.target.files[0];
        if (file) {
            setProfilePicture(URL.createObjectURL(file));
            setProfilePictureFile(file);
        }
    }   

    const handleBackgroundImageChange = (e: any) => {
        const file = e.target.files[0];
        if (file) {
            setBackgroundImage(URL.createObjectURL(file));
            setBackgroundImageFile(file);
        }
    };

    return (
        <div className="py-6 px-8">
            <h2 className="text-xl font-semibold mb-6">Personal Information</h2>
            <div className='border-b border-zinc-300 my-6'></div>
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm text-gray-700 mb-1 font-semibold">
                            Username
                        </label>
                        <input
                            type="text"
                            value={personalInfo.user_id}
                            onChange={(e) => handleInputChange('user_id', e.target.value)}
                            className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-700 mb-1 font-semibold">
                            Full Name
                        </label>
                        <input
                            type="text"
                            value={personalInfo.full_name}
                            onChange={(e) => handleInputChange('full_name', e.target.value)}
                            className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-700 mb-1 font-semibold">
                            Email
                        </label>
                        <input
                            type="email"
                            value={personalInfo.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-700 mb-1 font-semibold">
                            Gender
                        </label>
                        <select
                            value={personalInfo.gender}
                            onChange={(e) => handleInputChange('gender', e.target.value)}
                            className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm text-gray-700 mb-1 font-semibold">
                            Address
                        </label>
                        <input
                            type="text"
                            value={personalInfo.address}
                            onChange={(e) => handleInputChange('address', e.target.value)}
                            className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-700 mb-1 font-semibold">
                            Date of Birth
                        </label>
                        <input
                            type="date"
                            value={personalInfo.date_of_birth.toISOString().split('T')[0]}
                            onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
                            className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm text-gray-700 mb-1 font-semibold">
                        Bio
                    </label>
                    <textarea
                        rows={4}
                        value={personalInfo.bio}
                        onChange={(e) => handleInputChange('bio', e.target.value)}
                        className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="Tell us about yourself..."
                    />
                </div>

            </div>

            <h2 className="text-xl font-semibold mb-6 mt-20">Profile picture and background</h2>
            <div className='border-b border-zinc-300 my-6'></div>
            <div className='mt-4'>
                <h3 className="block text-lg text-gray-700 mb-1 font-semibold">
                    Profile Picture
                </h3>
                { profilePicture ? (
                    <div className='w-full h-64 border border-zinc-300 rounded-lg relative p-4'>
                        <img
                            src={profilePicture}
                            alt="Profile"
                            className="object-contain w-full h-full"
                            referrerPolicy="no-referrer"
                        />
                        <div className='absolute top-2 right-2 flex justify-evenly'>
                            <button 
                                className='bg-white border border-zinc-300 rounded-lg hover:bg-zinc-100 shadow-sm p-2 flex items-center space-x-1 cursor-pointer'
                                onClick={() => {setProfilePicture(null); setProfilePictureFile(null)}}>
                                <DeleteOutlineOutlinedIcon style={{fontSize: '1.3rem'}} />
                                <span className='text-sm text-gray-700 font-semibold'>Clear</span>
                            </button>
                        </div>
                    </div>
                ) : (
                    <ImageUpload onChange={handleProfilePictureChange} title="Upload your profile picture here"/>
                )}

            </div>
            <div className='mt-8'>
                <h3 className="block text-lg text-gray-700 mb-1 font-semibold">
                    Background Image
                </h3>
                { backgroundImage ? (
                    <div className='w-full h-64 border border-zinc-300 rounded-lg relative p-4'>
                        <img
                            referrerPolicy="no-referrer"
                            src={backgroundImage}
                            alt="Background"
                            className="object-contain w-full h-full"
                        />
                        <div className='absolute top-2 right-2 flex justify-evenly'>
                            <button 
                                className='bg-white border border-zinc-300 rounded-lg hover:bg-zinc-100 shadow-sm p-2 flex items-center space-x-1 cursor-pointer'
                                onClick={() => {setBackgroundImage(null); setBackgroundImageFile(null)}}>
                                <DeleteOutlineOutlinedIcon style={{fontSize: '1.3rem'}} />
                                <span className='text-sm text-gray-700 font-semibold'>Clear</span>
                            </button>
                        </div>
                    </div>
                ) : (
                    <ImageUpload onChange={handleBackgroundImageChange} title="Upload your background image here"/>
                )}
            </div>
            <div className='border-b border-zinc-300 my-6'></div>
            <div className="flex justify-end">
                <button
                    onClick={handleSave}
                    className="button-primary px-4 py-2"
                >
                    Save Changes
                </button>
            </div>
        </div>
    );
}

export default PersonalInfo