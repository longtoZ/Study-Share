import { useNavigate } from 'react-router-dom';
import type { LessonExtended } from '@/interfaces/userProfile.d';

import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';

const LessonsGrid = ({ lessons }: { lessons: LessonExtended[]}) => {
    const navigate = useNavigate();
    return (
        <div className='grid grid-cols-2 gap-4 mt-4'>
            {lessons.map((_, index) => (
                <div key={index} 
                    className='p-4 my-2 border-2 border-zinc-200 rounded-lg hover:border-blue-600 shadow-zinc-100 shadow-lg hover:shadow-blue-200 hover:scale-[101%] transition-all ease-in-out duration-200'
                    onClick={() => navigate(`/lesson/${lessons[index]?.lesson_id}`)}
                >
                    <div className='flex relative justify-between items-center gap-1'>  
                        <div className='opacity-90 flex justify-center items-center w-[25%]'>
                            <svg width={60} height={60} viewBox="0 0 24.00 24.00" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#000000" stroke-width="0.00024000000000000003"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.048"></g><g id="SVGRepo_iconCarrier"> <path opacity="0.5" d="M2 6.94975C2 6.06722 2 5.62595 2.06935 5.25839C2.37464 3.64031 3.64031 2.37464 5.25839 2.06935C5.62595 2 6.06722 2 6.94975 2C7.33642 2 7.52976 2 7.71557 2.01738C8.51665 2.09229 9.27652 2.40704 9.89594 2.92051C10.0396 3.03961 10.1763 3.17633 10.4497 3.44975L11 4C11.8158 4.81578 12.2237 5.22367 12.7121 5.49543C12.9804 5.64471 13.2651 5.7626 13.5604 5.84678C14.0979 6 14.6747 6 15.8284 6H16.2021C18.8345 6 20.1506 6 21.0062 6.76946C21.0849 6.84024 21.1598 6.91514 21.2305 6.99383C22 7.84935 22 9.16554 22 11.7979V14C22 17.7712 22 19.6569 20.8284 20.8284C19.6569 22 17.7712 22 14 22H10C6.22876 22 4.34315 22 3.17157 20.8284C2 19.6569 2 17.7712 2 14V6.94975Z" fill="#dbac00"></path> <path d="M20 6.23751C19.9992 5.94016 19.9949 5.76263 19.9746 5.60842C19.7974 4.26222 18.7381 3.2029 17.3919 3.02567C17.1969 3 16.9647 3 16.5003 3H9.98828C10.1042 3.10392 10.2347 3.23445 10.45 3.44975L11.0003 4C11.8161 4.81578 12.2239 5.22367 12.7124 5.49543C12.9807 5.64471 13.2653 5.7626 13.5606 5.84678C14.0982 6 14.675 6 15.8287 6H16.2024C17.9814 6 19.1593 6 20 6.23751Z" fill="#dbac00"></path> <path fill-rule="evenodd" clip-rule="evenodd" d="M12.25 10C12.25 9.58579 12.5858 9.25 13 9.25H18C18.4142 9.25 18.75 9.58579 18.75 10C18.75 10.4142 18.4142 10.75 18 10.75H13C12.5858 10.75 12.25 10.4142 12.25 10Z" fill="#dbac00"></path> </g></svg>
                        </div>
                        <div className=' w-[75%]'>
                            <div className='flex justify-between items-center'>
                                <h2 className='text-header-medium'>{lessons[index]?.name}</h2>
                                <div className='relative w-22 ml-auto flex justify-end'>
                                    <span className=''>
                                        <VisibilityOutlinedIcon className='relative mr-1' style={{fontSize: '1.1rem'}}/>
                                        <span className='relative text-sm top-[1px]'>{lessons[index]?.view_count}</span>
                                    </span>
                                </div>
                            </div>
                            <p className='text-subtitle'>{lessons[index]?.description? lessons[index]?.description : 'No description available'}</p>
                            <div className='flex items-center gap-2 mt-4'>
                                <img referrerPolicy="no-referrer" src={lessons[index]?.profile_picture_url} alt={lessons[index]?.user_name}  className='w-6 h-6 object-cover rounded-full'/>
                                <span 
                                    className='cursor-pointer text-md font-semibold hover:text-blue-700 hover:underline transition-all ease-in-out duration-100' 
                                    onClick={() => navigate(`/user/${lessons[index]?.user_id}`)}>{lessons[index]?.user_name}</span>
                            </div>
                            <div className='mt-2 flex justify-between items-center'>
                                <p className='text-xs rounded-lg px-2 py-1 bg-zinc-200 shadow-lg'>
                                    <ArticleOutlinedIcon className='inline-block mr-2' style={{fontSize: '1.1rem'}}/>
                                    <span className='relative top-0.5'>{lessons[index]?.material_count}</span>
                                </p>
                            </div>
                        </div>
                    </div>
                    <p className='text-subtitle-secondary mt-4 ml-4'>
                        {/* <FolderRoundedIcon className='inline-block mr-1' style={{fontSize: '1.2rem'}}/> */}
                        <span className='relative top-1'>Created on: {new Date(lessons[index]?.created_date).toLocaleDateString()}</span>
                    </p>
                </div>
            ))}
        </div>
    )
}

export default LessonsGrid