import { useState, useEffect } from 'react';
import { fetchTopMaterials } from '@/services/statisticsService';

const convertTimeRange = (range: string) => {
    const now = new Date();
    switch (range) {
        case 'all-time':
            return { from: '1970-01-01', to: now.toISOString().split('T')[0] };
        case 'last-month':
            const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
            return { from: lastMonth.toISOString().split('T')[0], to: now.toISOString().split('T')[0] };
        case 'last-week':
            const lastWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
            return { from: lastWeek.toISOString().split('T')[0], to: now.toISOString().split('T')[0] };
        case 'today':
            return { from: now.toISOString().split('T')[0], to: now.toISOString().split('T')[0] };
        default:
            return { from: '1970-01-01', to: now.toISOString().split('T')[0] };
    }
};

export const useTopMaterials = () => {
    const [mostViewedMaterials, setMostViewedMaterials] = useState<any[]>([]);
    const [mostDownloadedMaterials, setMostDownloadedMaterials] = useState<any[]>([]);
    const [materialsRange, setMaterialsRange] = useState<string>('all-time');

    useEffect(() => {
        async function loadGeneralStats() {
            const { from, to } = convertTimeRange(materialsRange);
            const topMaterials = await fetchTopMaterials(from, to);
            setMostViewedMaterials(topMaterials.mostViewed);
            setMostDownloadedMaterials(topMaterials.mostDownloaded);
        }
        loadGeneralStats();
    }, []);

    useEffect(() => {
        async function loadTopMaterials() {
            const { from, to } = convertTimeRange(materialsRange);
            const topMaterials = await fetchTopMaterials(from, to);
            setMostViewedMaterials(topMaterials.mostViewed);
            setMostDownloadedMaterials(topMaterials.mostDownloaded);
        }
        loadTopMaterials();
    }, [materialsRange]);

    return { mostViewedMaterials, mostDownloadedMaterials, materialsRange, setMaterialsRange };
};