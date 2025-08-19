import Lesson from "../models/lesson.model.js";

class LessonService {
    static async searchLesson(query, filters) {
        return Lesson.searchLesson(query, filters);
    }
}

export default LessonService;