import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactLogo from '@assets/react.svg';

import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';

import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import SearchIcon from '@mui/icons-material/Search';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import LeaderboardOutlinedIcon from '@mui/icons-material/LeaderboardOutlined';

import RestoreOutlinedIcon from '@mui/icons-material/RestoreOutlined';
import BookmarkAddOutlinedIcon from '@mui/icons-material/BookmarkAddOutlined';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import FolderCopyOutlinedIcon from '@mui/icons-material/FolderCopyOutlined';

import ShoppingCartCheckoutOutlinedIcon from '@mui/icons-material/ShoppingCartCheckoutOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';

import KeyboardDoubleArrowLeftOutlinedIcon from '@mui/icons-material/KeyboardDoubleArrowLeftOutlined';

const SideBar = ({ isMinimized, onToggleMinimize } : { isMinimized: boolean, onToggleMinimize: (isMinimized: boolean) => void}) => {
    const navigate = useNavigate();
    const userId = localStorage.getItem('user_id') || '';

    const handleMinimize = () => {
        onToggleMinimize(!isMinimized);
    }

    return (
        <div className="fixed top-4" style={{width: 'inherit'}}>
            <div className={`relative h-[95vh] text-white ${ isMinimized ? 'p-2' : 'p-4'} overflow-y-scroll scrollbar-hide`}>
                <div className="flex items-center gap-2">
                    <img src={ReactLogo} alt="React Logo" className="w-12 h-12" />
                    { !isMinimized && <h1 className="text-xl font-bold text-primary">StudyShare</h1> }
                </div>

                <button className='mt-6 w-full button-primary text-sm font-semibold py-3 px-4 flex items-center justify-center gap-2 shadow-[0_5px_10px_10px_rgba(67,45,215,0.2)] hover:shadow-[0_5px_10px_10px_rgba(67,45,215,0.4)] hover:scale-101 outline-transparent' style={{borderRadius:'calc(infinity * 1px)'}} onClick={() => {
                    navigate('/upload');
                }}>
                    { isMinimized ? <CloudUploadOutlinedIcon className="text-white" style={{fontSize: '1.4rem'}} /> : <span>Upload New</span> }
                </button>
                <div className='border-t border-primary mt-4 pt-4'></div>
                { !isMinimized && <h2 className="mb-2 text-secondary text-sm">Menu</h2> }
                <ul>
                    <li>
                        <div className={`p-2 ${ isMinimized ? 'py-3' : ''} text-zinc-400 hover:bg-[#ffffff32] hover:text-white hover:font-semibold transition-all ease-in-out duration-200 rounded-xl cursor-pointer ${ isMinimized ? 'justify-center' : ''} flex gap-2`} onClick={() => navigate('/')}>
                            <HomeOutlinedIcon className="icon-primary" style={{fontSize: `${ isMinimized ? '1.6rem' : '1.4rem'}`, color: 'inherit'}}/>
                            { !isMinimized && <span className="leading-[1.5]">Home</span> }
                        </div>
                        <div className={`p-2 ${ isMinimized ? 'py-3' : ''} text-zinc-400 hover:bg-[#ffffff32] hover:text-white hover:font-semibold transition-all ease-in-out duration-200 rounded-xl cursor-pointer ${ isMinimized ? 'justify-center' : ''} flex gap-2`} onClick={() => navigate('/search')}>
                            <SearchIcon className="icon-primary" style={{fontSize: `${ isMinimized ? '1.6rem' : '1.4rem'}`, color: 'inherit'}}/>
                            { !isMinimized && <span className="leading-[1.5]">Search</span> }
                        </div>
                        <div className={`p-2 ${ isMinimized ? 'py-3' : ''} text-zinc-400 hover:bg-[#ffffff32] hover:text-white hover:font-semibold transition-all ease-in-out duration-200 rounded-xl cursor-pointer ${ isMinimized ? 'justify-center' : ''} flex gap-2`} onClick={() => navigate('/ai-chat')}>
                            <AutoAwesomeOutlinedIcon className="icon-primary" style={{fontSize: `${ isMinimized ? '1.6rem' : '1.3rem'}`, color: 'inherit'}}/>
                            { !isMinimized && <span className="leading-[1.5]">AI Chat</span> }
                        </div>
                        <div className={`p-2 ${ isMinimized ? 'py-3' : ''} text-zinc-400 hover:bg-[#ffffff32] hover:text-white hover:font-semibold transition-all ease-in-out duration-200 rounded-xl cursor-pointer ${ isMinimized ? 'justify-center' : ''} flex gap-2`} onClick={() => navigate('/statistics')}>
                            <LeaderboardOutlinedIcon className="icon-primary" style={{fontSize: `${ isMinimized ? '1.6rem' : '1.3rem'}`, color: 'inherit'}}/>
                            { !isMinimized && <span className="leading-[1.5]">Statistics</span> }
                        </div>
                    </li>
                </ul>

                <div className='border-t border-primary mt-8 pt-4'></div>
                { !isMinimized && <h2 className="mb-2 text-secondary text-sm">Library</h2> }
                <ul>
                    <li>
                        <div className={`p-2 ${ isMinimized ? 'py-3' : ''} text-zinc-400 hover:bg-[#ffffff32] hover:text-white hover:font-semibold transition-all ease-in-out duration-200 rounded-xl cursor-pointer ${ isMinimized ? 'justify-center' : ''} flex gap-2`} onClick={() => navigate('/history')}>
                            <RestoreOutlinedIcon className="icon-primary" style={{fontSize: `${ isMinimized ? '1.6rem' : '1.3rem'}`, color: 'inherit'}}/>
                            { !isMinimized && <span className="leading-[1.5]">Recently Viewed</span> }
                        </div>
                        <div className={`p-2 ${ isMinimized ? 'py-3' : ''} text-zinc-400 hover:bg-[#ffffff32] hover:text-white hover:font-semibold transition-all ease-in-out duration-200 rounded-xl cursor-pointer ${ isMinimized ? 'justify-center' : ''} flex gap-2`} onClick={() => navigate('/bookmarks')}>
                            <BookmarkAddOutlinedIcon className="icon-primary" style={{fontSize: `${ isMinimized ? '1.6rem' : '1.3rem'}`, color: 'inherit'}}/>
                            { !isMinimized && <span className="leading-[1.5]">My Bookmarks</span> }
                        </div>
                        <div className={`p-2 ${ isMinimized ? 'py-3' : ''} text-zinc-400 hover:bg-[#ffffff32] hover:text-white hover:font-semibold transition-all ease-in-out duration-200 rounded-xl cursor-pointer ${ isMinimized ? 'justify-center' : ''} flex gap-2`} onClick={() => navigate(`/user/${userId}/materials`)}>
                            <ArticleOutlinedIcon className="icon-primary" style={{fontSize: `${ isMinimized ? '1.6rem' : '1.3rem'}`, color: 'inherit'}}/>
                            { !isMinimized && <span className="leading-[1.5]">My Materials</span> }
                        </div>
                        <div className={`p-2 ${ isMinimized ? 'py-3' : ''} text-zinc-400 hover:bg-[#ffffff32] hover:text-white hover:font-semibold transition-all ease-in-out duration-200 rounded-xl cursor-pointer ${ isMinimized ? 'justify-center' : ''} flex gap-2`} onClick={() => navigate(`/user/${userId}/lessons`)}>
                            <FolderCopyOutlinedIcon className="icon-primary" style={{fontSize: `${ isMinimized ? '1.6rem' : '1.3rem'}`, color: 'inherit'}}/>
                            { !isMinimized && <span className="leading-[1.5]">My Lessons</span> }
                        </div>
                    </li>
                </ul>

                <div className='border-t border-primary mt-8 pt-4'></div>
                { !isMinimized && <h2 className="mb-2 text-secondary text-sm">Account</h2> }
                <ul>
                    <li>
                        <div className={`p-2 ${ isMinimized ? 'py-3' : ''} text-zinc-400 hover:bg-[#ffffff32] hover:text-white hover:font-semibold transition-all ease-in-out duration-200 rounded-xl cursor-pointer ${ isMinimized ? 'justify-center' : ''} flex gap-2`}>
                            <ShoppingCartCheckoutOutlinedIcon className="icon-primary" style={{fontSize: `${ isMinimized ? '1.6rem' : '1.3rem'}`, color: 'inherit'}}/>
                            { !isMinimized && <span className="leading-[1.5]">Purchased Materials</span> }
                        </div>
                        <div className={`p-2 ${ isMinimized ? 'py-3' : ''} text-zinc-400 hover:bg-[#ffffff32] hover:text-white hover:font-semibold transition-all ease-in-out duration-200 rounded-xl cursor-pointer ${ isMinimized ? 'justify-center' : ''} flex gap-2`} onClick={() => navigate('/account-settings')}>
                            <SettingsOutlinedIcon className="icon-primary" style={{fontSize: `${ isMinimized ? '1.6rem' : '1.3rem'}`, color: 'inherit'}}/>
                            { !isMinimized && <span className="leading-[1.5]">Settings</span> }
                        </div>
                    </li>
                </ul>
            </div>

            <div className={`absolute  ${ isMinimized ? 'left-3 -bottom-3' : 'right-0 bottom-9'} z-50 transition-all duration-300 ease-in-out`}>
                <div className="w-10 h-10 p-2 bg-zinc-700 text-zinc-200 hover:bg-zinc-600 hover:text-white hover:font-semibold transition-all ease-in-out duration-200 rounded-full cursor-pointer flex justify-center items-center" onClick={handleMinimize}>
                    <KeyboardDoubleArrowLeftOutlinedIcon className="icon-primary transition-all duration-300 ease-in-out" style={{fontSize: '1.3rem', color: 'inherit', transform: isMinimized ? 'rotate(180deg)' : 'none'}}/>
                </div>
            </div>
        </div>
    )
}

export default SideBar