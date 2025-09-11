import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

const RootRedirectPage = () => {
    const navigate = useNavigate();
    const userId = localStorage.getItem('user_id') || null;

    useEffect(() => {
        if (userId) {
            navigate(`/user/${userId}`);
        } else {
            navigate('/login');
        }
    }, [navigate]);

    return (
        <div>Redirecting...</div>
    )
}

export default RootRedirectPage