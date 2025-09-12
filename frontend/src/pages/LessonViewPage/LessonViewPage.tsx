import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { MaterialExtended } from '@/interfaces/userProfile';
import type { History } from '@/interfaces/table';

import { retrieveAllMaterials } from '@/services/lessonService';
import { retrieveAllSubjects } from '@/services/userService';
import { verifyUser } from '@services/authService';
import { addEntry } from '@/services/historyService';
import { v4 as uuidv4 } from 'uuid';

import SearchBar from '@/components/common/SearchBar';

import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import MaterialsGrid from '@/components/layout/MaterialsGrid';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import CircularProgress from '@mui/material/CircularProgress';

const LessonViewPage = () => {
    const { lessonId } = useParams();

    const [materials, setMaterials] = useState<MaterialExtended[]>([]);
    const [materialOrder, setMaterialOrder] = useState<"newest" | "oldest">("newest");
    const [isAuthor, setIsAuthor] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [lessonName, setLessonName] = useState<string>('');

    const navigate = useNavigate();

    const userId = localStorage.getItem('user_id') || '';

    useEffect(() => {
        const retrieveData = async () => {
            if (!lessonId) {
				console.error('User ID is undefined');
				return;
            }

            setIsLoading(true);
            const data = await retrieveAllMaterials(lessonId, materialOrder);
            console.log('Retrieved materials:', data!.materials);
            setMaterials(data!.materials);
            setLessonName(data!.lessonName || '');
            setIsLoading(false);

            try {
                await verifyUser(data!.authorId);
                setIsAuthor(true);
            } catch (error) {
                console.error("Error verifying user:", error);
            }

            const historyEntry: History = {
                history_id: `${userId}-${uuidv4()}`,
                user_id: userId,
                material_id: null,
                lesson_id: lessonId,
                type: 'lessons',
                viewed_date: new Date(),
            };

            await addEntry(historyEntry);
        }

        retrieveData();

    }, [lessonId, materialOrder]);

    return (
        <div className='p-12 min-h-screen overflow-y-auto scrollbar-hide h-[100vh] pb-36'>
            <h1 className='text-header-large mb-4'>All Materials</h1>
            {isAuthor && (
                <div className="mb-6 flex justify-end">
                    <button 
                        className="flex items-center gap-2 rounded-xl py-3 px-4 cursor-pointer bg-gradient-to-r from-yellow-500 to-amber-500 text-white shadow-lg shadow-amber-300 hover:opacity-85 transition-opacity duration-100 ease"
                        onClick={() => navigate(`/lesson/${lessonId}/edit`)}>
                        <SettingsOutlinedIcon/>
                        <h3>Edit Lesson</h3>
                    </button>
                </div>
            )}
            <div className='flex gap-2 justify-end'>
                <SearchBar className=''/>
                <button className='button-primary py-2 px-4' onClick={() => navigate('/create-lesson')}>
                    <AddOutlinedIcon className='relative -top-[2px]'/>
                    <span className='ml-2'>Create lesson</span>
                </button>
            </div>

            <div className='rounded-2xl bg-primary overflow-hidden px-10 py-6 mt-4 shadow-xl'>
                <div className='flex justify-between'>
                    <h1 className='text-header-medium'><span className='text-gradient'>{lessonName}</span>{`'s materials`}</h1>
                    <div className="flex justify-evenly p-1 bg-zinc-100 rounded-2xl">
                        <button
                            className={`px-4 py-2 rounded-2xl cursor-pointer ${
                                materialOrder === "newest"
                                    ? "bg-white"
                                    : "text-zinc-800"
                            }`}
                            onClick={() => setMaterialOrder("newest")}
                        >
                            Newest
                        </button>
                        <button
                            className={`px-4 py-2 rounded-2xl cursor-pointer ${
                                materialOrder === "oldest"
                                    ? "bg-white"
                                    : "text-zinc-800"
                            }`}
                            onClick={() => setMaterialOrder("oldest")}
                        >
                            Oldest
                        </button>
                    </div>
                </div>
                { isLoading && 
                    <div className='flex justify-center items-center flex-col mt-10 text-gray-600'>
                        <CircularProgress sx={{color: '#9f9fa9'}} size='30px'/>
                        <h1 className='mt-2 text-lg'>Loading materials...</h1>
                    </div> 
                }
                { !isLoading && materials.length == 0 ?
                    <h1 className='flex justify-center items-center flex-col mt-10 text-gray-600'>No materials found.</h1> :
                    <MaterialsGrid materials={materials}/>
                }
            </div>
        </div>
    )
}

export default LessonViewPage