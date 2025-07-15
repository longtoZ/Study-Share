import { useState, useEffect } from 'react'
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
	id: string
	name: string
	email: string
	gender?: string
	address?: string
	profilePicture: string
	backgoundImage?: string
	joinedDate: string
	userType: string
	description?: string
	statistics: Statistic
}

interface Statistic {
	totalMaterials: number
	totalLessons: number
	totalDownloads: number
	totalRatings: number
}

interface Material {
  id: string
  title: string
  description: string
  subject: string
  uploadDate: string
  downloads: number
  rating: number
  fileType: string	
}

interface Lesson {
  id: string
  title: string
  description: string
  materialCount: number
  createdDate: string
  isPublic: boolean
}

const UserProfilePage = () => {
	const [user, setUser] = useState<User | null>(null)

	useEffect(() => {
		// Simulate fetching user data
		const fetchedUser: User = {
			id: '@longto',
			name: 'Long To',
			email: 'longto@gmail.com',
			address: 'Ho Chi Minh City, Vietnam',
			profilePicture: ProfileImage,
			joinedDate: 'January 1, 2023',
			userType: 'Basic',
			description: 'I am a dedicated computer science student with a passion for sharing knowledge and helping others succeed. My academic journey has taken me through various programming languages and frameworks, allowing me to create comprehensive study materials. I believe in collaborative learning and the power of well-structured resources to transform education. When not coding or creating study guides, I enjoy exploring new technologies and contributing to open-source projects. Teaching has always been my way of solidifying my own understanding while making complex concepts accessible to fellow students. I strive to make education more accessible and enjoyable for everyone through my contributions.',
			statistics: {
				totalMaterials: 120,
				totalLessons: 30,
				totalDownloads: 5000,
				totalRatings: 150
			}
		}
		setUser(fetchedUser)
	}, [])

	return (
		<div className='p-12 min-h-screen w-full'>
			<div className='rounded-2xl bg-primary overflow-hidden border border-primary'>
				<img src={BackgroundImage} alt="" className='w-full h-64 object-cover'/>
				<div className='px-6'>
					<div className='p-4 relative'>
						<img src={ProfileImage} alt="Profile" className='absolute w-48 h-48 object-cover rounded-full border-6 border-white -top-36 left-6'/>
						
						<div className='mt-12 flex justify-between items-center'>
							<div>
								<h1 className='text-header-large'>{user?.name}</h1>
								<h2 className='text-subtitle'>{user?.id}</h2>
								<p className='mt-4'>Joined on <span className='font-[600]'>{user?.joinedDate}</span></p>
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

				<h1 className='text-header-medium mt-8'>Statistic</h1>
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
						<p className='text-4xl font-bold text-primary'>{user?.statistics.totalRatings}</p>
						<h2 className='mt-2 text-gray-600'>Community Ratings</h2>
						<p className='text-xs mt-1 text-gray-500'>Feedback Received</p>
					</div>
				</div>
			</div>

			<div className='rounded-2xl bg-primary overflow-hidden border border-primary px-10 py-6 mt-4'>
				<h1 className='text-header-medium'>My Materials</h1>
				<p className='mt-2 text-gray-600'>Here are some of the materials I have created:</p>
				<div className=''>
					{Array.from({ length: 6 }).map((_, index) => (
						<div key={index} className='p-4 my-2 border border-primary rounded-lg cursor-pointer hover:button-transparent'>
							<h2 className='text-header-medium'>Material Title {index + 1}</h2>
							<p className='text-subtitle'>Description of the material goes here. It can be a brief overview of the content.</p>
							<div className='mt-2 flex justify-between items-center'>
								<div>
									<span className='text-subtitle-secondary'>Subject: Computer Science</span>
									<span className='text-subtitle-secondary ml-6'>
										<FileDownloadOutlinedIcon className='inline-block mr-1' style={{fontSize: '1.2rem'}}/>
										<span className='relative top-1'>Downloads: {100 + index * 25}</span>
									</span>
									<span className='text-subtitle-secondary ml-6'>
										<StarBorderOutlinedIcon className='inline-block mr-1' style={{fontSize: '1.2rem'}}/>
										<span className='relative top-1'>Rating: {(4 + Math.random()).toFixed(1)}/5</span>
									</span>
								</div>
								<span className='text-xs text-gray-400'>Uploaded on: {new Date().toLocaleDateString()}</span>
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
					{Array.from({ length: 4 }).map((_, index) => (
						<div key={index} className='p-4 my-2 border border-primary rounded-lg cursor-pointer hover:button-transparent'>
							<h2 className='text-header-medium'>Lesson Title {index + 1}</h2>
							<p className='text-subtitle'>Description of the lesson goes here. It can be a brief overview of the content.</p>
							<div className='mt-2 flex justify-between items-center'>
								<div>
									<span className='text-subtitle-secondary'>
										<ArticleIcon className='inline-block mr-1' style={{fontSize: '1.2rem'}}/>
										<span className='relative top-1'>Materials: {5 + index}</span>
									</span>
									<span className='text-subtitle-secondary ml-6'>
										<FolderRoundedIcon className='inline-block mr-1' style={{fontSize: '1.2rem'}}/>
										<span className='relative top-1'>Created on: {new Date().toLocaleDateString()}</span>
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