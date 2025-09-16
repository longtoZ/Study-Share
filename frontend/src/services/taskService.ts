import { ENDPOINTS } from '@/constants/endpoints';

const RECENT_TASKS_ENDPOINT = ENDPOINTS.RECENT_TASKS;

const fetchRecentTasks = async (limit: number) => {
    const token = localStorage.getItem('jwt_token');
    if (!token) {
        throw new Error('User is not authenticated');
    }

    const response = await fetch(`${RECENT_TASKS_ENDPOINT}?limit=${limit}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch recent tasks');
    }

    const data = await response.json();
    return data.tasks;
}

export { fetchRecentTasks };