import { useState, useEffect } from 'react';
import ArticleIcon from '@mui/icons-material/Article';
import CollectionsBookmarkIcon from '@mui/icons-material/CollectionsBookmark';
import GroupIcon from '@mui/icons-material/Group';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DownloadIcon from '@mui/icons-material/Download';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import DropdownList from '@/components/common/DropdownList';

import { fetchGeneralStats, fetchTopContributors, fetchTopMaterials } from '@/services/statisticsService';

const convertTimeRange = (range: string) => {
    const now = new Date();
    switch (range) {
        case 'all-time':
            return { from: '1970-01-01', to: now.toISOString().split('T')[0] };
        case 'last-month':
            const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
            return { from: lastMonth.toISOString().split('T')[0], to: now.toISOString().split('T')[0] };
        case 'last-week':
            const lastWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
            return { from: lastWeek.toISOString().split('T')[0], to: now.toISOString().split('T')[0] };
        case 'today':
            return { from: now.toISOString().split('T')[0], to: now.toISOString().split('T')[0] };
        default:
            return { from: '1970-01-01', to: now.toISOString().split('T')[0] };
    }
};

const StatisticsPage = () => {
    const [generalStats, setGeneralStats] = useState({
        totalMaterials: 0,
        totalLessons: 0,
        totalUsers: 0,
        totalDownloads: 0,
    });

    const [activeTab, setActiveTab] = useState('viewed');
    const [mostViewedMaterials, setMostViewedMaterials] = useState<any[]>([]);
    const [mostDownloadedMaterials, setMostDownloadedMaterials] = useState<any[]>([]);
    const [topContributors, setTopContributors] = useState<any[]>([]);
    const [materialsRange, setMaterialsRange] = useState<string>('all-time');

    const rankStyles = [
        {
            number: 'text-yellow-500 bg-yellow-200',
            border: 'border-yellow-300',
            background: 'bg-gradient-to-r from-yellow-300 via-yellow-50 to-white',
        },
        {
            number: 'text-gray-500 bg-gray-200',
            border: 'border-gray-300',
            background: 'bg-gradient-to-r from-gray-300 via-gray-50 to-white',
        },
        {
            number: 'text-red-500 bg-red-200',
            border: 'border-red-300',
            background: 'bg-gradient-to-r from-red-300 via-red-50 to-white',
        }
    ]

    useEffect(() => {
        async function loadGeneralStats() {
            const stats = await fetchGeneralStats();
            setGeneralStats(stats);

            const { from, to } = convertTimeRange(materialsRange);
            const topMaterials = await fetchTopMaterials(from, to);
            setMostViewedMaterials(topMaterials.mostViewed);
            setMostDownloadedMaterials(topMaterials.mostDownloaded);

            const contributors = await fetchTopContributors();
            setTopContributors(contributors);
        }
        loadGeneralStats();
    }, []);

    useEffect(() => {
        async function loadTopMaterials() {
            const { from, to } = convertTimeRange(materialsRange);
            const topMaterials = await fetchTopMaterials(from, to);
            setMostViewedMaterials(topMaterials.mostViewed);
            setMostDownloadedMaterials(topMaterials.mostDownloaded);
        }
        loadTopMaterials();
    }, [materialsRange]);

    const materialsRangeOptions = [
        { id: 'all-time', name: 'All Time' },
        { id: 'last-month', name: 'Last Month' },
        { id: 'last-week', name: 'Last Week' },
        { id: 'today', name: 'Today' },
    ];

  return (
    <div className=" p-12 min-h-screen overflow-y-auto scrollbar-hide h-[100vh] pb-36">
      {/* Header */}
      <h1 className="text-4xl font-extrabold text-gray-900 mb-10 text-center tracking-tight">
        Platform Statistics
      </h1>

      {/* Total Stats Cards */}
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

      {/* Leaderboard Card */}
      <div className="bg-white p-8 rounded-3xl card-shadow mb-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Top Materials Leaderboard</h2>
          <DropdownList
            options={materialsRangeOptions}
            onSelect={setMaterialsRange}
            className='w-48'
            hideSearch={true}
          />
        </div>
        <div className="flex space-x-4 mb-6">
          <button
            className={`flex items-center px-4 py-2 rounded-full font-medium text-sm transition-all duration-200 ${
              activeTab === 'viewed'
                ? 'bg-gradient-to-r from-blue-500 to-sky-500 text-white shadow-lg shadow-blue-300'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            onClick={() => setActiveTab('viewed')}
          >
            <VisibilityIcon className="mr-2" />
            Most Viewed
          </button>
          <button
            className={`flex items-center px-4 py-2 rounded-full font-medium text-sm transition-all duration-200 ${
              activeTab === 'downloaded'
                ? 'bg-gradient-to-r from-blue-500 to-sky-500 text-white shadow-lg shadow-blue-300'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            onClick={() => setActiveTab('downloaded')}
          >
            <DownloadIcon className="mr-2" />
            Most Downloaded
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-separate border-spacing-y-1 px-6">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-4 text-gray-700 font-semibold text-sm">Rank</th>
                <th className="p-4 text-gray-700 font-semibold text-sm">Material Name</th>
                <th className="p-4 text-gray-700 font-semibold text-sm">Upload Date</th>
                <th className="p-4 text-gray-700 font-semibold text-sm">
                  {activeTab === 'viewed' ? 'Views' : 'Downloads'}
                </th>
                <th className="p-4 text-gray-700 font-semibold text-sm">
                  {activeTab === 'viewed' ? 'Downloads' : 'Views'}
                </th>
                <th className="p-4 text-gray-700 font-semibold text-sm"></th>
              </tr>
            </thead>
            <tbody>
              {(activeTab === 'viewed' ? mostViewedMaterials : mostDownloadedMaterials).map(
                (item, index) => (
                  <tr
                    key={index}
                    className="hover:bg-blue-50 transition-all ease duration-200"
                    onClick={() => window.open(`/material/${item.material_id}`, '_blank')}
                  >
                    <td className="px-4 py-6 text-gray-800 font-medium">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700">
                        {index + 1}
                      </span>
                    </td>
                    <td className="px-4 py-6 text-gray-800">{item.name}</td>
                    <td className="px-4 py-6 text-gray-600">{new Date(item.upload_date).toLocaleDateString()}</td>
                    <td className="px-4 py-6 text-gray-600">
                      {activeTab === 'viewed' ? `${item.view_count} views` : `${item.download_count} downloads`}
                    </td>
                    <td className="px-4 py-6 text-gray-600">
                      {activeTab === 'viewed' ? `${item.download_count} downloads` : `${item.view_count} views`}
                    </td>
                    <td className="px-4 py-6 text-gray-600">
                      <ArrowForwardIosIcon className="text-gray-400" fontSize="small" />
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Contributors Card */}
      <div className="bg-white p-8 rounded-3xl card-shadow">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Top Contributors</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-separate border-spacing-y-1 px-6">
            <thead>
              <tr className="bg-gray-50 rounded-t-lg">
                <th className="p-4 text-gray-700 font-semibold text-sm">Rank</th>
                <th className="p-4 text-gray-700 font-semibold text-sm">User</th>
                <th className="p-4 text-gray-700 font-semibold text-sm">Materials Uploaded</th>
                <th className="p-4 text-gray-700 font-semibold text-sm">Lessons Created</th>
                <th className="p-4 text-gray-700 font-semibold text-sm"></th>
              </tr>
            </thead>
            <tbody>
              {topContributors.map((user, index) => (
                <tr
                  key={index}
                  className={`rounded-xl border-gray-100 ${index < 3 ? rankStyles[index]?.background : ''} cursor-pointer hover:bg-zinc-50 transition-all duration-200 ease`}
                  onClick={() => window.open(`/user/${user.user_id}`, '_blank')}
                >
                  <td className="px-4 py-6 text-gray-800 font-medium">
                    <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full ${index < 3 ? rankStyles[index]?.number : 'bg-gray-100 text-gray-500'}`}>
                      {index + 1}
                    </span>
                  </td>
                  <td className="px-4 py-6 text-gray-800 flex items-center">
                    <img
                      src={user.profile_picture_url}
                      alt={user.full_name}
                      className="w-10 h-10 rounded-full mr-3 object-cover"
                    />
                    {user.full_name}
                  </td>
                  <td className="px-4 py-6 text-gray-600">{user.total_materials} materials</td>
                  <td className="px-4 py-6 text-gray-600">{user.total_lessons} lessons</td>
                  <td className="px-4 py-6 text-gray-600">
                    <ArrowForwardIosIcon className="text-gray-400" fontSize="small" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StatisticsPage;

