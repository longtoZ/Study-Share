import type { Statistic, Material, Lesson} from '@interfaces/userProfile'
import type { Subject } from '@interfaces/table';

const USER_PROFILE_ENDPOINT = import.meta.env.VITE_USER_PROFILE_ENDPOINT;
const USER_STATISTICS_ENDPOINT = import.meta.env.VITE_USER_STATISTICS_ENDPOINT;
const USER_MATERIALS_ENDPOINT = import.meta.env.VITE_USER_MATERIALS_ENDPOINT;
const USER_LESSONS_ENDPOINT = import.meta.env.VITE_USER_LESSONS_ENDPOINT;
const SUBJECTS_ENDPOINT = import.meta.env.VITE_GET_ALL_SUBJECTS_ENDPOINT;
const SIGNUP_ENDPOINT = import.meta.env.VITE_SIGNUP_ENDPOINT;
const GOOGLE_LOGIN_ENDPOINT = import.meta.env.VITE_GOOGLE_LOGIN_ENDPOINT;
const LOGIN_ENDPOINT = import.meta.env.VITE_LOGIN_ENDPOINT;
const CHECK_EMAIL_ENDPOINT = import.meta.env.VITE_CHECK_EMAIL_ENDPOINT;

const retrieveUserData = async (userId: string, requireEmail: boolean = false): Promise<any> => {
	try {
		const response = await fetch(`${USER_PROFILE_ENDPOINT}/${userId}${requireEmail ? '?require-email=true' : ''}`);
		if (!response.ok) {
			throw new Error('Failed to fetch user data');
		}
		const data = await response.json();
		return data.user;
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

const retrieveAllSubjects = async (): Promise<Subject[]> => {
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

const retrieveMaterials = async (userId: string, subjects: Subject[], materialOrder: "newest" | "oldest", range: { from: number, to: number }): Promise<Material[]> => {
	try {
		const response = await fetch(`${USER_MATERIALS_ENDPOINT}/${userId}?order=${materialOrder}&from=${range.from}&to=${range.to}`);
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

const retrieveLessons = async (userId: string, lessonOrder: "newest" | "oldest", range: { from: number, to: number }): Promise<Lesson[]> => {
	try {
		const response = await fetch(`${USER_LESSONS_ENDPOINT}/${userId}?order=${lessonOrder}&from=${range.from}&to=${range.to}`);
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

const updateUserProfile = async (authorId: string, updates: any): Promise<any> => {
	const token = localStorage.getItem('jwt_token');

	try {
		const response = await fetch(`${USER_PROFILE_ENDPOINT}/${authorId}`, {
			method: 'PUT',
			headers: {
				'Authorization': `Bearer ${token}`
			},
			body: updates
		});
		if (!response.ok) {
			throw new Error('Failed to update user profile');
		}

		const data = await response.json();
		return data;
	} catch (error) {
		console.error('Error updating user profile:', error);
		throw error;
	}
}

const deleteUserAccount = async (authorId: string, password: string): Promise<void> => {
	const token = localStorage.getItem('jwt_token');

	try {
		const response = await fetch(`${USER_PROFILE_ENDPOINT}/${authorId}`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${token}`
			},
			body: JSON.stringify({ password })
		});

		if (response.status === 401) {
			throw new Error('Incorrect password. Please try again.');
		} else if (!response.ok) {
			throw new Error((await response.json()).message);
		}
	} catch (error) {
		console.error('Error deleting user account:', error);
		throw error;
	}
}

const signupUser = async (formData: any): Promise<any> => {
	try {
		const response = await fetch(SIGNUP_ENDPOINT, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(formData)
		});

		if (!response.ok) {
			throw new Error((await response.json()).message);
		}

		const data = await response.json();
		return data;
	} catch (error) {
		console.error('Error signing up:', error);
		throw error;
	}
}

const loginUser = async (formData: any): Promise<any> => {
	try {
		const response = await fetch(LOGIN_ENDPOINT, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(formData)
		});

		if (!response.ok) {
			throw new Error((await response.json()).message);
		}

		const data = await response.json();
		return data;
	} catch (error) {
		console.error('Error logging in:', error);
		throw error;
	}
}

const googleLogin = async (): Promise<any> => {
	try {
		window.location.href = 'http://localhost:3000/auth/google';
	} catch (error) {
		console.error('Error logging in with Google:', error);
		throw error;
	}
}

const checkEmailExists = async (email: string): Promise<boolean> => {
	try {
		const response = await fetch(`${CHECK_EMAIL_ENDPOINT}?email=${encodeURIComponent(email)}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		});

		if (!response.ok) {
			throw new Error((await response.json()).message);
		}

		const data = await response.json();
		return data.exists;
	} catch (error) {
		console.error('Error checking email existence:', error);
		throw error;
	}
}

export { retrieveAllSubjects, retrieveUserData, retrieveMaterials, retrieveLessons, calculateStatistics, updateUserProfile, deleteUserAccount, signupUser, loginUser, googleLogin, checkEmailExists };