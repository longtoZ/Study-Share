import { useNavigate } from 'react-router-dom';
import type { Lesson } from '@/interfaces/userProfile';

import ArticleIcon from '@mui/icons-material/Article';
import FolderRoundedIcon from '@mui/icons-material/FolderRounded';

const LessonsGrid = ({ lessons }: { lessons: Lesson[]}) => {
    const navigate = useNavigate();
    return (
        <div className='grid grid-cols-3 gap-4 mt-4'>
            {lessons.map((_, index) => (
                <div key={index} 
                    className='p-4 my-2 border border-primary rounded-lg cursor-pointer hover:button-transparent'
                    onClick={() => navigate(`/lesson/${lessons[index]?.lesson_id}`)}
                >
                    <h2 className='text-header-medium'>{lessons[index]?.name}</h2>
                    <p className='text-subtitle'>{lessons[index]?.description}</p>
                    <div className='mt-2 flex justify-between items-center'>
                        <div>
                            <span className='text-subtitle-secondary'>
                                <ArticleIcon className='inline-block mr-1' style={{fontSize: '1.2rem'}}/>
                                <span className='relative top-1'>Materials: {lessons[index]?.material_count}</span>
                            </span>
                            <span className='text-subtitle-secondary ml-6'>
                                <FolderRoundedIcon className='inline-block mr-1' style={{fontSize: '1.2rem'}}/>
                                <span className='relative top-1'>Created on: {new Date(lessons[index]?.created_date).toLocaleDateString()}</span>
                            </span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default LessonsGrid