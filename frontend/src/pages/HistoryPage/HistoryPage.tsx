import { useState, useEffect, use } from 'react'
import { useNavigate } from 'react-router-dom';

import { deleteEntry, listEntries } from '@/services/historyService';
import type { HistoryExtended } from '@/interfaces/table';

import DropdownList from '@/components/common/DropdownList';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';

type FilterType = 'materials' | 'lessons' | 'all';

interface Filter {
    type: FilterType;
    from: string;
    to: string;
};

const HistoryPage = () => {
    const navigate = useNavigate();
    const [currentView, setCurrentView] = useState<FilterType>('materials');
    const [filter, setFilter] = useState<Filter>({
        type: 'materials',
        from: new Date(0).toISOString().split('T')[0], // Default to epoch start
        to: new Date().toISOString().split('T')[0] // Default to today
    });
    const filterOptions = [
        {id: 'materials', name: 'Materials'},
        {id: 'lessons', name: 'Lessons'},
        {id: 'all', name: 'All'}
    ]
    const userId = localStorage.getItem('user_id') || '';
    const [entries, setEntries] = useState<HistoryExtended[]>([]);

    const handleViewChange = async (view: string) => {
        setCurrentView(view as FilterType);
        setFilter((prev) => ({ ...prev, type: view as FilterType }));

        const fetchedEntries = await listEntries(userId, {
            type: view,
            from: new Date(new Date(filter.from).setHours(0, 0, 0, 0)),
            to: new Date(new Date(filter.to).setHours(23, 59, 59, 999))
        });
        console.log('Fetched entries:', fetchedEntries);
        setEntries(fetchedEntries);
    };

    useEffect(() => {
        handleViewChange(currentView);
    }, []);

    return (
        <div className='p-6 overflow-y-auto scrollbar-hide h-[100vh] pb-36'>
            <h1 className='text-2xl font-bold mb-8 mt-4'>Materials and Lessons history</h1>
            <div className='bg-white rounded-3xl shadow-xl p-6'>
                <div className='flex justify-between items-center mb-4'>
                    <div className="flex flex-col gap-2">
                        <h2 className='font-semibold text-md'>Type</h2>
                        <DropdownList options={filterOptions} onSelect={handleViewChange} className='w-48'/>
                    </div>
                    <div className='flex gap-4'>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs text-gray-600 flex items-center gap-1.5">
                                From
                            </label>
                            <input
                                type="date"
                                value={filter.type === 'materials' ? (filter.from || '') : (filter.from || '')}
                                onChange={(e) => {
                                    setFilter((prev) => ({ ...prev, from: e.target.value }));
                                }}
                                className="p-2 rounded-md border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs text-gray-600 flex items-center gap-1.5">
                                To
                            </label>
                            <input
                                type="date"
                                value={filter.type === 'materials' ? (filter.to || '') : (filter.to || '')}
                                onChange={(e) => {
                                    setFilter((prev) => ({ ...prev, to: e.target.value }));
                                }}
                                className="p-2 rounded-md border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                </div>
                <div className='border-b border-zinc-300 my-6'></div>
                
                <div>
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="border-b border-zinc-200">
                                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
                                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Type</th>
                                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Author</th>
                                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Viewed Date</th>
                                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {entries.length > 0 ? entries.map((entry) => (
                                    <tr key={entry.history_id} className="border-b border-zinc-100 hover:bg-gray-50">
                                        <td className="py-3 px-4 text-blue-500 font-semibold hover:underline cursor-pointer" onClick={() => {
                                            if (entry.material_id) navigate(`/material/${entry.material_id}`)
                                            else if (entry.lesson_id) navigate(`/lesson/${entry.lesson_id}`);
                                        }}>{entry.material_name || entry.lesson_name}</td>
                                        <td className="py-3 px-4">{entry.type}</td>
                                        <td className="py-3 px-4 hover:underline cursor-pointer">{entry.user_id}</td>
                                        <td className="py-3 px-4">{new Date(entry.viewed_date).toLocaleString(undefined, { timeZone: 'UTC' })}</td>
                                        <td className="py-3 px-4">
                                            <button
                                                onClick={async () => {
                                                    await deleteEntry(entry);
                                                    setEntries((prev) => prev.filter((e) => e.history_id !== entry.history_id));
                                                }}
                                                className="text-red-500 hover:text-red-700 cursor-pointer"
                                            >
                                                <DeleteOutlinedIcon />
                                            </button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={5} className="py-3 px-4 text-center text-gray-500">
                                            No history entries found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HistoryPage