import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom';

import AddOutlinedIcon from '@mui/icons-material/AddOutlined';

import LessonsGrid from '@/components/layout/LessonsGrid';
import CircularProgress from '@mui/material/CircularProgress';

import SearchBar from '@/components/common/SearchBar';
import type { Lesson, Statistic } from '@/interfaces/userProfile';
import { retrieveLessons, calculateStatistics } from '@/services/userService';
import { verifyUser } from '@/services/authService';

const MyLessonsPage = () => {
    const { userId } = useParams();

    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [lessonOrder, setLessonOrder] = useState<"newest" | "oldest">("newest");
    const [isAuthor, setIsAuthor] = useState<boolean>(false);
    const [range, setRange] = useState<{ from: number; to: number }>({ from: 0, to: 9 });
    const [statistics, setStatistics] = useState<Statistic | null>(null);

    const navigate = useNavigate();

    useEffect(() => {
        if (!userId) {
            return;
        }

        const retrieveData = async () => {
            try {
                await verifyUser();
                setIsAuthor(true);
            } catch (error) {
                console.error("Error verifying user:", error);
            }

            const stats = await calculateStatistics(userId);
            setStatistics(stats);
        };

        retrieveData();
    }, [userId]);

    useEffect(() => {
        const retrieveData = async () => {
            if (!userId) {
                console.error('User ID is undefined');
                return;
            }

            const data = await retrieveLessons(userId, lessonOrder, range);
            console.log('Retrieved lessons:', data);
            setLessons(data);
        }

        retrieveData();

    }, [range, lessonOrder]);

    return (
        <div className='p-12 min-h-screen overflow-y-auto scrollbar-hide h-[100vh] pb-36'>
            <h1 className='text-header-large mb-4'>All Lessons</h1>
            <div className='flex gap-2 justify-end'>
                <SearchBar className=''/>
                <button className='button-primary py-2 px-4' onClick={() => navigate('/create-lesson')}>
                    <AddOutlinedIcon className='relative -top-[2px]'/>
                    <span className='ml-2'>Create lesson</span>
                </button>
            </div>

            <div className='rounded-2xl bg-primary overflow-hidden px-10 py-6 mt-4 shadow-xl'>
                <div className='flex justify-between'>
                    <h1 className='text-header-medium'>{`${userId}'s lessons`}</h1>
                    <div className="flex justify-evenly p-1 bg-zinc-100 rounded-2xl">
                        <button
                            className={`px-4 py-2 rounded-2xl cursor-pointer ${
                                lessonOrder === "newest"
                                    ? "bg-white"
                                    : "text-zinc-800"
                            }`}
                            onClick={() => {setLessonOrder("newest"); setLessons([])}}
                        >
                            Newest
                        </button>
                        <button
                            className={`px-4 py-2 rounded-2xl cursor-pointer ${
                                lessonOrder === "oldest"
                                    ? "bg-white"
                                    : "text-zinc-800"
                            }`}
                            onClick={() => {setLessonOrder("oldest"); setLessons([])}}
                        >
                            Oldest
                        </button>
                    </div>
                </div>
                { lessons.length === 0 ?
                    <div className='flex justify-center items-center flex-col mt-10 text-gray-600'>
                        <CircularProgress sx={{color: '#9f9fa9'}} size='30px'/>
                        <h1 className='mt-2 text-lg'>Fetching lessons...</h1>
                    </div> : <LessonsGrid lessons={lessons}/>
                }
                <div className="flex justify-center items-center mt-10">
                    <div>
                        <p className="text-sm text-gray-600 mr-6">
                            Page {range.from / 10 + 1} / {Math.ceil((statistics?.total_materials ?? 0) / 10)}
                        </p>
                    </div>
                    <button
                        className="button-outline px-4 py-2 rounded-2xl mr-2"
                        onClick={() => setRange(prev => ({ from: Math.max(prev.from - 10, 0), to: Math.max(prev.to - 10, 9) }))}
                        disabled={range.from === 0}
                    >
                        Previous
                    </button>
                    <button
                        className="button-outline px-4 py-2 rounded-2xl"
                        onClick={() => setRange(prev => ({ from: prev.from + 10, to: Math.min(prev.to + 10, statistics?.total_materials ?? 9) }))}
                        disabled={range.to >= (statistics?.total_materials ?? 9)}
                    >
                        Next
                    </button>
                </div>                
            </div>
        </div>
    )
}

export default MyLessonsPage