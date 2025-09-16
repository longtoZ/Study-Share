import { useState, useEffect } from 'react'
import { fetchRecentTasks } from '@/services/taskService'
import CircularProgress from '@mui/material/CircularProgress';
import RefreshIcon from '@mui/icons-material/Refresh';

import type { Task } from '@/interfaces/table.d'

const TasksPage = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [limit, setLimit] = useState<number>(5);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchTasks = async () => {
        setLoading(true);
        setTasks([]);
        const data = await fetchRecentTasks(limit);
        setTasks(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchTasks();
        // eslint-disable-next-line
    }, [limit]);

    return (
        <div className='p-6 overflow-y-auto scrollbar-hide h-[100vh] pb-36'>
            <h1 className='text-2xl font-bold mb-8 mt-4'>Tasks</h1>
            <div className='bg-white rounded-3xl shadow-xl p-6'>
                <div className='flex justify-between items-center mb-4'>
                    <div className="flex flex-col gap-2">
                        <h2 className='font-semibold text-md'>Limit</h2>
                        <input
                            type="number"
                            min={1}
                            max={10}
                            className="p-2 rounded-md border border-zinc-300 focus:outline-none w-20"
                            value={limit}
                            onChange={e => setLimit(Number(e.target.value))}
                        />
                    </div>
                    <button
                        className="flex items-center gap-2 px-4 py-3 rounded-xl text-white font-semibold transition-all duration-100 ease-in-out bg-gradient-to-r from-blue-500 to-sky-500 shadow-lg shadow-blue-300 cursor-pointer hover:opacity-85 "
                        onClick={fetchTasks}
                        disabled={loading}
                        title="Reload"
                    >
                        <RefreshIcon className={loading ? 'animate-spin' : ''} />
                        Reload
                    </button>
                </div>
                <div className='border-b border-zinc-300 my-6'></div>
                <div>
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="border-b border-zinc-200">
                                    <th className="text-left py-3 px-4 font-semibold text-gray-700">No.</th>
                                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Task ID</th>
                                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Material ID</th>
                                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Created Date</th>
                                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Content</th>
                                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan={6} className="py-20 px-4 text-center">
                                            <div className='flex justify-center items-center flex-col mt-10 text-gray-600'>
                                                <CircularProgress sx={{ color: '#9f9fa9' }} size='30px' />
                                                <h1 className='mt-2 text-lg'>Fetching tasks...</h1>
                                            </div>
                                        </td>
                                    </tr>
                                ) : tasks.length > 0 ? tasks.map((task, idx) => (
                                    <tr key={task.task_id} className="border-b border-zinc-100 hover:bg-gray-50">
                                        <td className="py-4 px-4"><strong>{idx + 1}</strong></td>
                                        <td className="py-3 px-4">{task.task_id}</td>
                                        <td className="py-3 px-4">{task.material_id}</td>
                                        <td className="py-3 px-4">{new Date(task.created_date).toLocaleString(undefined, { timeZone: 'UTC' })}</td>
                                        <td className="py-3 px-4">
                                            {task.content.split('\n- ').map((line, lineIdx) => (
                                                <p key={lineIdx} className="whitespace-pre-wrap">
                                                    {lineIdx === 0 ? line : `- ${line}`}
                                                </p>
                                            ))}
                                        </td>
                                        <td className="py-3 px-4 capitalize">
                                            <span className={`px-4 py-2 rounded-xl bg-gradient-to-r shadow-lg ${task.status === 'success' ? 'from-emerald-500 to-lime-500 shadow-green-200' : task.status === 'pending' ? 'from-yellow-500 to-amber-500 shadow-yellow-200' : 'from-red-500 to-amber-500 shadow-red-200'} text-white font-semibold`}>
                                                {task.status[0].toUpperCase() + task.status.slice(1)}
                                            </span>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={6} className="py-3 px-4 text-center text-gray-500">
                                            No tasks found.
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

export default TasksPage