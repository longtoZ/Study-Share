import supabase from '../config/database.config.js';
import { TABLES } from '../constants/constant.js';

class Payment {
    static async createPaymentRecord(info) {
        if (info.file_url) {
            delete info.file_url; // Remove file_url before inserting
        }

        const { data, error } = await supabase
            .from(TABLES.PAYMENT)
            .insert([info])
            .single();

        if (error) {
            throw new Error(error.message);
        }

        return data;
    }

    static async updateStripeAccountId(user_id, stripe_account_id) {
        const { data, error } = await supabase
            .from(TABLES.USER)
            .update({ stripe_account_id })
            .eq('user_id', user_id)
            .single();

        if (error) {
            throw new Error(error.message);
        }

        return data;
    }

    static async checkMaterialPayment(user_id, material_id) {
        const { data, error } = await supabase
            .from(TABLES.PAYMENT)
            .select('*')
            .eq('buyer_id', user_id)
            .eq('material_id', material_id)
            .eq('status', 'paid')
            .maybeSingle();

        if (error) {
            throw new Error(error.message);
        }

        return data;
    }

    static async getPaymentsByUserId(user_id, filter) {
        console.log(user_id, filter);
        let query = supabase
            .rpc('get_payment_history')
            .select('*')
            .eq('buyer_id', user_id);

        if (filter.from) query = query.gte('created_date', filter.from);
        if (filter.to) query = query.lte('created_date', filter.to);

        if (filter.order === 'date') {
            query = query.order('created_date', { ascending: false });
        } else {
            query = query.order('amount', { ascending: filter.order === 'asc' });
        }

        const { data, error } = await query;

        if (error) {
            throw new Error(error.message);
        }

        return data;
    }

    static async getOrdersByUserId(user_id, filter) {
        let query = supabase
            .rpc('get_payment_history')
            .select('*')
            .eq('seller_id', user_id);

        if (filter.from) query = query.gte('created_date', filter.from);
        if (filter.to) query = query.lte('created_date', filter.to);

        if (filter.order === 'date') {
            query = query.order('created_date', { ascending: false });
        } else {
            query = query.order('amount', { ascending: filter.order === 'asc' });
        }

        const { data, error } = await query;

        if (error) {
            throw new Error(error.message);
        }

        return data;
    }

};

export default Payment;
