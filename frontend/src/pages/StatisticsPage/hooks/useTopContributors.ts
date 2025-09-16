import { useState, useEffect } from "react";
import { fetchTopContributors } from '@/services/statisticsService';

export const useTopContributors = () => {
    const [topContributors, setTopContributors] = useState<any[]>([]);

    useEffect(() => {
        async function loadTopContributors() {
            const contributors = await fetchTopContributors();
            setTopContributors(contributors);
        }

        loadTopContributors();
    }, []);

    return { topContributors };
}