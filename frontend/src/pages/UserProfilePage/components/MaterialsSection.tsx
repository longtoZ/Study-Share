import MaterialsGrid from '@/components/layout/MaterialsGrid';
import CircularProgress from '@mui/material/CircularProgress';
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';

interface MaterialsSectionProps {
    userId: string;
    materials: any[];
    isMaterialsLoading: boolean;
    navigate: (path: string) => void;
}

const MaterialsSection = ({ userId, materials, isMaterialsLoading, navigate }: MaterialsSectionProps) => {
    return (
        <div className='rounded-3xl bg-primary overflow-hidden card-shadow px-10 py-6 mt-10'>
            <h1 className='text-header-medium'>My Materials</h1>
            <p className='mt-2 text-gray-600'>Here are some of the materials I have created:</p>
            { isMaterialsLoading ?
                <div className='flex justify-center items-center flex-col mt-10 text-gray-600'>
                    <CircularProgress sx={{color: '#9f9fa9'}} size='30px'/>
                    <h1 className='mt-2 text-lg'>Fetching materials...</h1>
                </div> : !materials || materials.length === 0 ? (
                    <div className='flex justify-center items-center flex-col mt-10 text-gray-600'>
                        <h1 className='mt-2 text-lg'>No materials found.</h1>
                    </div>
                ) : <MaterialsGrid materials={materials} />
            }

            <div>
                <button className='button-outline w-full px-6 py-2 rounded-md mt-10 flex items-center justify-center' onClick={() => {navigate(`/user/${userId}/materials`)}}>
                    Show More
                    <ArrowForwardIosOutlinedIcon className='ml-1' style={{fontSize: '1.2rem'}}/>
                </button>
            </div>
        </div>
    )
}

export default MaterialsSection