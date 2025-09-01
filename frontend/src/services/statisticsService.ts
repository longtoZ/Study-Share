const GENERAL_STATS_ENDPOINT = import.meta.env.VITE_GET_GENERAL_STATS_ENDPOINT;
const TOP_MATERIALS_ENDPOINT = import.meta.env.VITE_GET_TOP_MATERIALS_ENDPOINT;
const TOP_CONTRIBUTORS_ENDPOINT = import.meta.env.VITE_GET_TOP_CONTRIBUTORS_ENDPOINT;

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