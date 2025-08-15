const VERIFY_USER_ENDPOINT = import.meta.env.VITE_VERIFY_USER_ENDPOINT;

const verifyUser = async () => {
    const token = localStorage.getItem('user_token');
    if (!token) throw new Error('No token found');

    const response = await fetch(VERIFY_USER_ENDPOINT, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (!response.ok) {
        throw new Error('User verification failed');
    }
    return await response.json();
};

export { verifyUser };
