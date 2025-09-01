import supabase from '../config/database.js';
import { TABLES } from '../constants/constant.js';

class Statistics {
    static async getTotalMaterials() {
        const { count, error } = await supabase
            .from(TABLES.MATERIAL)
            .select('material_id', { count: 'exact', head: true });

        if (error) {
            throw new Error('Failed to fetch total materials');
        }

        return count;
    }

    static async getTotalLessons() {
        const { count, error } = await supabase
            .from(TABLES.LESSON)
            .select('lesson_id', { count: 'exact', head: true });

        if (error) {
            throw new Error('Failed to fetch total lessons');
        }

        return count;
    }

    static async getTotalUsers() {
        const { count, error } = await supabase
            .from(TABLES.USER)
            .select('user_id', { count: 'exact', head: true });

        if (error) {
            throw new Error('Failed to fetch total users');
        }

        return count;
    }

    static async getTotalDownloads() {
        const { data, error } = await supabase
            .from(TABLES.MATERIAL)
            .select('download_count');

        if (error) {
            throw new Error('Failed to fetch total downloads');
        }

        return data ? data.reduce((acc, item) => acc + item.download_count, 0) : 0;
    }

    static async getMostViewedMaterials(from, to) {
        const { data, error } = await supabase
            .from(TABLES.MATERIAL)
            .select('material_id, name, upload_date, download_count, view_count')
            .gte('upload_date', from)
            .lte('upload_date', to)
            .order('view_count', { ascending: false })
            .limit(10);

        if (error) {
            console.log(error);
            throw new Error('Failed to fetch most viewed materials', error);
        }

        return data || [];
    }

    static async getMostDownloadedMaterials(from, to) {
        const { data, error } = await supabase
            .from(TABLES.MATERIAL)
            .select('material_id, name, upload_date, download_count, view_count')
            .gte('upload_date', from)
            .lte('upload_date', to)
            .order('download_count', { ascending: false })
            .limit(10);
        
        if (error) {
            console.log(error);
            throw new Error('Failed to fetch most downloaded materials', error);
        }

        return data || [];
    }

    static async getTopContributors() {
        const { data, error } = await supabase
            .rpc('get_top_contributors')
            .select('*')
            .limit(10);

        if (error) {
            console.log(error);
            throw new Error('Failed to fetch top contributors');
        }

        return data || [];
    }
};

export default Statistics