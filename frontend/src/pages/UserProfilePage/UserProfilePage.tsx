import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom';

import type { Subject } from '@interfaces/table';

import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';

import LessonsGrid from '@/components/layout/LessonsGrid';
import MaterialsGrid from '@/components/layout/MaterialsGrid';

import type { User, Material, Lesson } from '@interfaces/userProfile';
import { retrieveAllSubjects, retrieveMaterials, retrieveUserData, retriveLessons, calculateStatistics} from '@services/userService';

const UserProfilePage = () => {
	const { userId } = useParams();
	const [user, setUser] = useState<User | null>(null);
	const [subjects, setSubjects] = useState<Subject[]>([]);
	const [materials, setMaterials] = useState<Material[]>([]);
	const [lessons, setLessons] = useState<Lesson[]>([]);

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
				const subjects = await retrieveAllSubjects();
				console.log('Subjects:', subjects);
				const materials = await retrieveMaterials(userId, subjects, 'newest');
				const lessons = await retriveLessons(userId, 'newest');
				console.log('User Materials:', materials);
				console.log('User Lessons:', lessons);

				setSubjects(subjects);
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
		<div className='p-12 min-h-screen w-full rounded-2xl'>
			<div className='rounded-2xl bg-primary overflow-hidden shadow-lg pb-6'>
				<img src={user?.background_image_url} alt="" className='w-full h-64 object-cover'/>
				<div className='px-6'>
					<div className='p-4 relative'>
						<img src={user?.profile_picture_url} alt="Profile" className='absolute w-48 h-48 object-cover rounded-full border-6 border-white -top-36 left-6'/>
						
						<div className='mt-12 flex justify-between items-center'>
							<div>
								<h1 className='text-header-large'>{user?.full_name}</h1>
								<h2 className='text-subtitle'>{user?.user_id}</h2>
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

			<div className='rounded-2xl bg-primary overflow-hidden shadow-lg px-10 py-6 mt-6'>
				<h1 className='text-header-medium'>About</h1>
				<p className='mt-2 text-justify'>{user?.bio}</p>

				<h1 className='text-header-medium mt-8'>Achievement</h1>
				<div className='grid grid-cols-4 gap-4 mt-4 border border-primary rounded-lg overflow-hidden shadow-sm'>
					<div className='p-6 text-center transition-all duration-300 hover:bg-gray-50'>
						<p className='text-4xl font-bold text-primary'>{user?.statistics.total_materials}</p>
						<h2 className='mt-2 text-gray-600'>Study Materials Created</h2>
						<p className='text-xs mt-1 text-gray-500'>Documents, Notes & Guides</p>
					</div>
					<div className='p-6 border-l border-primary text-center transition-all duration-300 hover:bg-gray-50'>
						<p className='text-4xl font-bold text-primary'>{user?.statistics.total_lessons}</p>
						<h2 className='mt-2 text-gray-600'>Learning Lessons</h2>
						<p className='text-xs mt-1 text-gray-500'>Curated Content Collections</p>
					</div>
					<div className='p-6 border-l border-primary text-center transition-all duration-300 hover:bg-gray-50'>
						<p className='text-4xl font-bold text-primary'>{user?.statistics.total_downloads}</p>
						<h2 className='mt-2 text-gray-600'>Total Downloads</h2>
						<p className='text-xs mt-1 text-gray-500'>By Other Students</p>
					</div>
					<div className='p-6 border-l border-primary text-center transition-all duration-300 hover:bg-gray-50'>
						<p className='text-4xl font-bold text-primary'>{user?.statistics.average_rating}</p>
						<h2 className='mt-2 text-gray-600'>Community Ratings</h2>
						<p className='text-xs mt-1 text-gray-500'>Feedback Received</p>
					</div>
				</div>
			</div>

			<div className='rounded-2xl bg-primary overflow-hidden shadow-lg px-10 py-6 mt-6'>
				<h1 className='text-header-medium'>My Materials</h1>
				<p className='mt-2 text-gray-600'>Here are some of the materials I have created:</p>
				<MaterialsGrid materials={materials} />

				<div>
					<button className='button-outline w-full px-6 py-2 rounded-md mt-10 flex items-center justify-center' onClick={() => {navigate(`/user/${userId}/materials`)}}>
						Show More
						<ArrowForwardIosOutlinedIcon className='ml-1' style={{fontSize: '1.2rem'}}/>
					</button>
				</div>
			</div>

			<div className='rounded-2xl bg-primary overflow-hidden shadow-lg px-10 py-6 mt-6'>
				<h1 className='text-header-medium'>My Lessons</h1>
				<p className='mt-2 text-gray-600'>Here are some of the lessons I have created:</p>
				<LessonsGrid lessons={lessons}/>

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