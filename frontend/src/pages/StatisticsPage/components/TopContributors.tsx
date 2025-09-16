import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

interface TopContributorsProps {
    user_id: string;
    full_name: string;
    profile_picture_url: string;
    total_materials: number;
    total_lessons: number;
}

const TopContributors = ({ topContributors } : { topContributors: TopContributorsProps[] }) => {
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

    return (
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
                        referrerPolicy="no-referrer"
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
    )
}

export default TopContributors