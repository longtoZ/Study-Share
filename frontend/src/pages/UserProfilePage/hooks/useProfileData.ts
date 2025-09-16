import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom';

import type { User, MaterialExtended, LessonExtended } from '@interfaces/userProfile.d';
import { retrieveMaterials, retrieveUserData, retrieveLessons, calculateStatistics} from '@services/userService';

export const useProfileData = () => {
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

    return { user, materials, lessons, isMaterialsLoading, isLessonsLoading };
}