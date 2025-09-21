import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';

interface UserProps {
    bio: string;
    statistics: {
        total_materials: number;
        total_lessons: number;
        total_downloads: number;
        average_rating: number;
    } | null;
}

const AboutSection = ({ user } : { user: UserProps }) => {
    return (
        <div className='rounded-3xl bg-primary overflow-hidden card-shadow px-10 py-6 mt-10'>
            <h1 className='text-header-medium'>About</h1>
            <p className='mt-2 text-justify'>{user?.bio}</p>

            <h1 className='text-header-medium mt-8'>Achievement</h1>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 my-4'>
            {/* Materials Card */}
            <div className='flex items-center p-6 rounded-2xl border-2 border-blue-200 cursor-pointer shadow-lg shadow-blue-100 bg-gradient-to-br from-blue-200 to-white text-blue-500 transition-transform duration-300 hover:scale-105'>
                <div className='flex-shrink-0'>
                <div className='w-16 h-16 rounded-full flex items-center justify-center bg-white bg-opacity-20 shadow-lg mr-6'>
                    <ArticleOutlinedIcon style={{ fontSize: 36 }} />
                </div>
                </div>
                <div>
                <p className='text-3xl font-bold'>{user?.statistics?.total_materials || 0}</p>
                <h2 className='mt-1 font-semibold'>Study Materials</h2>
                <p className='text-xs mt-1 opacity-80'>Documents, Notes & Guides</p>
                </div>
            </div>
            {/* Lessons Card */}
            <div className='flex items-center p-6 rounded-2xl border-2 border-purple-200 cursor-pointer shadow-lg shadow-purple-100 bg-gradient-to-br from-purple-200 to-white text-purple-500 transition-transform duration-300 hover:scale-105'>
                <div className='flex-shrink-0'>
                <div className='w-16 h-16 rounded-full flex items-center justify-center bg-white bg-opacity-20 shadow-lg mr-6'>
                    <SchoolOutlinedIcon style={{ fontSize: 36 }} />
                </div>
                </div>
                <div>
                <p className='text-3xl font-bold'>{user?.statistics?.total_lessons || 0}</p>
                <h2 className='mt-1 font-semibold'>Learning Lessons</h2>
                <p className='text-xs mt-1 opacity-80'>Curated Content Collections</p>
                </div>
            </div>
            {/* Downloads Card */}
            <div className='flex items-center p-6 rounded-2xl border-2 border-green-200 cursor-pointer shadow-lg shadow-green-100 bg-gradient-to-br from-green-200 to-white text-green-500 transition-transform duration-300 hover:scale-105'>
                <div className='flex-shrink-0'>
                <div className='w-16 h-16 rounded-full flex items-center justify-center bg-white bg-opacity-20 shadow-lg mr-6'>
                    <DownloadOutlinedIcon style={{ fontSize: 36 }} />
                </div>
                </div>
                <div>
                <p className='text-3xl font-bold'>{user?.statistics?.total_downloads || 0}</p>
                <h2 className='mt-1 font-semibold'>Total Downloads</h2>
                <p className='text-xs mt-1 opacity-80'>By Other Students</p>
                </div>
            </div>
            {/* Ratings Card */}
            <div className='flex items-center p-6 rounded-2xl border-2 border-yellow-200 cursor-pointer shadow-lg shadow-yellow-100 bg-gradient-to-br from-yellow-200 to-white text-yellow-500 transition-transform duration-300 hover:scale-105'>
                <div className='flex-shrink-0'>
                <div className='w-16 h-16 rounded-full flex items-center justify-center bg-white bg-opacity-20 shadow-lg mr-6'>
                    <PeopleOutlinedIcon style={{ fontSize: 36 }} />
                </div>
                </div>
                <div>
                <p className='text-3xl font-bold'>{user?.statistics?.average_rating || 0}</p>
                <h2 className='mt-1 font-semibold'>Community Ratings</h2>
                <p className='text-xs mt-1 opacity-80'>Feedback Received</p>
                </div>
            </div>
            </div>
        </div>
    )
}

export default AboutSection