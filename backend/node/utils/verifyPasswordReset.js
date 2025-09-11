import supabase from "../config/database.js";
import { TABLES } from "../constants/constant.js";
import cron from 'node-cron';

class PasswordResetJobManager {
    constructor() {
        // Schedule the job to run every 2 minutes
        this.cronExpression = '*/2 * * * *';

        this.jobs = new Map();
    }

    startJob(user_id) {
        if (this.jobs.has(user_id)) {
            console.log(`Job for user_id: ${user_id} is already running.`);
            return;
        }

        const job = cron.schedule(this.cronExpression, async (user_id = user_id) => {
            const now = new Date();

            const { data, error } = await supabase
                .from(TABLES.USER)
                .select('user_id, created_date, verification_code')
                .eq('user_id', user_id)
                .single();
            
            if (error) {
                console.error('Error fetching unverified account:', error);
                return;
            }

            if (!data) {
                console.log('The account does not exist, no action taken.');
                return;
            }

            const { created_date, verification_code } = data;

            if (verification_code && (now - new Date(created_date)) > 2 * 60 * 1000) {
                // Clear the verification code
                const { error: updateError } = await supabase
                    .from(TABLES.USER)
                    .update({ verification_code: null })
                    .eq('user_id', user_id);
                
                if (updateError) {
                    console.error(`Error clearing verification code for user_id ${user_id}:`, updateError);
                } else {
                    console.log(`The verification code for user_id ${user_id} has expired and been cleared.`);
                }

                // Stop the job since it's no longer needed
                this.stopJob(user_id);
            }
        });

        this.jobs.set(user_id, job);
        job.start();
        console.log(`Started job for user_id: ${user_id}`);

    }

    stopJob(user_id) {
        if (this.jobs.has(user_id)) {
            const job = this.jobs.get(user_id);
            job.stop();
            this.jobs.delete(user_id);
            console.log(`Stopped and removed job for user_id: ${user_id}`);
        } else {
            console.log(`No job found for user_id: ${user_id}`);
        }
    }

    stopAllJobs() {
        for (const user_id of this.jobs.keys()) {
            this.stopJob(user_id);
        }
    }
}

export default PasswordResetJobManager;
