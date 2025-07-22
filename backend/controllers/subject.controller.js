import Subject from "../models/subject.model.js";

class SubjectController {
    static async getAllSubject(req, res) {
        try {
            const subjects = await Subject.getAll();
            res.status(201).json({ message: 'Subjects retrieved successfully', subjects });
        } catch (error) {
            res.status(500).json({ message: 'Internal server error during subjects retrieving' });
        }
    } 
}

export default SubjectController;