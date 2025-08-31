import supabase from '../config/database.js';
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
};

export default Payment;
