import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom';

import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';
import CircularProgress from '@mui/material/CircularProgress';

import LessonsGrid from '@/components/layout/LessonsGrid';
import MaterialsGrid from '@/components/layout/MaterialsGrid';

import PlaceholderPfp from './images/placeholder_pfp.png';
import PlaceholderBg from './images/placeholder_bg.png';

import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';

import type { User, MaterialExtended, LessonExtended } from '@interfaces/userProfile';
import { retrieveMaterials, retrieveUserData, retrieveLessons, calculateStatistics} from '@services/userService';

const UserProfilePage = () => {
	const { userId } = useParams();
	const [user, setUser] = useState<User | null>(null);
	const [materials, setMaterials] = useState<MaterialExtended[]>([]);
	const [lessons, setLessons] = useState<LessonExtended[]>([]);
	const [isMaterialsLoading, setIsMaterialsLoading] = useState<boolean>(true);
	const [isLessonsLoading, setIsLessonsLoading] = useState<boolean>(true);

	const navigate = useNavigate();

	useEffect(() => {
		const fetchData = async () => {
			if (!userId) {
				console.error('User ID is undefined');
				return;
			}
			
			try {
				const userData = await retrieveUserData(userId);
				const userStats = await calculateStatistics(userId);
				console.log('User Data:', userData);
				console.log('User Statistics:', userStats);
				setUser({ ...userData, statistics: userStats });

				// Store background and profile image links in local storage
				if (userData.background_image_url) {
					localStorage.setItem('background_image_url', userData.background_image_url);
				}
				if (userData.profile_picture_url) {
					localStorage.setItem('profile_picture_url', userData.profile_picture_url);
				}
			} catch (error) {
				if (error instanceof Error && error.message.includes('Failed to fetch user data')) {
					navigate('/not-found', { replace: true });
				}
			}
		};

		const fetchMaterialsAndLessons = async () => {
			if (!userId) {
				console.error('User ID is undefined');
				return;
			}

			try {
				setIsMaterialsLoading(true);
				setIsLessonsLoading(true);
				const materials = await retrieveMaterials(userId, 'newest', { from: 0, to: 5 });
				const lessons = await retrieveLessons(userId, 'newest', { from: 0, to: 5 });
				setIsMaterialsLoading(false);
				setIsLessonsLoading(false);
				console.log('User Materials:', materials);
				console.log('User Lessons:', lessons);

				setMaterials(materials);
				setLessons(lessons);
			} catch (error) {
				console.error('Error fetching materials or lessons:', error);
			}
		}

		fetchData();
		fetchMaterialsAndLessons();
	}, [userId]);

	return (
		<div className='p-12 min-h-screen w-full rounded-2xl overflow-y-auto scrollbar-hide h-[100vh] pb-36'>
			<div className='rounded-3xl bg-primary overflow-hidden card-shadow pb-6'>
				<div className='p-2'>
					<img src={user?.background_image_url || PlaceholderBg} alt="" className='w-full rounded-3xl h-80 object-cover pointer-events-none'/>
				</div>
				<div className='px-6'>
					<div className='p-4 relative'>
						<img src={user?.profile_picture_url || PlaceholderPfp} alt="Profile" className='absolute w-48 h-48 object-cover rounded-full border-6 border-white -top-34 left-6 pointer-events-none'/>
						
						<div className='mt-12 flex justify-between items-center'>
							<div>
								<h1 className='text-header-large'>{user?.full_name}</h1>
								<h2 className='text-subtitle'>@{user?.user_id}</h2>
								<p className='mt-4'>Joined on <span className='font-[600]'>{user?.created_date ? new Date(user.created_date).toLocaleDateString() : 'N/A'}</span></p>
								<p className=''>Living in <span className='font-[600]'>{user?.address}</span></p>
							</div>
							<div>
								<button className='button-primary w-40 px-6 py-2 rounded-md'>
									<AddOutlinedIcon className='mr-1' style={{fontSize: '1.4rem'}}/>
									Follow
								</button>
								<button className='button-outline w-40 px-6 py-2 rounded-md ml-4'>
									<EmailOutlinedIcon className='mr-1' style={{fontSize: '1.4rem'}}/>
									Message
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>

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
					<p className='text-3xl font-bold'>{user?.statistics.total_materials}</p>
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
					<p className='text-3xl font-bold'>{user?.statistics.total_lessons}</p>
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
					<p className='text-3xl font-bold'>{user?.statistics.total_downloads}</p>
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
					<p className='text-3xl font-bold'>{user?.statistics.average_rating}</p>
					<h2 className='mt-1 font-semibold'>Community Ratings</h2>
					<p className='text-xs mt-1 opacity-80'>Feedback Received</p>
					</div>
				</div>
				</div>
			</div>

			<div className='rounded-3xl bg-primary overflow-hidden card-shadow px-10 py-6 mt-10'>
				<h1 className='text-header-medium'>My Materials</h1>
				<p className='mt-2 text-gray-600'>Here are some of the materials I have created:</p>
				{ isMaterialsLoading ?
					<div className='flex justify-center items-center flex-col mt-10 text-gray-600'>
						<CircularProgress sx={{color: '#9f9fa9'}} size='30px'/>
						<h1 className='mt-2 text-lg'>Fetching materials...</h1>
					</div> : materials.length === 0 ? (
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
		</div>
	)
}

export default UserProfilePage