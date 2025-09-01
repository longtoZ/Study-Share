import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

// Import page components
import UserProfilePage from '@pages/UserProfilePage/UserProfilePage';
import UploadPage from '@pages/UploadPage/UploadPage';
import LoginPage from "@pages/LoginPage/LoginPage";
import SignupPage from "@pages/SignupPage/SignupPage";
import MyLessonsPage from "@pages/MyLessonsPage/MyLessonsPage";
import CreateLessonPage from "@pages/CreateLessonPage/CreateLessonPage";
import MaterialViewPage from "@/pages/MaterialViewPage/MaterialViewPage";
import LessonViewPage from "@pages/LessonViewPage/LessonViewPage";
import AccountSettingPage from "@pages/AccountSettingPage/AccountSettingPage";
import MaterialEditPage from "@pages/MaterialEditPage/MaterialEditPage";
import LessonEditPage from "@pages/LessonEditPage/LessonEditPage";
import MyMaterialsPage from "@pages/MyMaterialsPage/MyMaterialsPage";
import SearchPage from "@pages/SearchPage/SearchPage";
import HistoryPage from "@pages/HistoryPage/HistoryPage";
import StatisticsPage from "@pages/StatisticsPage/StatisticsPage";

// Import layout components
import SideBar from '@components/layout/SideBar';
import TopBar from '@components/layout/TopBar';

const exludePaths = ['/login', '/signup'];

function AppContent() {
    const location = useLocation();
    const isExcludedPages = exludePaths.includes(location.pathname);

    return (
        <div className="bg-zinc-800 text-primary flex fixed">
            {!isExcludedPages && (
                <div className="w-[18vw] h-[100vh] relative">
                    <SideBar />
                </div>
            )}

            <div className={`${isExcludedPages ? "w-full" : "w-[80vw] h-[100vh] mx-4 mb-4"}`}>
                <div className="">
                    {!isExcludedPages && <TopBar isDarkMode={false} onToggleDarkMode={() => {}} />}
                </div>

                <div className="bg-secondary rounded-3xl relative overflow-hidden h-[90%]">
                    <Routes>
                        <Route path="/user/:userId" element={<UserProfilePage />} />
                        <Route path="/upload" element={<UploadPage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/signup" element={<SignupPage />} />
                        <Route path="/user/:userId/lessons" element={<MyLessonsPage/>}/>
                        <Route path="/create-lesson" element={<CreateLessonPage/>}/>
                        <Route path="/material/:materialId" element={<MaterialViewPage />} />
                        <Route path="/lesson/:lessonId" element={<LessonViewPage />} />
                        <Route path="/account-settings" element={<AccountSettingPage />} />
                        <Route path="/material/:materialId/edit" element={<MaterialEditPage />} />
                        <Route path="/lesson/:lessonId/edit" element={<LessonEditPage />} />
                        <Route path="/user/:userId/materials" element={<MyMaterialsPage />} />
                        <Route path="/search" element={<SearchPage />} />
                        <Route path="/history" element={<HistoryPage />} />
                        <Route path="/statistics" element={<StatisticsPage />} />
                    </Routes>
                </div>
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