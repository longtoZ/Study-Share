import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Import page components
import UserProfilePage from '@pages/UserProfilePage/UserProfilePage';

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
                    </Routes>
                </div>

            </div>

        </Router>
    );
}

export default App;
