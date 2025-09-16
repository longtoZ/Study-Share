import type { MaterialExtended, LessonExtended } from "@/interfaces/userProfile.d";

const storeMaterials = (materials: MaterialExtended[]) => {
    localStorage.setItem('materials', JSON.stringify(materials.map(material => ({
        id: material.material_id,
        name: material.name,
        url: `/material/${material.material_id}`
    }))));

}

const storeLessons = (lessons: LessonExtended[]) => {
    localStorage.setItem('lessons', JSON.stringify(lessons.map(lesson => ({
        id: lesson.lesson_id,
        name: lesson.name,
        url: `/lesson/${lesson.lesson_id}`
    }))));
}

const getStoredMaterials = (): { id: string, name: string; url: string }[] => {
    const materials = localStorage.getItem('materials');
    return materials ? JSON.parse(materials) : [];
}

const getStoredLessons = (): { id: string, name: string; url: string }[] => {
    const lessons = localStorage.getItem('lessons');
    return lessons ? JSON.parse(lessons) : [];
}

export { storeMaterials, storeLessons, getStoredMaterials, getStoredLessons };