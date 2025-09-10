import supabase from "../config/database.js";
import { TABLES } from "../constants/constant.js";
import cron from 'node-cron';

class JobManager {
    constructor() {
        // Schedule the job to run every 2 minutes
        this.cronExpression = '*/2 * * * *';

        this.jobs = new Map();
    }

    startJob(email) {
        if (this.jobs.has(email)) {
            console.log(`Job for email: ${email} is already running.`);
            return;
        }

        const job = cron.schedule(this.cronExpression, async () => {
            const now = new Date();

            const { data, error } = await supabase
                .from(TABLES.USER)
                .select('email, created_date, is_verfied')
                .eq('email', email)
                .eq('is_verfied', false)
                .lt('created_date', new Date(now.getTime() - 1000 * 60 * 2)) // 2 minutes ago
                .maybeSingle();
            
            if (error) {
                console.error('Error fetching unverified account:', error);
                return;
            }

            if (!data) {
                console.log('The account is verified or does not exist, no action taken.');
                return;
            }

            const { email } = data;

            // Delete the user account
            const { error: deleteError } = await supabase
                .from(TABLES.USER)
                .delete()
                .eq('email', email);

            if (deleteError) {
                console.error(`Error deleting unverified account ${email}:`, deleteError);
            } else {
                console.log(`Successfully deleted unverified account ${email}`);
            }
        });

        this.jobs.set(email, job);
        job.start();
        console.log(`Started job for email: ${email}`);
    }

    stopJob(email) {
        if (this.jobs.has(email)) {
            const job = this.jobs.get(email);
            job.stop();
            this.jobs.delete(email);
            console.log(`Stopped and removed job for email: ${email}`);
        } else {
            console.log(`No job found for email: ${email}`);
        }
    }

    stopAllJobs() {
        for (const [email, job] of this.jobs) {
            job.stop();
            console.log(`Stopped job for email: ${email}`);
        }
    }
}

export default JobManager;
