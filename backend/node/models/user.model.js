import supabase from '../config/database.js';
import { TABLES } from '../constants/constant.js';
import fs from 'fs';
import path from 'path';

class User {
    static async create(info) {
        const { data, error } = await supabase
            .from(TABLES.USER)
            .insert([{
                user_id: info.user_id,
                email: info.email,
                full_name: info.full_name,
                gender: info.gender,
                bio: info.bio,
                profile_picture_url: info.profile_picture_url,
                date_of_birth: info.date_of_birth,
                address: info.address,
                password_hash: info.password_hash,
                created_date: info.created_date,
                last_login: info.last_login,
                is_admin: info.is_admin
            }])
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    static async updateInfo(user_id, metadata) {
        const { data, error } = await supabase
            .from(TABLES.USER)
            .update(metadata)
            .eq('user_id', user_id)
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    static async findByID(user_id) {
        const { data, error } = await supabase
            .from(TABLES.USER)
            .select('user_id, full_name, gender, bio, profile_picture_url, date_of_birth, address, background_image_url')
            .eq('user_id', user_id)
            .single();

        if (error && error.code !== 'PGRST116') throw error;
        return data;
    }

    static async findByEmail(email) {
        const { data, error } = await supabase
            .from(TABLES.USER)
            .select('*')
            .eq('email', email)
            .single();

        if (error && error.code !== 'PGRST116') throw error;
        return data;
    }

    static async updateImage(metadata, profilePictureFile, backgroundImageFile) {
        console.log(metadata, profilePictureFile, backgroundImageFile);
        const bucketName = process.env.SUPABASE_BUCKET;

        if (profilePictureFile) {
            const profilePictureUrl = metadata.profile_picture_url;

            // Find the file from bucket to delete
            if (profilePictureUrl) {
                const { data, error } = await supabase
                    .storage
                    .from(bucketName)
                    .remove([profilePictureUrl]);

                if (error) throw error;
            }

            // Upload the new image file
            if (profilePictureFile) {
                const fileExtension = path.extname(profilePictureFile.originalname);
                const fileBuffer = fs.readFileSync(profilePictureFile.path);
                const filePath = `profile_pictures/${metadata.user_id}${fileExtension}`;

                const { data, error } = await supabase
                    .storage
                    .from(bucketName)
                    .upload(filePath, fileBuffer);

                if (error) throw error;

                const { data: publicUrlData } = supabase
                    .storage
                    .from(bucketName)
                    .getPublicUrl(filePath);

                if (publicUrlData) {
                    metadata.profile_picture_url = publicUrlData.publicUrl;
                }

                fs.unlinkSync(profilePictureFile.path);
            }
        }

        if (backgroundImageFile) {
            const backgroundImageUrl = metadata.background_image_url;

            if (backgroundImageUrl) {
                const { data, error } = await supabase
                    .storage
                    .from(bucketName)
                    .remove([backgroundImageUrl]);

                if (error) throw error;
            }

            // Upload the new image file
            if (backgroundImageFile) {
                const fileExtension = path.extname(backgroundImageFile.originalname);
                const fileBuffer = fs.readFileSync(backgroundImageFile.path);
                const filePath = `background_images/${metadata.user_id}${fileExtension}`;

                const { data, error } = await supabase
                    .storage
                    .from(bucketName)
                    .upload(filePath, fileBuffer);

                if (error) throw error;

                const { data: publicUrlData } = supabase
                    .storage
                    .from(bucketName)
                    .getPublicUrl(filePath);

                if (publicUrlData) {
                    metadata.background_image_url = publicUrlData.publicUrl;
                }

                fs.unlinkSync(backgroundImageFile.path);
            }
        }
    }
}

export default User;