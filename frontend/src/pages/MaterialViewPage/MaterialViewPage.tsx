import { useState, useEffect, useRef } from 'react';
import { Meta, useParams } from 'react-router-dom';
import { getMaterial } from '@services/materialService';
import { retrieveUserData } from '@/services/userService';
import { getSubject } from '@/services/subjectService';

import MetadataCard from './components/MetadataCard';

import {
  FileDownloadOutlined as FileDownloadOutlinedIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  ShareOutlined as ShareOutlinedIcon,
  BookmarkBorderOutlined as BookmarkBorderOutlinedIcon,
  SchoolOutlined as SchoolOutlinedIcon,
  DescriptionOutlined as DescriptionOutlinedIcon,
  CloudDownloadOutlined as CloudDownloadOutlinedIcon,
  VisibilityOutlined as VisibilityOutlinedIcon,
  SubjectOutlined as SubjectOutlinedIcon,
  AccountCircleOutlined as AccountCircleOutlinedIcon,
  DateRangeOutlined as DateRangeOutlinedIcon,
  AttachMoneyOutlined as AttachMoneyOutlinedIcon,
  ZoomInOutlined as ZoomInOutlinedIcon,
  ZoomOutOutlined as ZoomOutOutlinedIcon,
} from '@mui/icons-material';

const GET_MATERIAL_ENDPOINT = import.meta.env.VITE_GET_MATERIAL_ENDPOINT;
const USER_PROFILE_ENDPOINT = import.meta.env.VITE_USER_PROFILE_ENDPOINT;
const GET_MATERIAL_PAGE_ENDPOINT = import.meta.env.VITE_GET_MATERIAL_PAGE_ENDPOINT;

interface IImagePage {
	pageNumber: number;
	imageUrl: string;
}

