import supabase from '../config/database.js';
import { TABLES } from '../constants/constant.js';

class MaterialSummary {
    static async getSummaryByMaterialId(material_id) {
        const { data, error } = await supabase
            .from(TABLES.MATERIAL_SUMMARY)
            .select('*')
            .eq('material_id', material_id)
            .single();

        if (error && error.code !== 'PGRST116') throw error;
        console.log(data)

        return data;
    }
};

export default MaterialSummary;