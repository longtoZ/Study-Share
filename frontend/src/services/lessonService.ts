import type { Subject } from "@/interfaces/table";

const ALL_MATERIALS_LESSON_ENDPOINT = import.meta.env.VITE_ALL_MATERIALS_LESSON_ENDPOINT;
const ADD_MATERIAL_LESSON_ENDPOINT = import.meta.env.VITE_ADD_MATERIAL_LESSON_ENDPOINT;
const GET_LESSON_ENDPOINT = import.meta.env.VITE_GET_LESSON_ENDPOINT;
const SEARCH_LESSON_ENDPOINT = import.meta.env.VITE_SEARCH_LESSON_ENDPOINT;

const retrieveAllMaterials = async (lessonId: string, subjects: Subject[], order: "newest" | "oldest") => {
    try {
        const response = await fetch(`${ALL_MATERIALS_LESSON_ENDPOINT.replace('lesson-id', lessonId)}?order=${order}`);
        if (!response.ok) {
            throw new Error('Failed to fetch materials');
        }
        const data = await response.json();
		return { materials: 
            data.materials.map((material: any) => ({
			material_id: material.material_id,
			name: material.name,
			description: material.description,
			subject: subjects.find((subject) => subject.subject_id === material.subject_id)?.name || 'Unknown',
			upload_date: material.upload_date,
			download_count: material.download_count,
			rating: material.total_rating / (material.rating_count || 1), // Avoid division by zero
			file_type: material.file_type
		})), authorId: data.authorId };
    } catch (error) {
        console.error('Error fetching materials:', error);
    }
};

const addMaterialToLesson = async (lessonId: string, materialId: string) => {
    try {
        const response = await fetch(`${ADD_MATERIAL_LESSON_ENDPOINT.replace('lesson-id', lessonId)}?material-id=${materialId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ lessonId, materialId }),
        });
        if (!response.ok) {
            throw new Error('Failed to add material to lesson');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error adding material to lesson:', error);
    }
}

export { retrieveAllMaterials, addMaterialToLesson };
 
// New: get and update a single lesson
const getLesson = async (lessonId: string) => {
    console.log('Fetching lesson with ID:', lessonId);
    const url = GET_LESSON_ENDPOINT.replace('lesson-id', lessonId);
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Failed to fetch lesson');
        }
        const data = await response.json();
        return data.lesson;
    } catch (error) {
        console.error('Error fetching lesson:', error);
    }
    return null;
}

const updateLesson = async (lessonId: string, authorId: string, updatedData: any) => {
    console.log('Updating lesson with ID:', lessonId);
    const url = GET_LESSON_ENDPOINT.replace('lesson-id', lessonId);
    const token = localStorage.getItem('jwt_token') || '';
    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ updatedData, authorId }),
        });
        if (!response.ok) {
            throw new Error('Failed to update lesson');
        }
        const data = await response.json();
        return data.lesson;
    } catch (error) {
        console.error('Error updating lesson:', error);
    }
    return null;
}

const searchLesson = async (query: string, filters: any) => {
    console.log('Searching lessons with query:', query, 'and filters:', filters);

    try {
        const response = await fetch(`${SEARCH_LESSON_ENDPOINT}?query=${encodeURIComponent(query)}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ filters })
        });
        if (!response.ok) {
            throw new Error('Failed to search lessons');
        }

        const data = await response.json();
        return data.lessons;
    } catch (error) {
        console.error('Error searching lessons:', error);
    }

    return [];
}

export { getLesson, updateLesson, searchLesson };