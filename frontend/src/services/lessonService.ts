const ALL_MATERIALS_LESSON_ENDPOINT = import.meta.env.VITE_ALL_MATERIALS_LESSON_ENDPOINT;
const ADD_MATERIAL_LESSON_ENDPOINT = import.meta.env.VITE_ADD_MATERIAL_LESSON_ENDPOINT;

const retrieveAllMaterials = async (lessonId: string) => {
    try {
        const response = await fetch(ALL_MATERIALS_LESSON_ENDPOINT.replace('lesson-id', lessonId));
        if (!response.ok) {
            throw new Error('Failed to fetch materials');
        }
        const data = await response.json();
        return data.materials;
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