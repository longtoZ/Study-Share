import type { User, Statistic, Material, Lesson} from '@interfaces/userProfile'

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

export { retrieveAllSubjects, retrieveUserData, retrieveMaterials, retriveLessons, calculateStatistics};