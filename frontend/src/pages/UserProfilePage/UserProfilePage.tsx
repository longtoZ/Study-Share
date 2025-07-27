import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import ProfileImage from '@assets/images/profile.png'
import BackgroundImage from '@assets/images/background.jpg'

import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';

import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import StarBorderOutlinedIcon from '@mui/icons-material/StarBorderOutlined';

import ArticleIcon from '@mui/icons-material/Article';
import FolderRoundedIcon from '@mui/icons-material/FolderRounded';

import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';

interface User {
	userId: string,
	fullName: string,
	gender: string,
	address: string,
	profilePictureUrl: string,
	backgroundImageUrl: string,
	createdDate: string,
	description: string,
	statistics: Statistic
}

interface Statistic {
	totalMaterials: number
	totalLessons: number
	totalDownloads: number
	averageRating: number
}

// interface Material {
//   id: string
//   title: string
//   description: string
//   subject: string
//   uploadDate: string
//   downloads: number
//   rating: number
//   fileType: string	
// }

interface Material {
	materialId: string,
	name: string,
	description: string,
	subject: string,
	uploadDate: string,
	downloadCount: number,
	rating: number,
	fileType: string
}

interface Lesson {
  lessonId: string,
  name: string,
  description: string
  createdDate: string
  materialCount: number
  isPublic: boolean
}

const USER_PROFILE_ENDPOINT = import.meta.env.VITE_USER_PROFILE_ENDPOINT;
const USER_STATISTICS_ENDPOINT = import.meta.env.VITE_USER_STATISTICS_ENDPOINT;
const USER_MATERIALS_ENDPOINT = import.meta.env.VITE_USER_MATERIALS_ENDPOINT;
const USER_LESSONS_ENDPOINT = import.meta.env.VITE_USER_LESSONS_ENDPOINT;
const SUBJECTS_ENDPOINT = import.meta.env.VITE_SUBJECTS_ENDPOINT;

const retrieveUserData = async (userId: string): Promise<User> => {
	try {
		const response = await fetch(`${USER_PROFILE_ENDPOINT}/${userId}`);
		if (!response.ok) {
			throw new Error('Failed to fetch user data');
		}
		const data = await response.json();
		const user = data.user;
		return {
			userId: user.user_id,
			fullName: user.full_name,
			gender: user.gender,
			address: user.address,
			profilePictureUrl: user.profile_picture_url,
			backgroundImageUrl: user.background_image_url,
			createdDate: user.created_date,
			description: user.description,
			statistics: user.statistics
		}
	} catch (error) {
		console.error('Error fetching user data:', error);
		throw error;
	}
}

const calculateStatistics = async (userId: string): Promise<Statistic> => {
	try {
		const response = await fetch(`${USER_STATISTICS_ENDPOINT}/${userId}`);
		if (!response.ok) {
			throw new Error('Failed to fetch user statistics');
		}
		const data = await response.json();
		const statistics = data.statistics;
		return {
			totalMaterials: statistics.total_materials,
			totalLessons: statistics.total_lessons,
			totalDownloads: statistics.total_downloads,
			averageRating: statistics.average_rating
		}
	} catch (error) {
		console.error('Error fetching user statistics:', error);
		throw error;
	}
}

const retrieveAllSubjects = async (): Promise<string[]> => {
	try {
		const response = await fetch(SUBJECTS_ENDPOINT);
		if (!response.ok) {
			throw new Error('Failed to fetch subjects');
		}
		const data = await response.json();
		return data.subjects || [];
	} catch (error) {
		console.error('Error fetching subjects:', error);
		throw error;
	}
}

const retrieveMaterials = async (userId: string, subjects: string[]): Promise<Material[]> => {
	try {
		const response = await fetch(`${USER_MATERIALS_ENDPOINT}/${userId}`);
		if (!response.ok) {
			throw new Error('Failed to fetch user materials');
		}
		const data = await response.json();
		return data.materials.map((material: any) => ({
			materialId: material.material_id,
			name: material.name,
			description: material.description,
			subject: subjects[material.subject_id] || 'Other',
			uploadDate: material.upload_date,
			downloadCount: material.download_count,
			rating: material.total_rating / (material.rating_count || 1), // Avoid division by zero
			fileType: material.file_type
		}));
	} catch (error) {
		console.error('Error fetching user materials:', error);
		throw error;
	}
}

const retriveLessons = async (userId: string): Promise<Lesson[]> => {
	try {
		const response = await fetch(`${USER_LESSONS_ENDPOINT}/${userId}`);
		if (!response.ok) {
			throw new Error('Failed to fetch user lessons');
		}
		const data = await response.json();
		return data.lessons.map((lesson: any) => ({
			lessonId: lesson.lesson_id,
			name: lesson.name,
			description: lesson.description,
			createdDate: lesson.created_date,
			materialCount: lesson.material_count,
			isPublic: lesson.is_public
		}));
	} catch (error) {
		console.error('Error fetching user lessons:', error);
		throw error;
	}
}

