import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

// Import page components
import UserProfilePage from '@pages/UserProfilePage/UserProfilePage';
import UploadPage from '@pages/UploadPage/UploadPage';
import LoginPage from "@pages/LoginPage/LoginPage";
import SignupPage from "@pages/SignupPage/SignupPage";

// Import layout components
import SideBar from '@components/layout/SideBar';

const exludePaths = ['/login', '/signup'];

function AppContent() {
    const location = useLocation();
    const isExcludedPages = exludePaths.includes(location.pathname);

    return (
        <div className="bg-secondary text-primary flex">
            {!isExcludedPages && (
                <div className="w-[18vw]">
                    <SideBar />
                </div>
            )}
            
            <div className={isExcludedPages ? "w-full" : "w-[82vw]"}>
                <Routes>
                    <Route path="/user" element={<UserProfilePage />} />
                    <Route path="/upload" element={<UploadPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />
                </Routes>
            </div>
        </div>
    );
}

function App() {
    return (
        <Router>
            <AppContent />
        </Router>
    );
}

export default App;