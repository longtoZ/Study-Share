import supabase from '../config/database.js';
import { TABLES } from '../constants/constant.js';
import fs from 'fs';
import path from 'path';

class Material {
    static async createData(info) {
        const { data, error } = await supabase
            .from(TABLES.MATERIAL)
            .insert([{
                material_id: info.material_id,
                name: info.name,
                description: info.description,
                subject_id: info.subject_id,
                file_url: info.file_url,
                size: info.size,
                file_type: info.file_type,
                num_page: info.num_page,
                upload_date: info.upload_date,
                download_count: info.download_count,
                total_rating: info.total_rating,
                rating_count: info.rating_count,
                view_count: info.view_count,
                is_paid: info.is_paid,
                price: info.price,
                user_id: info.user_id,
                lesson_id: info.lesson_id
            }])
            .select()
            .single();
        
        if (error) throw error;
        return data;
    }

    static async createFileUrl(user_id, file) {
        if (!file) {
            throw new Error('No file provided!');
        }

        const bucketName = process.env.SUPABASE_BUCKET;

        const fileExtension = path.extname(file.originalname);
        const storageFileName = `${user_id}-${Date.now()}${fileExtension}`;
        const filePath = path.join('uploads', storageFileName);

        try {
            const fileBuffer = fs.readFileSync(file.path);

            const { data, error } = await supabase.storage
                .from(bucketName)
                .upload(filePath, fileBuffer, {
                    contentType: file.mimetype,
                    upsert: false
                });
            
            if (error) {
                console.error('File upload error:', error);
            }
            
            const { data: publicUrlData } = supabase.storage
                .from(bucketName)
                .getPublicUrl(filePath);

            fs.unlinkSync(file.path);

            return {
                path: data.path,
                fullPath: data.fullPath,
                publicUrl: publicUrlData.publicUrl
            };
        } catch (uploadError) {
            console.error('File upload error:', uploadError);
            if (fs.existsSync(file.path)) {
                fs.unlinkSync(file.path);
            }
            throw uploadError;
        }
    }

    static async findByID(material_id) {
        const { data, error } = await supabase
            .from(TABLES.MATERIAL)
            .select('*')
            .eq('material_id', material_id)
            .single();

        if (error && error.code !== 'PGRST116') throw error;
        return data;
    }
}

export default Material;