const MaterialViewPage = () => {
	const [material, setMaterial] = useState<any>(null);
	const [user, setUser] = useState<any>(null);
	const [imagePages, setImagePages] = useState<IImagePage[]>([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(0);
	const [currentView, setCurrentView] = useState('content'); // 'content' or 'about'
	const [avgRating, setAvgRating] = useState(0);
	const [subject, setSubject] = useState<string>('');
	const [userRating, setUserRating] = useState(0); // For user's own rating
  	const [hoverRating, setHoverRating] = useState(0); // For hover effect
	const [imageWidth, setImageWidth] = useState(0);

	const { materialId } = useParams();
	const scrollViewRef = useRef<HTMLDivElement>(null);

	const getImagePage = async (pageNumber: number) => {
		const imageUrl = GET_MATERIAL_PAGE_ENDPOINT.replace('material-id', materialId).replace('page-number', pageNumber.toString());

		try {
			const response = await fetch(imageUrl);
			if (!response.ok) {
				throw new Error('Failed to fetch material page');
			}

			const blob = await response.blob();
			const imageObjectURL = URL.createObjectURL(blob);
			console.log(imageObjectURL)

			setImagePages(prevImages => {
				const newImagePage: IImagePage = {
					pageNumber: pageNumber,
					imageUrl: imageObjectURL
				};
				
				if (prevImages.some(image => image.pageNumber === pageNumber)) {
					return prevImages.map(image => 
						image.pageNumber === pageNumber ? newImagePage : image
					).sort((a, b) => a.pageNumber - b.pageNumber);
				}

				return [...prevImages, newImagePage].sort((a, b) => a.pageNumber - b.pageNumber);
			});
		} catch (error) {
			console.error('Error fetching material page:', error);
		}
	}

	useEffect(() => {
		if (!materialId) return;

		const fetchData = async () => {
			const materialData = await getMaterial(materialId);

			if (materialData) {
				setMaterial(materialData);
				setTotalPages(materialData.num_page);
				setAvgRating(materialData.total_rating / materialData.rating_count || 0);
			}

			const subjectData = await getSubject(materialData.subject_id);
			if (subjectData) {
				setSubject(subjectData.name);
			}

			const userData = await retrieveUserData(materialData.user_id);
			if (userData) {
				console.log('User data retrieved:', userData);
				setUser(userData);
			}
		};

		fetchData();

		if (scrollViewRef.current) {
			const elementWidth = scrollViewRef.current.offsetWidth;
			setImageWidth(elementWidth);
			console.log('Initial image width set to:', elementWidth);
		}
		
	}, [materialId]);

	useEffect(() => {
		if (!materialId || !currentPage) return;

		const getImagePageAsync = async (page: number) => {
			await getImagePage(page);
		}
		getImagePageAsync(currentPage);
	}, [materialId, currentPage]);

	const handleOnScroll = async (e: any) => {
		const scrollTop = e.target.scrollTop;
		const scrollHeight = e.target.scrollHeight;
		const clientHeight = e.target.clientHeight;

		// console.log('Scroll Top:', scrollTop);
		// console.log('Scroll Height:', scrollHeight);
		// console.log('Client Height:', clientHeight);
		// console.log('Current Page:', currentPage);
		// console.log('Total Pages:', totalPages);

		if (scrollTop + clientHeight >= scrollHeight - 10 && currentPage < totalPages) {
			console.log('Loading next page:', currentPage + 1);
			
			setCurrentPage(prevPage => prevPage + 1);
		}
	}

	const handleViewChange = (view: 'content' | 'about') => {
		setCurrentView(view);
	}

	const handleRatingClick = (ratingValue: number) => {
		setUserRating(ratingValue);
		// Here you would typically send the rating to the backend
		console.log(`User rated the document: ${ratingValue} stars`);
	};

	const renderInteractiveStars = () => {
		return (
		<div className="flex items-center">
			{Array.from({ length: 5 }, (_, index) => {
			const ratingValue = index + 1;
			const isFilled = (hoverRating || userRating) >= ratingValue;
			return (
				<StarIcon
				key={index}
				className={`cursor-pointer transition-colors duration-200
							${isFilled ? 'text-yellow-400' : 'text-gray-400'}`}
				onMouseEnter={() => setHoverRating(ratingValue)}
				onMouseLeave={() => setHoverRating(0)}
				onClick={() => handleRatingClick(ratingValue)}
				/>
			);
			})}
		</div>
		);
	};

	useEffect(() => {
		console.log('Image width updated:', imageWidth);
	}, [imageWidth]);

	const handleZoomIn = () => {
		if (scrollViewRef.current) {
			const newWidth = imageWidth * 1.2;
			console.log('Zooming in to new width:', newWidth);
			setImageWidth(newWidth);
		}
	}
	const handleZoomOut = () => {
		if (scrollViewRef.current) {
			const newWidth = imageWidth * 0.8;
			console.log('Zooming out to new width:', newWidth);
			setImageWidth(newWidth);
		}
	}

  return (
    <div className='bg-gray-100 min-h-screen font-sans p-4 md:p-8 lg:p-12'>
      <div className='flex flex-col gap-8 max-w-7xl mx-auto'>

        {/* Header Section: Title, User Info, and CTA */}
        <div className='bg-white rounded-3xl shadow-xl p-6 md:p-10 lg:p-12'>
          <div className='flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-6'>
            <div>
              <h1 className='text-4xl font-extrabold text-gray-900 leading-tight mb-2'>
                {material?.name}
              </h1>
              <div className='flex items-center gap-4 text-gray-600 mt-2'>
                <img
                  src={user?.profile_picture_url || 'https://placehold.co/100x100/E5E7EB/4B5563?text=User'}
                  alt="Uploader Profile"
                  className='w-12 h-12 rounded-full border-2 border-blue-500 p-0.5'
                />
                <div>
                  <a href={`/user/${user?.user_id}`} className='text-blue-600 hover:underline font-bold text-lg transition-colors duration-200'>
                    {user?.full_name || 'Unknown User'}
                  </a>
                  <p className='text-gray-500 text-sm flex items-center gap-1 mt-0.5'>
                    <DateRangeOutlinedIcon className='h-4 w-4' />
                    Uploaded on {material?.upload_date ? new Date(material.upload_date).toLocaleDateString() : 'Unknown Date'}
                  </p>
                </div>
              </div>
            </div>
            
            <div className='flex flex-col sm:flex-row gap-3 mt-4 lg:mt-0'>
              <button
                className='flex items-center gap-2 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105 shadow-xl
                         bg-gradient-to-r from-blue-500 to-indigo-600 focus:outline-none focus:ring-4 focus:ring-blue-300 w-full sm:w-auto justify-center'
                onClick={() => window.open(material?.file_url, '_blank')}
              >
                <FileDownloadOutlinedIcon className='-mt-[1px]' />
                Download
              </button>
              <button className='flex items-center gap-2 text-gray-700 bg-gray-100 hover:bg-gray-200 py-3 px-6 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300 shadow-md w-full sm:w-auto justify-center'>
                <BookmarkBorderOutlinedIcon />
                Save
              </button>
              <button className='flex items-center gap-2 text-gray-700 bg-gray-100 hover:bg-gray-200 py-3 px-6 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300 shadow-md w-full sm:w-auto justify-center'>
                <ShareOutlinedIcon />
                Share
              </button>
            </div>
          </div>

          {/* Rating Section */}
          <div className='flex items-center gap-4 mt-6'>
            <div className='flex items-center gap-2'>
              <span className='text-4xl font-extrabold text-gray-900'>{avgRating.toFixed(1)}</span>
              <div className='flex'>
                {Array.from({ length: 5 }, (_, index) => (
                  <StarIcon
                    key={index}
                    className={`${avgRating > index ? 'text-yellow-400' : 'text-gray-300'}`}
                  />
                ))}
              </div>
            </div>
            <p className='text-gray-500 text-sm'>
              {material?.rating_count ? `Based on ${material.rating_count} ratings` : 'No ratings yet'}
            </p>
          </div>
        </div>

        {/* Main Content Area: Tabs, Viewer, and Metadata Grid */}
        <div className='flex flex-col gap-8'>
          {/* Left Column (Viewer and Tabs) */}
          <div className=' bg-white rounded-3xl shadow-xl p-6'>
            <div className='flex items-center gap-6 border-b border-gray-200 mb-6'>
              <button
                className={`text-lg font-bold pb-3 transition-colors duration-200
                         ${currentView === 'content' ? 'text-blue-600 border-b-4 border-blue-600' : 'text-gray-500 hover:text-gray-800'}`}
                onClick={() => handleViewChange('content')}
              >
                Content
              </button>
              <button
                className={`text-lg font-bold pb-3 transition-colors duration-200
                         ${currentView === 'about' ? 'text-blue-600 border-b-4 border-blue-600' : 'text-gray-500 hover:text-gray-800'}`}
                onClick={() => handleViewChange('about')}
              >
                About
              </button>
            </div>
            
            {currentView === 'content' ? (
              <div className='w-full h-[80vh] bg-gray-100 rounded-2xl flex items-center justify-center p-4 relative'>
                <div 
					className='w-full h-full overflow-y-auto rounded-xl scrollbar-hide'
					onScroll={handleOnScroll}
					ref={scrollViewRef}
				>
				  {imagePages.length > 0 ? (
                    imagePages.map((page, index) => (
                      <div key={index} className='w-full overflow-x-auto'>
                        <img src={page.imageUrl} alt={`Page ${page.pageNumber}`} className='object-contain h-auto my-6 mx-auto rounded-xl shadow-xl' style={{ width: `${imageWidth === 0 ? '100%' : imageWidth}px`, maxWidth: 'none' }} />
                      </div>
                    ))
				  ) : (
                    <div className='w-full h-full flex flex-col items-center justify-center'>
                      <DescriptionOutlinedIcon className='text-gray-400 w-16 h-16 mb-4' />
                      <p className='text-gray-500 font-bold text-2xl'>PDF Preview Not Available</p>
                      <p className='text-gray-400 mt-2'>A full-featured, scrollable PDF viewer would go here.</p>
                    </div>
				  )}
                </div>

				<div className='absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-white rounded-full shadow-lg p-2 flex items-center gap-6'>
				  <button
					className='text-gray-500 hover:text-gray-800 transition-colors duration-200 cursor-pointer'
					onClick={handleZoomIn}
				  >
					<ZoomInOutlinedIcon />
				  </button>
				  <button
					className='text-gray-500 hover:text-gray-800 transition-colors duration-200 cursor-pointer'
					onClick={handleZoomOut}
				  >
					<ZoomOutOutlinedIcon />
				  </button>
				
				</div>
              </div>
            ) : (
              <div>
                <h2 className='text-xl font-bold text-gray-800 mb-2'>Info</h2>

				<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6'>
					<MetadataCard icon={<SchoolOutlinedIcon />} label='Subject' value={subject || 'Unknown'} />
					<MetadataCard icon={<DescriptionOutlinedIcon />} label='Type' value={material?.file_type || 'Unknown'} />
					<MetadataCard icon={<CloudDownloadOutlinedIcon />} label='Size' value={material?.size ? `${(material.size / 1024 / 1024).toFixed(2)} MB` : 'Unknown'} />
					<MetadataCard icon={<SubjectOutlinedIcon />} label='Pages' value={material?.num_page || 0} />
					<MetadataCard icon={<VisibilityOutlinedIcon />} label='Views' value={material?.view_count || 0} />
					<MetadataCard icon={<CloudDownloadOutlinedIcon />} label='Downloads' value={material?.download_count || 0} />
					<MetadataCard icon={<AttachMoneyOutlinedIcon />} label='Price' value={material?.price ? `$${material.price}` : 'Free'} isPaid={!!material?.price} />
				</div>

				<div className='border-b border-gray-200 my-10'></div>
                <h2 className='text-xl font-bold text-gray-800 mb-2'>Description</h2>
                <p className='text-gray-700 leading-relaxed'>{material?.description || 'No description available.'}</p>
              </div>
            )}
          </div>

          {/* Right Column (Metadata Grid and Interactive Rating) */}
          <div className='w-full flex-none flex flex-col'>

            {/* Interactive User Rating Card */}
            <div className='bg-white rounded-3xl shadow-2xl p-6 text-center'>
              <h3 className='text-lg font-bold text-gray-800 mb-2'>Rate this document</h3>
              <p className='text-sm text-gray-500 mb-4'>Your feedback helps others!</p>
              <div className='flex justify-center'>
                {renderInteractiveStars()}
              </div>
              <p className='text-sm text-gray-500 mt-2'>
                {userRating > 0 ? `You rated this ${userRating} stars!` : 'Click to rate'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MaterialViewPage;