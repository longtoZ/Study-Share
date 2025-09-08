import Lesson from "../models/lesson.model.js";
import LessonService from "../services/lesson.service.js";

class LessonController {
    static async getLessonsByUserId(req, res) {
        const { userId } = req.params;
        const { order, from, to } = req.query;

        try {
            const lessons = await Lesson.getLessonsByUserId(userId, order, from, to);
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
        const { order } = req.query;

        try {
            const data = await Lesson.getAllMaterialsByLessonId(lessonId, order);
            res.status(200).json({ message: 'Materials fetched successfully', ...data });
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

    static async getLessonById(req, res) {
        const { lessonId } = req.params;

        try {
            const lesson = await Lesson.getLessonById(lessonId);
            res.status(200).json({ message: 'Lesson fetched successfully', lesson });
        } catch (error) {
            console.error('Error fetching lesson:', error);
            res.status(500).json({ message: 'Internal server error while fetching lesson.' });
        }
    }

    static async updateLesson(req, res) {
        const { lessonId } = req.params;
        const userId = req.user.id;
        const { authorId, updatedData } = req.body;

        if (authorId && userId !== authorId) {
            return res.status(403).json({ message: 'Forbidden: You are not the author of this lesson.' });
        }

        try {
            const lesson = await Lesson.updateLesson(lessonId, updatedData);
            res.status(200).json({ message: 'Lesson updated successfully', lesson });
        } catch (error) {
            console.error('Error updating lesson:', error);
            res.status(500).json({ message: 'Internal server error while updating lesson.' });
        }
    }

    static async searchLesson(req, res) {
        const { query } = req.query;
        const { filters } = req.body;

        try {
            const lessons = await LessonService.searchLesson(query, filters);
            res.status(200).json({ message: 'Lessons fetched successfully', lessons });
        } catch (error) {
            console.error('Error fetching lessons:', error);
            res.status(500).json({ message: 'Internal server error while fetching lessons.' });
        }
    }

    static async deleteLesson(req, res) {
        const { lessonId } = req.params;
        const userId = req.user.id;
        const { authorId } = req.body;

        if (authorId && userId !== authorId) {
            return res.status(403).json({ message: 'Forbidden: You are not the author of this lesson.' });
        }

        try {
            const lesson = await Lesson.deleteLesson(lessonId);
            res.status(200).json({ message: 'Lesson deleted successfully', lesson });
        } catch (error) {
            console.error('Error deleting lesson:', error);
            res.status(500).json({ message: 'Internal server error while deleting lesson.' });
        }
    }
}

export default LessonController;