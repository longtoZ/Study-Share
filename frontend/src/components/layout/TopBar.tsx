import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '@/redux/userSlice';

import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import WbSunnyOutlinedIcon from '@mui/icons-material/WbSunnyOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';

import ProfileImage from '@assets/images/profile.png';

interface TopBarProps {
    isDarkMode: boolean;
    onToggleDarkMode: () => void;
}

const ACTION_VIEW_PROFILE = 'view-profile';
const ACTION_SWITCH_ACCOUNT = 'switch-account';
const ACTION_LOGOUT = 'logout';

const TopBar: React.FC<TopBarProps> = ({ isDarkMode, onToggleDarkMode }) => {
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleProfileClick = () => {
        setIsProfileMenuOpen(!isProfileMenuOpen);
    };

    const handleMenuItemClick = (action: string) => {
        setIsProfileMenuOpen(false);
        
        if (action == ACTION_LOGOUT) {
            dispatch(logout());
            navigate('/login');
        }
    };

    return (
        <div className="w-full bg-[#e7e3e475] backdrop-blur-md sticky top-0 px-12 py-3 z-50">
            <div className="flex items-center justify-between max-w-7xl mx-auto">
                <div className="flex-1 max-w-md">
                    <div className="relative">
                        <SearchOutlinedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 icon-primary" />
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-xl focus:outline-none bg-primary"
                        />
                    </div>
                </div>

                <div className="flex items-center space-x-4">
                    <div
                        onClick={onToggleDarkMode}
                        className="p-2 rounded-xl hover:bg-zinc-300 transition-colors curosr-pointer"
                    >
                        {isDarkMode ? (
                            <WbSunnyOutlinedIcon className="w-5 h-5 icon-primary" />
                        ) : (
                            <DarkModeOutlinedIcon className="w-5 h-5 icon-primary" />
                        )}
                    </div>

                    {/* Notification button */}
                    <div className="p-2 rounded-lg hover:bg-zinc-300 transition-colors relative">
                        <NotificationsOutlinedIcon className="w-5 h-5 icon-primary" />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                    </div>

                    {/* Profile dropdown */}
                    <div className="relative">
                        <div
                            onClick={handleProfileClick}
                            className="w-8 h-8 rounded-full hover:ring-2 hover:border-primary transition-all overflow-hidden"
                        >
                            <img
                                src={ProfileImage}
                                alt="Profile"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                                }}
                            />
                        </div>

                        {/* Profile dropdown menu */}
                        {isProfileMenuOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-primary rounded-lg shadow-lg py-1 z-50">
                                <button
                                    onClick={() => handleMenuItemClick(ACTION_VIEW_PROFILE)}
                                    className="w-full px-4 py-2 text-left hover:button-transparent flex items-center space-x-2"
                                >
                                    <span>View Main Profile</span>
                                </button>
                                <button
                                    onClick={() => handleMenuItemClick(ACTION_SWITCH_ACCOUNT)}
                                    className="w-full px-4 py-2 text-left hover:button-transparent flex items-center space-x-2"
                                >
                                    <span>Switch Account</span>
                                </button>
                                <hr className="my-1 border-gray-200 dark:border-gray-600" />
                                <button
                                    onClick={() => handleMenuItemClick(ACTION_LOGOUT)}
                                    className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-100 flex items-center space-x-2"
                                >
                                    <span>Logout</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Click outside to close dropdown */}
            {isProfileMenuOpen && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsProfileMenuOpen(false)}
                />
            )}
        </div>
    );
};

export default TopBar;