const UserProfilePage = () => {
	const { userId } = useParams();
	const [user, setUser] = useState<User | null>(null);
	const [subjects, setSubjects] = useState<string[]>([]);
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
				const materials = await retrieveMaterials(userId, subjects);
				const lessons = await retriveLessons(userId);
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
		<div className='p-12 min-h-screen w-full'>
			<div className='rounded-2xl bg-primary overflow-hidden border border-primary'>
				<img src={BackgroundImage} alt="" className='w-full h-64 object-cover'/>
				<div className='px-6'>
					<div className='p-4 relative'>
						<img src={ProfileImage} alt="Profile" className='absolute w-48 h-48 object-cover rounded-full border-6 border-white -top-36 left-6'/>
						
						<div className='mt-12 flex justify-between items-center'>
							<div>
								<h1 className='text-header-large'>{user?.fullName}</h1>
								<h2 className='text-subtitle'>{user?.userId}</h2>
								<p className='mt-4'>Joined on <span className='font-[600]'>{user?.createdDate}</span></p>
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

			<div className='rounded-2xl bg-primary overflow-hidden border border-primary px-10 py-6 mt-4'>
				<h1 className='text-header-medium'>About</h1>
				<p className='mt-2 text-justify'>{user?.description}</p>

				<h1 className='text-header-medium mt-8'>Achievement</h1>
				<div className='grid grid-cols-4 gap-4 mt-4 border border-primary rounded-lg overflow-hidden shadow-sm'>
					<div className='p-6 text-center transition-all duration-300 hover:bg-gray-50'>
						<p className='text-4xl font-bold text-primary'>{user?.statistics.totalMaterials}</p>
						<h2 className='mt-2 text-gray-600'>Study Materials Created</h2>
						<p className='text-xs mt-1 text-gray-500'>Documents, Notes & Guides</p>
					</div>
					<div className='p-6 border-l border-primary text-center transition-all duration-300 hover:bg-gray-50'>
						<p className='text-4xl font-bold text-primary'>{user?.statistics.totalLessons}</p>
						<h2 className='mt-2 text-gray-600'>Learning Lessons</h2>
						<p className='text-xs mt-1 text-gray-500'>Curated Content Collections</p>
					</div>
					<div className='p-6 border-l border-primary text-center transition-all duration-300 hover:bg-gray-50'>
						<p className='text-4xl font-bold text-primary'>{user?.statistics.totalDownloads}</p>
						<h2 className='mt-2 text-gray-600'>Total Downloads</h2>
						<p className='text-xs mt-1 text-gray-500'>By Other Students</p>
					</div>
					<div className='p-6 border-l border-primary text-center transition-all duration-300 hover:bg-gray-50'>
						<p className='text-4xl font-bold text-primary'>{user?.statistics.averageRating}</p>
						<h2 className='mt-2 text-gray-600'>Community Ratings</h2>
						<p className='text-xs mt-1 text-gray-500'>Feedback Received</p>
					</div>
				</div>
			</div>

			<div className='rounded-2xl bg-primary overflow-hidden border border-primary px-10 py-6 mt-4'>
				<h1 className='text-header-medium'>My Materials</h1>
				<p className='mt-2 text-gray-600'>Here are some of the materials I have created:</p>
				<div className=''>
					{materials.map((_, index) => (
						<div key={index} className='p-4 my-2 border border-primary rounded-lg cursor-pointer hover:button-transparent'>
							<h2 className='text-header-medium'>{materials[index]?.name}</h2>
							<p className='text-subtitle'>{materials[index]?.description}</p>
							<div className='mt-2 flex justify-between items-center'>
								<div>
									<span className='text-subtitle-secondary'>Subject: {materials[index]?.subject}</span>
									<span className='text-subtitle-secondary ml-6'>
										<FileDownloadOutlinedIcon className='inline-block mr-1' style={{fontSize: '1.2rem'}}/>
										<span className='relative top-1'>Downloads: {materials[index]?.downloadCount}</span>
									</span>
									<span className='text-subtitle-secondary ml-6'>
										<StarBorderOutlinedIcon className='inline-block mr-1' style={{fontSize: '1.2rem'}}/>
										<span className='relative top-1'>Rating: {materials[index]?.rating}</span>
									</span>
								</div>
								<span className='text-xs text-gray-400'>Uploaded on: {materials[index]?.uploadDate}</span>
							</div>
						</div>
					))}
				</div>

				<div>
					<button className='button-outline w-full px-6 py-2 rounded-md mt-10 flex items-center justify-center'>
						Show More
						<ArrowForwardIosOutlinedIcon className='ml-1' style={{fontSize: '1.2rem'}}/>
					</button>
				</div>
			</div>

			<div className='rounded-2xl bg-primary overflow-hidden border border-primary px-10 py-6 mt-4'>
				<h1 className='text-header-medium'>My Lessons</h1>
				<p className='mt-2 text-gray-600'>Here are some of the lessons I have created:</p>
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
				
				<div>
					<button className='button-outline w-full px-6 py-2 rounded-md mt-10 flex items-center justify-center'>
						Show More
						<ArrowForwardIosOutlinedIcon className='ml-1' style={{fontSize: '1.2rem'}}/>
					</button>
				</div>
			</div>
		</div>
	)
}

export default UserProfilePage