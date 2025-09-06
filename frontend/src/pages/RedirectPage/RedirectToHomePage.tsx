
const RedirectToHomePage = () => {
    const queryParams = new URLSearchParams(window.location.search);
    const userId = queryParams.get('user_id');
    const token = queryParams.get('token');

    if (token && userId) {
        localStorage.setItem('user_id', userId);
        localStorage.setItem('jwt_token', token);
        window.location.href = '/';
    }

    return (
        <div>Redirecting to home...</div>
    )
}

export default RedirectToHomePage