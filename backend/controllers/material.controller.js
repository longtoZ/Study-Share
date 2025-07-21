import MaterialService from "../services/material.service";

class MaterialController {
    static async upload(req, res) {
        const { material_id, name, description, subject_id, file_url, size, file_type, num_page, upload_date, download_count, total_rating, rating_count, view_count, is_paid, price, user_id, lesson_id } = req.body;
        const file = req.file;

        const info = {
            material_id,
            name,
            description,
            subject_id,
            file_url: '',
            size,
            file_type,
            num_page,
            upload_date: new Date(),
            download_count: 0,
            total_rating: 0,
            rating_count: 0,
            view_count: 0,
            is_paid: is_paid,
            price: price,
            user_id,
            lesson_id
        };

        try {
            const { material } = await MaterialService.uploadFile(info, file);
            res.status(201).json({ message: 'Material uploaded successfully', material });
        } catch (error) {
            console.error('Upload error:', error);
            res.status(500).json({ message: 'Internal server error during file upload.' });
        }
    }
}

export default MaterialController;