import { ENDPOINTS } from "@/constants/endpoints";

const GENERAL_STATS_ENDPOINT = ENDPOINTS.GET_GENERAL_STATS;
const TOP_MATERIALS_ENDPOINT = ENDPOINTS.GET_TOP_MATERIALS;
const TOP_CONTRIBUTORS_ENDPOINT = ENDPOINTS.GET_TOP_CONTRIBUTORS;

async function fetchGeneralStats() {
    const response = await fetch(GENERAL_STATS_ENDPOINT);
    if (!response.ok) {
        throw new Error('Failed to fetch general statistics');
    }
    return await response.json();
}

async function fetchTopMaterials(from: string, to: string) {
    const url = `${TOP_MATERIALS_ENDPOINT}?from=${from}&to=${to}`;

    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Failed to fetch top materials');
    }
    return await response.json();
}

async function fetchTopContributors() {
    const response = await fetch(TOP_CONTRIBUTORS_ENDPOINT);
    if (!response.ok) {
        throw new Error('Failed to fetch top contributors');
    }
    return await response.json();
}

export {
    fetchGeneralStats,
    fetchTopMaterials,
    fetchTopContributors
};