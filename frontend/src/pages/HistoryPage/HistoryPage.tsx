import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

import { deleteEntry, bulkDeleteEntries, listEntries } from '@/services/historyService';
import type { HistoryExtended } from '@/interfaces/table';

import DropdownList from '@/components/common/DropdownList';
import CircularProgress from '@mui/material/CircularProgress';

type FilterType = 'materials' | 'lessons' | 'all';

interface Filter {
    type: FilterType;
    from: string;
    to: string;
};

const HistoryPage = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isDeleting, setIsDeleting] = useState<boolean>(false);
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
    const [selectedHistoryRecords, setSelectedHistoryRecords] = useState<string[]>([]);
    const [pageRange, setPageRange] = useState<{ from: number; to: number }>({ from: 0, to: 9 });
    const [isEndPage, setIsEndPage] = useState<boolean>(false);

    const handleViewChange = async (view: string) => {
        setCurrentView(view as FilterType);
        setFilter((prev) => ({ ...prev, type: view as FilterType }));

        setIsLoading(true);
        const fetchedEntries = await listEntries(userId, {
            type: view,
            from: new Date(new Date(filter.from).setHours(0, 0, 0, 0)),
            to: new Date(new Date(filter.to).setHours(23, 59, 59, 999))
        }, pageRange);
        setIsLoading(false);
        console.log('Fetched entries:', fetchedEntries);
        setEntries(fetchedEntries);
        setIsEndPage(fetchedEntries.length === 0);
    };

    useEffect(() => {
        handleViewChange(currentView);
    }, [pageRange]);

    return (
        <div className='p-12 overflow-y-auto scrollbar-hide h-[100vh] pb-36'>
            <h1 className='text-2xl font-bold mb-8 mt-4'>Materials and Lessons history</h1>
            <div className='bg-white rounded-3xl shadow-xl p-6'>
                <div className='flex justify-between items-center mb-4'>
                    <div className="flex flex-col gap-2">
                        <h2 className='font-semibold text-md'>Type</h2>
                        <DropdownList options={filterOptions} onSelect={handleViewChange} defaultValue='Materials' className='w-48'/>
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
                <div className='mb-4 flex justify-end'>
                    { selectedHistoryRecords.length > 0 && 
                        <div className='flex items-center gap-4'>
                            <span className='text-gray-600'>{selectedHistoryRecords.length} selected</span>
                            <button 
                                className="cursor-pointer px-4 py-2 bg-gradient-to-r from-red-500 to-orange-500 shadow-lg shadow-red-300 rounded-xl text-white hover:opacity-90 hover:px-6 flex items-center justify-center transition-all duration-200 ease-in-out"
                                onClick={async () => {
                                    setIsDeleting(true);
                                    await bulkDeleteEntries(selectedHistoryRecords);
                                    handleViewChange(currentView);
                                    setSelectedHistoryRecords([]);
                                    setIsDeleting(false);
                                }}>
                                { isDeleting ? <CircularProgress sx={{color: 'white'}} size='20px'/> : 'Delete selected' }
                            </button>
                        </div>
                    }
                </div>
                <div>
                    <div className="overflow-x-auto">
                        { isLoading ? 
                            <div className='flex justify-center items-center flex-col mt-2 text-gray-600'>
                                <CircularProgress sx={{color: '#9f9fa9'}} size='30px'/>
                                <h1 className='mt-2 text-lg'>Fetching history...</h1>
                            </div> : <table className="w-full border-collapse">
                                <thead>
                                    <tr className="border-b border-zinc-200">
                                        <th className="text-left py-3 px-4 font-semibold text-gray-700">
                                            <input type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" checked={selectedHistoryRecords.length === entries.length && entries.length > 0} onChange={() => {
                                                if (selectedHistoryRecords.length === entries.length) {
                                                    setSelectedHistoryRecords([]);
                                                } else {
                                                    setSelectedHistoryRecords(entries.map(entry => entry.history_id));
                                                }
                                            }}/>
                                        </th>
                                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
                                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Type</th>
                                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Author</th>
                                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Viewed Date</th>
                                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    { entries.length > 0 ? entries.map((entry) => (
                                        <tr key={entry.history_id} className="border-b border-zinc-100 hover:bg-gray-50">
                                            <td className="py-3 px-4">
                                                <input type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" checked={selectedHistoryRecords.includes(entry.history_id)} onChange={() => {
                                                    if (selectedHistoryRecords.includes(entry.history_id)) {
                                                        setSelectedHistoryRecords(selectedHistoryRecords.filter(id => id !== entry.history_id));
                                                    } else {
                                                        setSelectedHistoryRecords([...selectedHistoryRecords, entry.history_id]);
                                                    }
                                                }}/>
                                            </td>
                                            <td className="py-6 px-4 text-blue-500 font-semibold hover:underline cursor-pointer" onClick={() => {
                                                if (entry.material_id) navigate(`/material/${entry.material_id}`)
                                                else if (entry.lesson_id) navigate(`/lesson/${entry.lesson_id}`);
                                            }}>{entry.material_name || entry.lesson_name}</td>
                                            <td className="py-3 px-4">{entry.type[0].toUpperCase() + entry.type.slice(1)}</td>
                                            <td className="py-3 px-4 hover:underline cursor-pointer" onClick={() => navigate(`/user/${entry.user_id}`)}>
                                                <div className='flex items-center gap-2'>
                                                    <img src={entry.material_author_profile_picture_url || entry.lesson_author_profile_picture_url || '/default_pfp.png'} alt={entry.material_author_name || entry.lesson_author_name || 'Unknown User'} className='w-7 h-7 object-cover rounded-full'/>
                                                    <span>{entry.material_author_name || entry.lesson_author_name || 'Unknown User'}</span>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">{new Date(entry.viewed_date).toLocaleString(undefined, { timeZone: 'UTC' })}</td>
                                            <td className="py-3 px-4">
                                                <button
                                                    onClick={async () => {
                                                        await deleteEntry(entry);
                                                        setEntries((prev) => prev.filter((e) => e.history_id !== entry.history_id));
                                                    }}
                                                    className="cursor-pointer px-4 py-2 bg-gradient-to-r from-red-500 to-orange-500 shadow-lg shadow-red-300 rounded-xl text-white hover:opacity-90 hover:px-6 transition-all duration-200 flex items-center gap-2"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={6} className="py-3 px-4 text-center text-gray-500">
                                                No history entries found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        }
                    </div>
                </div>
                <div className="flex justify-center items-center mt-10">
                    {/* <div>
                        <p className="text-sm text-gray-600 mr-6">
                            Page {range.from / 10 + 1} / {Math.ceil((statistics?.total_materials ?? 0) / 10)}
                        </p>
                    </div> */}
                    <button
                        className="button-outline px-4 py-2 rounded-2xl mr-2"
                        onClick={() => setPageRange(prev => ({ from: Math.max(prev.from - 10, 0), to: Math.max(prev.to - 10, 0) }))}
                        disabled={pageRange.from === 0}
                    >
                        Previous
                    </button>
                    <button
                        className="button-outline px-4 py-2 rounded-2xl"
                        onClick={() => setPageRange(prev => ({ from: prev.from + 10, to: prev.to + 10 }))}
                        disabled={isEndPage}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    )
}

export default HistoryPage