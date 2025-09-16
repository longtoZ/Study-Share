import ArticleIcon from '@mui/icons-material/Article';
import CollectionsBookmarkIcon from '@mui/icons-material/CollectionsBookmark';
import GroupIcon from '@mui/icons-material/Group';
import DownloadIcon from '@mui/icons-material/Download';

interface GeneralStatsData {
    totalMaterials: number;
    totalLessons: number;
    totalDownloads: number;
    totalUsers: number;
}

const GeneralStats = ({ generalStats }: { generalStats: GeneralStatsData }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
            {[
                {
                    icon: <ArticleIcon className="text-blue-600" fontSize="large" />,
                    title: 'Total Materials',
                    value: generalStats.totalMaterials,
                    gradient: 'from-blue-500 to-blue-300',
                },
                {
                    icon: <CollectionsBookmarkIcon className="text-green-600" fontSize="large" />,
                    title: 'Total Lessons',
                    value: generalStats.totalLessons,
                    gradient: 'from-green-500 to-green-300',
                },
                {
                    icon: <DownloadIcon className="text-red-600" fontSize="large" />,
                    title: 'Total Downloads',
                    value: generalStats.totalDownloads,
                    gradient: 'from-red-500 to-red-300',
                },
                {
                    icon: <GroupIcon className="text-purple-600" fontSize="large" />,
                    title: 'Total Users',
                    value: generalStats.totalUsers,
                    gradient: 'from-purple-500 to-purple-300',
                },
            ].map((stat, index) => (
            <div
                key={index}
                className={`relative bg-white p-6 rounded-3xl shadow-lg transform hover:scale-105 transition-transform duration-300 overflow-hidden group`}
            >
                <div className={`absolute inset-0 bg-gradient-to-r ${stat.gradient} opacity-10 group-hover:opacity-20 transition-opacity`}></div>
                <div className="relative flex items-center">
                <div className="p-3 bg-gray-100 rounded-full mr-4">{stat.icon}</div>
                <div>
                    <h2 className="text-lg font-medium text-gray-700">{stat.title}</h2>
                    <p className="text-3xl font-extrabold text-gray-900">{stat.value}</p>
                </div>
                </div>
            </div>
            ))}
        </div>
    )
}

export default GeneralStats