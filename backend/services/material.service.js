import Material from '../models/material.model.js';

class MaterialService {
    static async uploadFile(info, file) {
        const publicFileUrl = await Material.createFileUrl(info.user_id, file);

        info.file_url = publicFileUrl;
        const newMaterial = await Material.createData(info);

        return { material: newMaterial };
    }

    static async getStatistics(user_id) {
        const totalMaterials = await Material.countMaterial(user_id);
        const totalLessons = await Material.countLesson(user_id);
        const totalDownload = await Material.countDownload(user_id);
        const averageRating = await Material.getAverageRating(user_id);

        return { 
            total_materials: totalMaterials, 
            total_lessons: totalLessons, 
            total_downloads: totalDownload, 
            average_rating: averageRating 
        };
    }
}

export default MaterialService;