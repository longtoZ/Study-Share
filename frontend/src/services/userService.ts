import type { User, Statistic, Material, Lesson} from '@interfaces/userProfile'

const USER_PROFILE_ENDPOINT = import.meta.env.VITE_USER_PROFILE_ENDPOINT;
const USER_STATISTICS_ENDPOINT = import.meta.env.VITE_USER_STATISTICS_ENDPOINT;
const USER_MATERIALS_ENDPOINT = import.meta.env.VITE_USER_MATERIALS_ENDPOINT;
const USER_LESSONS_ENDPOINT = import.meta.env.VITE_USER_LESSONS_ENDPOINT;
const SUBJECTS_ENDPOINT = import.meta.env.VITE_GET_ALL_SUBJECTS_ENDPOINT;

const retrieveUserData = async (userId: string): Promise<User> => {
	try {
		const response = await fetch(`${USER_PROFILE_ENDPOINT}/${userId}`);
		if (!response.ok) {
			throw new Error('Failed to fetch user data');
		}
		const data = await response.json();
		const user = data.user;
		return user;
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
			total_materials: statistics.total_materials,
			total_lessons: statistics.total_lessons,
			total_downloads: statistics.total_downloads,
			average_rating: statistics.average_rating
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

const retrieveMaterials = async (userId: string, subjects: any[]): Promise<Material[]> => {
	try {
		const response = await fetch(`${USER_MATERIALS_ENDPOINT}/${userId}`);
		if (!response.ok) {
			throw new Error('Failed to fetch user materials');
		}
		const data = await response.json();
		return data.materials.map((material: any) => ({
			material_id: material.material_id,
			name: material.name,
			description: material.description,
			subject: subjects.find((subject) => subject.subject_id === material.subject_id)?.name || 'Unknown',
			upload_date: material.upload_date,
			download_count: material.download_count,
			rating: material.total_rating / (material.rating_count || 1), // Avoid division by zero
			file_type: material.file_type
		}));
	} catch (error) {
		console.error('Error fetching user materials:', error);
		throw error;
	}
}

const retriveLessons = async (userId: string, lessonOrder: "newest" | "oldest"): Promise<Lesson[]> => {
	try {
		const response = await fetch(`${USER_LESSONS_ENDPOINT}/${userId}?order=${lessonOrder}`);
		if (!response.ok) {
			throw new Error('Failed to fetch user lessons');
		}
		const data = await response.json();
		return data.lessons.map((lesson: any) => ({
			lesson_id: lesson.lesson_id,
			name: lesson.name,
			description: lesson.description,
			created_date: lesson.created_date,
			material_count: lesson.material_count,
			is_public: lesson.is_public
		}));
	} catch (error) {
		console.error('Error fetching user lessons:', error);
		throw error;
	}
}

export { retrieveAllSubjects, retrieveUserData, retrieveMaterials, retriveLessons, calculateStatistics};