import { ENDPOINTS } from "@/constants/endpoints";

const VERIFY_USER_ENDPOINT = ENDPOINTS.VERIFY_USER;

const verifyUser = async (authorId: string) => {
    const token = localStorage.getItem('jwt_token');
    if (!token) throw new Error('No token found');

    const response = await fetch(`${VERIFY_USER_ENDPOINT}?authorId=${authorId}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        },
    });
    if (!response.ok) {
        throw new Error('User verification failed');
    }
    return await response.json();
};

export { verifyUser };
