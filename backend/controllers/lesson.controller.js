import Lesson from "../models/lesson.model.js";

class LessonController {
    static async getLessonsByUserId(req, res) {
        const { userId } = req.params;
        const { order } = req.query;

        try {
            const lessons = await Lesson.getLessonsByUserId(userId, order);
            res.status(200).json({ message: 'Lessons fetched successfully', lessons: lessons });
        } catch (error) {
            console.log('Error fetching lessons');
            res.status(500).json({ message: 'Internal server error while fetching lessons.'});
        }
    }

    static async createLesson(req, res) {
        const lessonData = req.body;

        try {
            const newLesson = await Lesson.createLesson(lessonData);
            res.status(201).json({ message: 'Lesson created successfully', lesson: newLesson });
        } catch (error) {
            console.log('Error creating lesson:', error);
            res.status(500).json({ message: 'Internal server error while creating lesson.' });
        }
    }

    static async getAllMaterialsByLessonId(req, res) {
        const { lessonId } = req.params;

        try {
            const materials = await Lesson.getAllMaterialsByLessonId(lessonId);
            res.status(200).json({ message: 'Materials fetched successfully', materials });
        } catch (error) {
            console.error('Error fetching materials:', error);
            res.status(500).json({ message: 'Internal server error while fetching materials.' });
        }
    }

    static async addMaterialToLesson(req, res) {
        const { lessonId } = req.params;
        const materialId = req.query['material-id'];

        try {
            const result = await Lesson.addMaterialToLesson(lessonId, materialId);
            res.status(200).json({ message: 'Material added to lesson successfully', result });
        } catch (error) {
            console.error('Error adding material to lesson:', error);
            res.status(500).json({ message: 'Internal server error while adding material to lesson.' });
        }
    }
}

export default LessonController;