import Material from '../models/material.model.js';

class MaterialService {
    static async uploadFile(info, file) {
        // Create material main file
        const fileUrl = await Material.createFileUrl(info.user_id, file);
        console.log(fileUrl);

        info.num_page = fileUrl.totalPages; // Set the number of pages from the uploaded PDF

        delete fileUrl.totalPages;
        info.file_url = fileUrl;

        const data = await Material.createMaterialRecord(info, file);
        return data;
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

    static async getMaterialPage(material_id, page) {
        const materialPage = await Material.getMaterialPage(material_id, page);

        if (!materialPage) {
            throw new Error('Material page not found');
        }

        const response = await fetch(materialPage.url);
        if (!response.ok) {
            throw new Error('Failed to fetch material page');
        }
        const buffer = await response.arrayBuffer();

        return {
            contentType: response.headers.get("content-type"),
            imgBuffer: Buffer.from(buffer)
        };
    }

    static async searchMaterial(query, filters) {
        const { from, to, author, subject_id, lesson_id, sort_by, order } = filters
        const adjustedQuery = {
            from,
            to,
            author: author === '' ? undefined : author,
            subject_id: subject_id === '' ? undefined : subject_id,
            lesson_id: lesson_id === '' ? undefined : lesson_id,
            sort_by,
            order
        }

        const results = await Material.searchMaterial(query, adjustedQuery);
        return results;
    }

}

export default MaterialService;