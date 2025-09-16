import { useProfileData } from './hooks/useProfileData';

import UserInfoSection from './components/UserInfoSection';
import AboutSection from './components/AboutSection';
import MaterialsSection from './components/MaterialsSection';
import LessonsSection from './components/LessonsSection';

const UserProfilePage = () => {
	const { user, materials, lessons, isMaterialsLoading, isLessonsLoading } = useProfileData();

	return (
		<div className='p-12 min-h-screen w-full rounded-2xl overflow-y-auto scrollbar-hide h-[100vh] pb-36'>
			{/* User Info Section */}
			<UserInfoSection user={user} />

			{/* About Section */}
			<AboutSection user={user as any} />

			{/* User's Materials & Lessons */}
			<MaterialsSection userId={user?.user_id as string} materials={materials} isMaterialsLoading={isMaterialsLoading} navigate={(path) => {window.location.href = path}} />
			<LessonsSection userId={user?.user_id as string} lessons={lessons} isLessonsLoading={isLessonsLoading} navigate={(path) => {window.location.href = path}} />

		</div>
	)
}

export default UserProfilePage