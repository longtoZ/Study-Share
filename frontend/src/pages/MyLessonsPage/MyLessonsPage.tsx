import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';

import ArticleIcon from '@mui/icons-material/Article';
import FolderRoundedIcon from '@mui/icons-material/FolderRounded';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';

import SearchBar from '@/components/common/SearchBar';
import type { Lesson } from '@/interfaces/userProfile';
import { retriveLessons } from '@/services/userService';

const MyLessonsPage = () => {
    const { userId } = useParams();

    const [lessons, setLessons] = useState<Lesson[]>([]);

    useEffect(() => {
        const retrieveData = async () => {
            if (!userId) {
				console.error('User ID is undefined');
				return;
            }

            const data = await retriveLessons(userId);
            data.sort((a: Lesson, b: Lesson) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime());
            setLessons(data);
        }

        retrieveData();

    }, [userId]);

    return (
        <div className='p-12 min-h-screen'>
            <h1 className='text-header-large mb-4'>All Lessons</h1>
            <div className='flex gap-2 justify-end'>
                <SearchBar className=''/>
                <button className='button-primary py-2 px-4'>
                    <AddOutlinedIcon className='relative -top-[2px]'/>
                    <span className='ml-2'>Create lesson</span>
                </button>
            </div>

            <div className='rounded-2xl bg-primary overflow-hidden border border-primary px-10 py-6 mt-4'>
                <h1 className='text-header-medium'>{`${userId}'s lessons`}</h1>
                <div className='grid grid-cols-3 gap-4 mt-4'>
					{lessons.map((_, index) => (
						<div key={index} className='p-4 my-2 border border-primary rounded-lg cursor-pointer hover:button-transparent'>
							<h2 className='text-header-medium'>{lessons[index]?.name}</h2>
							<p className='text-subtitle'>{lessons[index]?.description}</p>
							<div className='mt-2 flex justify-between items-center'>
								<div>
									<span className='text-subtitle-secondary'>
										<ArticleIcon className='inline-block mr-1' style={{fontSize: '1.2rem'}}/>
										<span className='relative top-1'>Materials: {lessons[index]?.materialCount}</span>
									</span>
									<span className='text-subtitle-secondary ml-6'>
										<FolderRoundedIcon className='inline-block mr-1' style={{fontSize: '1.2rem'}}/>
										<span className='relative top-1'>Created on: {lessons[index]?.createdDate}</span>
									</span>
								</div>
							</div>
						</div>
					))}
				</div>
            </div>
        </div>
        
    )
}

export default MyLessonsPage