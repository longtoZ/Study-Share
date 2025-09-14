import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import BackgroundImage from './images/login_background.jpeg';
import Login from './components/Login';
import ResetPassword from './components/ResetPassword';

const LoginPage = () => {
    const navigate = useNavigate();
    const [mode, setMode] = useState<string>('login');
    const [email, setEmail] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('jwt_token');
        if (token) {
            navigate('/');
        }
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center relative">
            <img
                referrerPolicy="no-referrer"
                src={BackgroundImage}
                alt="Background"
                className="absolute top-0 left-0 w-full h-full object-cover saturate-76"
            />
            <div className="w-1/3 space-y-8 z-20">
                { mode === 'login' ? <Login email={email} setEmail={setEmail} setMode={setMode} /> : <ResetPassword email={email} setMode={setMode} /> }
            </div>
        </div>
    );
};

export default LoginPage;