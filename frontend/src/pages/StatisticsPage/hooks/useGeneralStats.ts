import { useState, useEffect} from "react";
import { fetchGeneralStats } from '@/services/statisticsService';

export const useGeneralStats = () => {
    const [generalStats, setGeneralStats] = useState({
        totalMaterials: 0,
        totalLessons: 0,
        totalUsers: 0,
        totalDownloads: 0,
    });

    useEffect(() => {
        async function loadGeneralStats() {
            const stats = await fetchGeneralStats();
            setGeneralStats(stats);
        }
        loadGeneralStats();
    }, []);

    return generalStats;
}