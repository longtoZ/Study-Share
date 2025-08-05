import Material from '../models/material.model.js';
import fs from 'fs';
import { convert } from 'pdf-poppler';
import { TEMP_IMAGE_PATH } from '../constants/constant.js';

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

    static async getMaterialByID(material_id, page) {
        const material = await Material.getMaterialById(material_id);

        if (!material) {
            throw new Error('Material not found');
        }

        const filePath = material.file_url.path;
        const tempFilePath = await Material.downloadMaterial(filePath);

        if (!fs.existsSync(tempFilePath)) {
            throw new Error('File not found');
        }
        
        const options = {
            format: 'png',
            out_dir: TEMP_IMAGE_PATH,
            out_prefix: filePath.substring(filePath.lastIndexOf('/') + 1, filePath.lastIndexOf('.')),
            page: page,
            scale: 2048,
        }

        try {
            const result = await convert(tempFilePath, options);

            if (!await fs.promises.access(result[0])) {
                throw new Error('Converted file not found');
            }

            // Return the path of the converted image
            return result[0];
            
        } catch (error) {
            console.error('Error converting PDF to image:', error);
            throw new Error('Failed to convert PDF to image');
        }
    }

}

export default MaterialService;