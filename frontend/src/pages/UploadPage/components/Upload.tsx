import { useEffect, useState } from 'react'
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import DropdownList from '@components/common/DropdownList';
import type { Subject } from '@interfaces/table';
import { useDispatch } from 'react-redux';
import { setMaterial } from '@redux/materialSlice';

const Upload = ({ file, material_id, subjects }: { file: File, material_id: string, subjects: Subject[] }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [fileData, setFileData] = useState({
        material_id: material_id,
        name: file.name,
        description: '',
        subject_id: '',
        file_url: '',
        size: file.size,
        file_type: file.name.substring(file.name.lastIndexOf('.') + 1),
        num_page: 0,
        upload_date: new Date().toISOString(),
        download_count: 0,
        total_rating: 0,
        rating_count: 0,
        view_count: 0,
        is_paid: false,
        price: 0,
        user_id: `${localStorage.getItem('user_id') || ''}`,
        lesson_id: null, // Assuming lesson_id can be null
    });

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    }

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setMaterial(fileData));
    }, [fileData]);

    return (
        <div className='border border-primary rounded-xl p-6 mb-6'>
            <div className='flex w-full justify-between items-center' onClick={toggleExpand}>
                <h3 className='text-header-small font-semibold'>{fileData.name}</h3>
                <button className='hover:text-gray-700 transition-colors cursor-pointer'>
                    <ExpandMoreRoundedIcon className='icon-primary' style={{ fontSize:'2rem', transform:`${isExpanded ? 'rotate(180deg)' : 'rotate(0deg)'}` }} />
                </button>
            </div>
            <form className={`space-y-4 mt-4 ${isExpanded ? 'block' : 'hidden'}`}>
                <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-2">
                        Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-zinc-400"
                        placeholder="Enter document name"
                        value={fileData.name.substring(0, fileData.name.lastIndexOf('.'))}
                        onChange={(e) => setFileData({ ...fileData, name: e.target.value })}
                    />
                </div>

                <div>
                    <label htmlFor="description" className="block text-sm font-medium mb-2">
                        Description
                    </label>
                    <textarea
                        id="description"
                        rows={4}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-zinc-400"
                        placeholder="Enter document description"
                        onChange={(e) => setFileData({ ...fileData, description: e.target.value })}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">
                        Subject
                    </label>
                    <DropdownList
                        options={subjects.map((subject: any) => subject.name)}
                        placeholder="Select a subject"
                        className="w-full"
                        onSelect={(option) => setFileData({ ...fileData, subject_id: subjects.find((subject: any) => subject.name === option)?.subject_id || '' })}
                    />
                </div>

                <div>
                    <label htmlFor="filetype" className="block text-sm font-medium mb-2">
                        File Type
                    </label>
                    <input
                        type="text"
                        id="filetype"
                        value={fileData.file_type}
                        readOnly
                        className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed focus:outline-zinc-400"
                    />
                </div>

                <div>
                    <label htmlFor="filetype" className="block text-sm font-medium mb-2">
                        File Size
                    </label>
                    <input
                        type="text"
                        id="filesize"
                        value={(fileData.size / 1024).toFixed(2) + ' KB'}
                        readOnly
                        className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed focus:outline-zinc-400"
                    />
                </div>

                <div>
                    <label htmlFor="filetype" className="block text-sm font-medium mb-2">
                        Upload Date
                    </label>
                    <input
                        type="date"
                        id="uploaddate"
                        className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed focus:outline-zinc-400"
                        readOnly
                        defaultValue={fileData.upload_date.split('T')[0]} // Format date to YYYY-MM-DD
                    />
                </div>
                    
            </form>
        </div>
    )
}

export default Upload