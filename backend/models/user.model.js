import supabase from '../config/database.js';
import { TABLES } from '../constants/constant.js';
import env from 'dotenv';

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

    static async findByID(user_id) {
        const { data, error } = await supabase
            .from(TABLES.USER)
            .select('*')
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
}

export default User;