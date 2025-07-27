import Lesson from "../models/lesson.model.js";

class LessonController {
    static async getLessonsByUserId(req, res) {
        const { userId } = req.params;

        try {
            const lessons = Lesson.getLessonsByUserId(userId);
            res.status(200).json({ message: 'Lessons fetched successfully', lessons: Array.from(lessons) });
        } catch (error) {
            console.log('Error fetching lessons');
            res.status(500).json({ message: 'Internal server error while fetching lessons.'});
        }
    }
}

export default LessonController;