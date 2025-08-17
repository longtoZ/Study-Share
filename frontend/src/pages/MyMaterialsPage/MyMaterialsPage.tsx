import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Material } from '@/interfaces/userProfile';
import type { Subject } from '@/interfaces/table';

import { retrieveMaterials, retrieveAllSubjects } from '@/services/userService';
import { verifyUser } from '@services/authService';

import SearchBar from '@/components/common/SearchBar';

import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import MaterialsGrid from '@/components/layout/MaterialsGrid';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';

const MyMaterialsPage = () => {
    const { userId } = useParams();

    const [materials, setMaterials] = useState<Material[]>([]);
    const [materialOrder, setMaterialOrder] = useState<"newest" | "oldest">("newest");
    const [isAuthor, setIsAuthor] = useState<boolean>(false);

    const navigate = useNavigate();

    useEffect(() => {
        const retrieveData = async () => {
            if (!userId) {
                console.error('User ID is undefined');
                return;
            }

            const subjects = await retrieveAllSubjects();
            const data = await retrieveMaterials(userId, subjects, materialOrder);
            console.log('Retrieved materials:', data);
            setMaterials(data);

            try {
                await verifyUser();
                setIsAuthor(true);
            } catch (error) {
                console.error("Error verifying user:", error);
            }
        }

        retrieveData();

    }, [userId, materialOrder]);

    return (
        <div className='p-12 min-h-screen'>
            <h1 className='text-header-large mb-4'>All Materials</h1>
            <div className='flex gap-2 justify-end'>
                <SearchBar className=''/>
                <button className='button-primary py-2 px-4' onClick={() => navigate('/upload')}>
                    <AddOutlinedIcon className='relative -top-[2px]'/>
                    <span className='ml-2'>Upload material</span>
                </button>
            </div>

            <div className='rounded-2xl bg-primary overflow-hidden px-10 py-6 mt-4 shadow-xl'>
                <div className='flex justify-between'>
                    <h1 className='text-header-medium'>{`${userId}'s materials`}</h1>
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
                <MaterialsGrid materials={materials}/>
            </div>
        </div>
    )
}

export default MyMaterialsPage