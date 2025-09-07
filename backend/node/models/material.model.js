import supabase from '../config/database.js';
import { TABLES, MAX_STAR_LEVEL, PDF_TO_WEBP_URL, DOCX_TO_WEBP_URL } from '../constants/constant.js';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

class Material {
    static async createMaterialData(info) {
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
            // const totalPages = await PDFUtils.getTotalPages(filePath);

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

            return {
                path: data.path,
                fullPath: data.fullPath,
                publicUrl: publicUrlData.publicUrl,
                // totalPages: totalPages
            };
        } catch (uploadError) {
            console.error('File upload error:', uploadError);
            if (fs.existsSync(file.path)) {
                fs.unlinkSync(file.path);
            }
            throw uploadError;
        }
    }

    static async createFilePagesUrl(storageFilename, file, fileType) {
        const fileBuffer = fs.readFileSync(file.path);

        const formData = new FormData();
        const blob = new Blob([fileBuffer], { type: file.mimetype });
        formData.append('file', blob, file.originalname);
        formData.append('storage_filename', storageFilename);

        try {
            const response = await fetch(fileType === 'pdf' ? PDF_TO_WEBP_URL : DOCX_TO_WEBP_URL, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                console.error('Failed to convert file to WebP');
            }

            const data = await response.json();
            console.log(data)
            return {
                filePagesUrl: data.public_links,
                totalPages: data.public_links[data.public_links.length - 1].page,
                content: data.content,
                usage: data.usage
            };
        } catch (error) {
            console.error('Error converting PDF to WebP:', error);
            throw error;
        } finally {
            fs.unlinkSync(file.path);
        }
    }

    static async createMaterialPagesData(material_id, public_links) {
        const { data, error } = await supabase
            .from(TABLES.MATERIAL_PAGE)
            .insert(public_links.map((link) => ({
                material_id: material_id,
                page: link.page,
                url: link.url,
            })));

        if (error) throw error;
        return data;
    }

    static async createSummaryRecord(user_id, material_id, content, usage) {
        const { data, error } = await supabase
            .from(TABLES.MATERIAL_SUMMARY)
            .insert([{
                summary_id: `${user_id}-${uuidv4()}`,
                material_id: material_id,
                content: content,
                prompt_token_count: usage.prompt_token_count,
                thoughts_token_count: usage.thoughts_token_count || 0,
                total_token_count: usage.total_token_count,
            }])
            .select()
            .single();
        
        if (error) throw error;
        return data;
    }

    static async createMaterialRating(material_id) {
        for (let i = 1; i <= MAX_STAR_LEVEL; i++) {
            const { data, error } = await supabase
                .from(TABLES.RATING)
                .insert([{
                    material_id: material_id,
                    star_level: i,
                    count: 0,
                }]);
            if (error) throw error;

            console.log(`Created rating for material ${material_id} with star level ${i}`);
        }
    }

    static async getMaterialById(material_id) {
        const { data, error } = await supabase
            .from(TABLES.MATERIAL)
            .select('*')
            .eq('material_id', material_id)
            .single();

        if (error && error.code !== 'PGRST116') throw error;

        delete data.file_url; // Remove file_url for security reasons
        return data;
    }

    static async getMaterialUrlById(material_id) {
        const { data, error } = await supabase
            .from(TABLES.MATERIAL)
            .select('file_url')
            .eq('material_id', material_id)
            .single();

        if (error && error.code !== 'PGRST116') throw error;

        return decodeURIComponent(JSON.parse(data.file_url).publicUrl);
    }

    static async getMaterialsByUserId(user_id, order, from, to) {
        const { data, error } = await supabase
            .rpc('get_materials_user_info')
            .select('*', { count: 'exact' })
            .eq('user_id', user_id)
            .order('upload_date', { ascending: order === 'oldest' })
            .range(from, to);

        if (error && error.code !== 'PGRST116') throw error;

        if (!data || data.length === 0) {
            return []; // No materials found for the user
        }
        
        return data;
    }

    static async countMaterial(user_id) {
        const { count, error } = await supabase
            .from(TABLES.MATERIAL)
            .select('*', { count: 'exact', head: true})
            .eq('user_id', user_id)
        
        if (count === 0) {
            return 0; // No materials available
        }
        
        if (error && error.code !== 'PGRST116') throw error;
        return count;
    }

    static async countLesson(user_id) {
        const { count, error } = await supabase
            .from(TABLES.LESSON)
            .select('*', { count: 'exact', head: true})
            .eq('user_id', user_id);
        
        if (count === 0) {
            return 0; // No lessons available
        }
        
        if (error && error.code !== 'PGRST116') throw error;
        return count;
    }

    static async countDownload(user_id) {
        const { data, error } = await supabase
            .from(TABLES.MATERIAL)
            .select('download_count')
            .eq('user_id', user_id);

        if (!data || data.length === 0) {
            return 0; // No downloads available
        }
        
        if (error && error.code !== 'PGRST116') throw error;

        const totalDownload = data.reduce((sum, row) => sum + row.download_count, 0);
        return totalDownload;
    }

    static async getAverageRating(user_id) {
        const { ratingData, ratingError } = await supabase
            .from(TABLES.MATERIAL)
            .select('rating_count')
            .eq('user_id', user_id);

        if (!ratingData || ratingData.length === 0) {
            return 0; // No ratings available
        }
        
        if (ratingError && ratingError.code !== 'PGRST116') throw ratingError;
        const ratingCount = ratingData.reduce((sum, row) => sum + row.rating_count, 0);

        const { totalRatingData, totalRatingError } = await supabase
            .from(TABLES.MATERIAL)
            .select('total_rating')
            .eq('user_id', user_id);
        
        if (totalRatingError && totalRatingError.code !== 'PGRST116') throw totalRatingError;
        const totalRating = totalRatingData.reduce((sum, row) => sum + row.total_rating, 0);

        return totalRating / (ratingCount || 1);
    }

    static async getMaterialPage(material_id, page) {
        const { data, error } = await supabase
            .from(TABLES.MATERIAL_PAGE)
            .select('*')
            .eq('material_id', material_id)
            .eq('page', page)
            .single();

        if (error && error.code !== 'PGRST116') throw error;
        return data;
    }

    static async updateMaterial(material_id, updatedData) {
        const allowed = ['name', 'description', 'subject_id', 'lesson_id'];
        const payload = Object.fromEntries(
            Object.entries(updatedData).filter(([k]) => allowed.includes(k))
        );

        const { data, error } = await supabase
            .from(TABLES.MATERIAL)
            .update(payload)
            .eq('material_id', material_id);

        if (error) throw error;
        return data;
    }

    static async searchMaterial(query, filters) {
        const { from, to, author: user_id, subject_id, lesson_id, sort_by, order } = filters;
        console.log('Search Query:', query);
        console.log('Search Filters:', filters);

        const databaseQuery = supabase
            .from(TABLES.MATERIAL)
            .select('*')
            .ilike('name', `%${query}%`)
            .gte('upload_date', from)
            .lte('upload_date', to)

        if (user_id) databaseQuery.eq('user_id', user_id);
        if (subject_id) databaseQuery.eq('subject_id', subject_id);
        if (lesson_id) databaseQuery.eq('lesson_id', lesson_id);

        const { data, error } = await databaseQuery
            .order(sort_by, { ascending: order === 'asc' });

        console.log('Search Material Data:', data);

        if (error) throw error;
        return data;
    }

    static async deleteMaterial(material_id) {
        const { data, error } = await supabase
            .from(TABLES.MATERIAL)
            .delete()
            .eq('material_id', material_id);
        
        if (error) throw error;
        return data;
    }
}

export default Material;