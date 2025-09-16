import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { MaterialExtended, Statistic } from '@/interfaces/userProfile.d';

import { retrieveMaterials, calculateStatistics } from '@/services/userService';
import { verifyUser } from '@services/authService';

import { storeMaterials } from '@/utils/storeMaterialsLessons';

import SearchBar from '@/components/common/SearchBar';

import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import MaterialsGrid from '@/components/layout/MaterialsGrid';
import CircularProgress from '@mui/material/CircularProgress';

const MyMaterialsPage = () => {
    const { userId } = useParams();

    const [materials, setMaterials] = useState<MaterialExtended[]>([]);
    const [materialOrder, setMaterialOrder] = useState<"newest" | "oldest">("newest");
    const [isAuthor, setIsAuthor] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [range, setRange] = useState<{ from: number; to: number }>({ from: 0, to: 9 });
    const [statistics, setStatistics] = useState<Statistic | null>(null);

    const navigate = useNavigate();

    useEffect(() => {
        if (!userId) {
            return;
        }

        const retrieveData = async () => {
            try {
                await verifyUser(userId);
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

            setIsLoading(true);
            const data = await retrieveMaterials(userId, materialOrder, range);
            console.log('Retrieved materials:', data);
            setMaterials(data);
            storeMaterials(data);
            setIsLoading(false);
        }

        retrieveData();

    }, [range, materialOrder]);

    return (
        <div className='p-12 min-h-screen overflow-y-auto scrollbar-hide h-[100vh] pb-36 bg-gradient-to-tr from-sky-50 to-white'>
            <h1 className='text-header-large mb-4'>All Materials</h1>
            <div className='flex gap-2 justify-end'>
                <SearchBar className=''/>
                { isAuthor && 
                    <button className='button-primary py-2 px-4' onClick={() => navigate('/upload')}>
                        <AddOutlinedIcon className='relative -top-[2px]'/>
                        <span className='ml-2'>Upload material</span>
                    </button>
                }
            </div>

            <div className='rounded-3xl bg-primary overflow-hidden px-10 py-6 mt-4 card-shadow'>
                <div className='flex justify-between'>
                    <h1 className='text-header-medium'><span className='text-gradient'>{materials[0]?.user_name}</span>{`'s materials`}</h1>
                    <div className="flex justify-evenly gap-2 p-1 bg-zinc-100 rounded-2xl cursor-pointer inset-shadow-sm">
                        <button
                            className={`px-4 py-2 rounded-2xl ${
                                materialOrder === "newest"
                                    ? "bg-white shadow-sm"
                                    : "text-zinc-800"
                            }`}
                            onClick={() => {setMaterialOrder("newest"); setMaterials([])}}
                        >
                            Newest
                        </button>
                        <button
                            className={`px-4 py-2 rounded-2xl ${
                                materialOrder === "oldest"
                                    ? "bg-white shadow-sm"
                                    : "text-zinc-800"
                            }`}
                            onClick={() => {setMaterialOrder("oldest"); setMaterials([])}}
                        >
                            Oldest
                        </button>
                    </div>
                </div>
                { isLoading ?
                    <div className='flex justify-center items-center flex-col mt-10 text-gray-600'>
                        <CircularProgress sx={{color: '#9f9fa9'}} size='30px'/>
                        <h1 className='mt-2 text-lg'>Fetching materials...</h1>
                    </div> : <MaterialsGrid materials={materials}/>
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

export default MyMaterialsPage