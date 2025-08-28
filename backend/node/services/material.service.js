import Material from '../models/material.model.js';
import fs from 'fs';
import path from 'path';
import { convert } from 'pdf-poppler';
import { TEMP_IMAGE_PATH } from '../constants/constant.js';
import PDFUtils from '../utils/pdf.util.js';

class MaterialService {
    static async uploadFile(info, file) {
        // Create material main file
        const fileUrl = await Material.createFileUrl(info.user_id, file);

        info.num_page = fileUrl.totalPages; // Set the number of pages from the uploaded PDF

        delete fileUrl.totalPages;
        info.file_url = fileUrl;
        const newMaterial = await Material.createMaterialData(info);

        // Create material pages
        const filePagesUrl = await Material.createFilePagesUrl(info.material_id, file, info.file_type);
        await Material.createMaterialPagesData(info.material_id, filePagesUrl);
        
        // Create initial ratings for the new material
        await Material.createMaterialRating(info.material_id);
        
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

        const filePath = JSON.parse(material.file_url).path;
        const tempFilePath = await Material.downloadMaterial(filePath);
        console.log('Temporary file path:', tempFilePath);

        if (!fs.existsSync(tempFilePath)) {
            throw new Error('File not found');
        }
        
        const out_prefix = path.basename(tempFilePath, path.extname(tempFilePath));
        const out_dir = path.join(TEMP_IMAGE_PATH, out_prefix);

        // Ensure the output directory exists
        if (!fs.existsSync(out_dir)) {
            fs.mkdirSync(out_dir, { recursive: true });
        }

        const matchedFiles = PDFUtils.checkFileExistsWithRegex(out_dir, `${out_prefix}-.*${page}.png`);
        
        // Check if the image already exists
        if (matchedFiles.length > 0) {
            const imageFilePath = matchedFiles[0];
            console.log('Image already exists:', imageFilePath);
            return imageFilePath;
        }

        const options = {
            format: 'png',
            out_dir: out_dir,
            out_prefix: out_prefix,
            page: page,
            scale: 2048,
        }

        try {
            const result = await convert(tempFilePath, options);
            console.log('PDF converted to image:', result);
            
            // if (!fs.existsSync(imageFilePath)) {
            //     throw new Error('Converted image not found');
            // }

            return imageFilePath;

        } catch (error) {
            console.error('Error converting PDF to image:', error);
            throw new Error('Failed to convert PDF to image');
        }
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