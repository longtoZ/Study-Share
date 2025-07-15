import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Import page components
import UserProfilePage from '@pages/UserProfilePage/UserProfilePage';
import UploadPage from '@pages/UploadPage/UploadPage';

// Import layout components
import SideBar from '@components/layout/SideBar';

function App() {
    return (
        <Router>
            <div className="bg-secondary text-primary flex">
                <div className="w-[18vw] ">
                    <SideBar />
                </div>
                <div className="w-[82vw]">
                    <Routes>
                        <Route path="/user" element={<UserProfilePage />} />
                        <Route path="/upload" element={<UploadPage />} />
                    </Routes>
                </div>

            </div>

        </Router>
    );
}

export default App;
