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

    static async getSubjectById(req, res) {
        const { subject_id } = req.params;
        try {
            const subject = await Subject.getById(subject_id);
            if (!subject) {
                return res.status(404).json({ message: 'Subject not found' });
            }
            res.status(200).json({ message: 'Subject retrieved successfully', subject });
        } catch (error) {
            if (error.code === 'PGRST116') {
                return res.status(404).json({ message: 'Subject not found' });
            }
            res.status(500).json({ message: 'Internal server error during subject retrieving' });
        }
    }
}

export default SubjectController;