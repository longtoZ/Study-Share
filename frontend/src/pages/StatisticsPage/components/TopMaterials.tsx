import { useState } from 'react'

import VisibilityIcon from '@mui/icons-material/Visibility';
import DownloadIcon from '@mui/icons-material/Download';
import DropdownList from '@/components/common/DropdownList';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

interface TopMaterialsProps {
    mostViewedMaterials: any[];
    mostDownloadedMaterials: any[];
    setMaterialsRange: (range: string) => void;
}

const TopMaterials = ({ mostViewedMaterials, mostDownloadedMaterials, setMaterialsRange }: TopMaterialsProps) => {
    const [activeTab, setActiveTab] = useState('viewed');

    const materialsRangeOptions = [
        { id: 'all-time', name: 'All Time' },
        { id: 'last-month', name: 'Last Month' },
        { id: 'last-week', name: 'Last Week' },
        { id: 'today', name: 'Today' },
    ];

    
    return (
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
    )
}

export default TopMaterials