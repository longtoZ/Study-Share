import LessonsGrid from '@/components/layout/LessonsGrid';

import CircularProgress from '@mui/material/CircularProgress';
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';

interface LessonsSectionProps {
    userId: string;
    lessons: any[];
    isLessonsLoading: boolean;
    navigate: (path: string) => void;
}

const LessonsSection = ({ userId, lessons, isLessonsLoading, navigate }: LessonsSectionProps) => {
    return (
        <div className='rounded-3xl bg-primary overflow-hidden card-shadow px-10 py-6 mt-10'>
            <h1 className='text-header-medium'>My Lessons</h1>
            <p className='mt-2 text-gray-600'>Here are some of the lessons I have created:</p>
            { isLessonsLoading ?
                <div className='flex justify-center items-center flex-col mt-10 text-gray-600'>
                    <CircularProgress sx={{color: '#9f9fa9'}} size='30px'/>
                    <h1 className='mt-2 text-lg'>Fetching lessons...</h1>
                </div> : lessons.length === 0 ? (
                    <div className='flex justify-center items-center flex-col mt-10 text-gray-600'>
                        <h1 className='mt-2 text-lg'>No lessons found.</h1>
                    </div>
                ) : <LessonsGrid lessons={lessons}/>
            }

            <div>
                <button className='button-outline w-full px-6 py-2 rounded-md mt-10 flex items-center justify-center' onClick={() => {navigate(`/user/${userId}/lessons`)}}>
                    Show More
                    <ArrowForwardIosOutlinedIcon className='ml-1' style={{fontSize: '1.2rem'}}/>
                </button>
            </div>
        </div>
    )
}

export default LessonsSection