import { useState } from "react";
import ReactLogo from '@assets/react.svg';
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

import SwitchLeftRoundedIcon from '@mui/icons-material/SwitchLeftRounded';

import ProfileImage from '@assets/images/profile.png';

const SideBar = () => {
    return (
        <div className="fixed top-0 left-0" style={{width: 'inherit'}}>
            <div className="relative h-[100vh] bg-primary p-4 border-r border-primary overflow-y-scroll pb-20">
                <div className="flex items-center gap-2">
                    <img src={ReactLogo} alt="React Logo" className="w-12 h-12" />
                    <h1 className="text-xl font-bold text-primary">StudyShare</h1>
                </div>

                <div className='border-t border-primary mt-8 pt-4'></div>
                <h2 className="mb-2 text-secondary text-sm">Menu</h2>
                <ul className="space-y-2">
                    <li>
                        <div className="p-2 hover:button-transparent transition-all ease-in-out duration-200 rounded-md cursor-pointer flex gap-2">
                            <HomeOutlinedIcon className="icon-primary" style={{fontSize: '1.4rem'}}/>
                            <span className="leading-[1.5]">Home</span>
                        </div>
                        <div className="p-2 hover:button-transparent transition-all ease-in-out duration-200 rounded-md cursor-pointer flex gap-2">
                            <SearchIcon className="icon-primary" style={{fontSize: '1.4rem'}}/>
                            <span className="leading-[1.5]">Search</span>
                        </div>
                        <div className="p-2 hover:button-transparent transition-all ease-in-out duration-200 rounded-md cursor-pointer flex gap-2">
                            <AutoAwesomeOutlinedIcon className="icon-primary" style={{fontSize: '1.3rem'}}/>
                            <span className="leading-[1.5]">AI Chat</span>
                        </div>
                        <div className="p-2 hover:button-transparent transition-all ease-in-out duration-200 rounded-md cursor-pointer flex gap-2">
                            <LeaderboardOutlinedIcon className="icon-primary" style={{fontSize: '1.3rem'}}/>
                            <span className="leading-[1.5]">Leaderboard</span>
                        </div>
                    </li>
                </ul>

                <div className='border-t border-primary mt-8 pt-4'></div>
                <h2 className="mb-2 text-secondary text-sm">Library</h2>
                <ul className="space-y-2">
                    <li>
                        <div className="p-2 hover:button-transparent transition-all ease-in-out duration-200 rounded-md cursor-pointer flex gap-2">
                            <RestoreOutlinedIcon className="icon-primary" style={{fontSize: '1.3rem'}}/>
                            <span className="leading-[1.5]">Recently Viewed</span>
                        </div>
                        <div className="p-2 hover:button-transparent transition-all ease-in-out duration-200 rounded-md cursor-pointer flex gap-2">
                            <BookmarkAddOutlinedIcon className="icon-primary" style={{fontSize: '1.3rem'}}/>
                            <span className="leading-[1.5]">My Bookmarks</span>
                        </div>
                        <div className="p-2 hover:button-transparent transition-all ease-in-out duration-200 rounded-md cursor-pointer flex gap-2">
                            <ArticleOutlinedIcon className="icon-primary" style={{fontSize: '1.3rem'}}/>
                            <span className="leading-[1.5]">My Documents</span>
                        </div>
                        <div className="p-2 hover:button-transparent transition-all ease-in-out duration-200 rounded-md cursor-pointer flex gap-2">
                            <FolderCopyOutlinedIcon className="icon-primary" style={{fontSize: '1.3rem'}}/>
                            <span className="leading-[1.5]">My Lessons</span>
                        </div>
                    </li>
                </ul>

                <div className='border-t border-primary mt-8 pt-4'></div>
                <h2 className="mb-2 text-secondary text-sm">Account</h2>
                <ul className="space-y-2">
                    <li>
                        <div className="p-2 hover:button-transparent transition-all ease-in-out duration-200 rounded-md cursor-pointer flex gap-2">
                            <ShoppingCartCheckoutOutlinedIcon className="icon-primary" style={{fontSize: '1.3rem'}}/>
                            <span className="leading-[1.5]">Purchased Materials</span>
                        </div>
                        <div className="p-2 hover:button-transparent transition-all ease-in-out duration-200 rounded-md cursor-pointer flex gap-2">
                            <SettingsOutlinedIcon className="icon-primary" style={{fontSize: '1.3rem'}}/>
                            <span className="leading-[1.5]">Settings</span>
                        </div>
                    </li>
                </ul>
            </div>
            <div className="sticky bottom-0 left-0 w-full p-4 bg-primary border-t border-primary flex items-center border-r border-primary">
                <div>
                    <img src={ProfileImage} alt="profile.png" className="w-10 h-10 rounded-[50%] object-cover"/>
                </div>
                <div className="ml-2">
                    <span className="text-sm font-semibold">User Name</span>
                    <p className="text-xs text-zinc-500">Free Tier</p>
                </div>
                <div className="flex items-center ml-auto">
                    <SwitchLeftRoundedIcon className="icon-primary ml-auto-md cursor-pointer" />
                </div>
            </div>
        </div>
    )
}

export default SideBar