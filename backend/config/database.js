import env from 'dotenv';
import { createClient } from '@supabase/supabase-js';

env.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRole = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceRole) {
    console.error('Supabase url or serivce role is missing.');
}

const supabase = createClient(supabaseUrl, supabaseServiceRole);
const { user, error } = await supabase.auth.getUser();
if (error || !user) {
  console.error('User not authenticated');
}

export default supabase;