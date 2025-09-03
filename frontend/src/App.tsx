import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { Suspense, lazy, useState } from "react";

// Lazy load page components
const UserProfilePage = lazy(() => import('@pages/UserProfilePage/UserProfilePage'));
const UploadPage = lazy(() => import('@pages/UploadPage/UploadPage'));
const LoginPage = lazy(() => import("@pages/LoginPage/LoginPage"));
const SignupPage = lazy(() => import("@pages/SignupPage/SignupPage"));
const MyLessonsPage = lazy(() => import("@pages/MyLessonsPage/MyLessonsPage"));
const CreateLessonPage = lazy(() => import("@pages/CreateLessonPage/CreateLessonPage"));
const MaterialViewPage = lazy(() => import("@/pages/MaterialViewPage/MaterialViewPage"));
const LessonViewPage = lazy(() => import("@pages/LessonViewPage/LessonViewPage"));
const AccountSettingPage = lazy(() => import("@pages/AccountSettingPage/AccountSettingPage"));
const MaterialEditPage = lazy(() => import("@pages/MaterialEditPage/MaterialEditPage"));
const LessonEditPage = lazy(() => import("@pages/LessonEditPage/LessonEditPage"));
const MyMaterialsPage = lazy(() => import("@pages/MyMaterialsPage/MyMaterialsPage"));
const SearchPage = lazy(() => import("@pages/SearchPage/SearchPage"));
const HistoryPage = lazy(() => import("@pages/HistoryPage/HistoryPage"));
const StatisticsPage = lazy(() => import("@pages/StatisticsPage/StatisticsPage"));

// Layout components
import SideBar from '@components/layout/SideBar';
import TopBar from '@components/layout/TopBar';
import CircularProgress from "@mui/material/CircularProgress";

const exludePaths = ['/login', '/signup'];

function AppContent() {
    const location = useLocation();
    const isExcludedPages = exludePaths.includes(location.pathname);

    const [ isSidebarMinimized, setIsSidebarMinimized ] = useState(false);

    return (
        <div className="bg-zinc-800 text-primary flex fixed">
            {!isExcludedPages && (
                <div className={`z-20 transition-all duration-300 ease-in-out ${ isSidebarMinimized ? "w-[4vw]" : "w-[18vw]"} h-[100vh] relative`}>
                    <SideBar isMinimized={isSidebarMinimized} onToggleMinimize={setIsSidebarMinimized} />
                </div>
            )}

            <div className={`${isExcludedPages ? "w-full" : `${ isSidebarMinimized ? "w-[94vw]" : "w-[80vw]"} h-[100vh] mx-4 mb-4`}`}>
                {!isExcludedPages && <TopBar isDarkMode={false} onToggleDarkMode={() => {}} />}

                <div className="z-10 bg-secondary rounded-3xl relative overflow-hidden h-[90%]">
                    <Suspense fallback={
                        <div className='flex justify-center items-center flex-col mt-10 text-gray-600'>
                            <CircularProgress sx={{color: '#9f9fa9'}} size='30px'/>
                            <h1 className='mt-2 text-lg'>Loading page...</h1>
                        </div>
                    }>
                        <Routes>
                            <Route path="/user/:userId" element={<UserProfilePage />} />
                            <Route path="/upload" element={<UploadPage />} />
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/signup" element={<SignupPage />} />
                            <Route path="/user/:userId/lessons" element={<MyLessonsPage />} />
                            <Route path="/create-lesson" element={<CreateLessonPage />} />
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
                    </Suspense>
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
