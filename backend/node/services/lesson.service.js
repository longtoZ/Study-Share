import Lesson from "../models/lesson.model.js";

class LessonService {
    static async searchLesson(query, filters) {
        const { from, to, author, sort_by, order } = filters;

        const adjustedQuery = {
            from,
            to,
            author: author === '' ? undefined : author,
            sort_by,
            order
        };

        return Lesson.searchLesson(query, adjustedQuery);
    }
}

export default LessonService;