import { useEffect, useState } from 'react'
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import DropdownList from '@components/common/DropdownList';
import type { Subject } from '@interfaces/table.d';
import { useDispatch } from 'react-redux';
import { setMaterial } from '@redux/materialSlice';
import { getUserStripeAccountId } from '@/services/userService';

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
    const [userStripeAccountId, setUserStripeAccountId] = useState<string | null>(null);

    useEffect(() => {
        const fetchStripeAccountId = async () => {
            try {
                const accountId = await getUserStripeAccountId();
                setUserStripeAccountId(accountId);
            } catch (error) {
                console.error('Error fetching Stripe account ID:', error);
            }
        };

        fetchStripeAccountId();
    }, []);

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    }

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setMaterial(fileData));
    }, [fileData]);

    return (
        <div className='border border-primary rounded-xl p-6 mb-6 shadow-lg shadow-zinc-100'>
            <div className='flex w-full justify-between items-center' onClick={toggleExpand}>
                <h3 className='text-header-small font-semibold'>{fileData.name}</h3>
                <button className='hover:text-gray-700 transition-colors cursor-pointer'>
                    <ExpandMoreRoundedIcon className='icon-primary' style={{ fontSize:'2rem', transform:`${isExpanded ? 'rotate(180deg)' : 'rotate(0deg)'}` }} />
                </button>
            </div>
            <form className={`space-y-4 mt-4 ${isExpanded ? 'block' : 'hidden'}`}>
                <div className='mb-8'>
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

                <div className='mb-8'>
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

                <div className='mb-8'>
                    <label className="block text-sm font-medium mb-2">
                        Subject
                    </label>
                    <DropdownList
                        options={subjects.map((subject: any) => ({id: subject.subject_id, name: subject.name}))}
                        placeholder="Select a subject"
                        className="w-full"
                        onSelect={(option) => setFileData({ ...fileData, subject_id: option })}
                    />
                </div>

                <div className='mb-8'>
                    <label className="block text-sm font-medium mb-2">
                        Price (in USD)
                        { userStripeAccountId ? <p className='text-xs text-gray-500 mt-1'>
                            &#9432; You can set the price to 0 if you want to upload it for free. If you set a price greater than 0, users will need to pay to download this file.
                        </p> : <p className='text-xs text-red-500 mt-1'>
                            &#9432; You need to set up your Stripe account in your Account settings before you can charge for your materials.
                        </p> }
                    </label>
                    <input
                        type="number"
                        className={`w-full p-2 border border-gray-300 rounded-lg focus:outline-zinc-400" ${!userStripeAccountId ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                        min={0}
                        step={0.01}
                        placeholder="Enter price"
                        value={fileData.price}
                        onChange={(e) => setFileData({ ...fileData, price: Number(e.target.value) })}
                        disabled={!userStripeAccountId}
                    />
                </div>

                <div className='mb-8'>
                    <label htmlFor="filetype" className="block text-sm font-medium mb-2">
                        File Type
                        <p className='text-xs text-gray-500 mt-1'>
                            &#9432; This is automatically detected from the file you selected and cannot be changed.
                        </p>
                    </label>
                    <input
                        type="text"
                        id="filetype"
                        value={fileData.file_type}
                        readOnly
                        className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed focus:outline-zinc-400"
                    />
                </div>

                <div className='mb-8'>
                    <label htmlFor="filetype" className="block text-sm font-medium mb-2">
                        File Size
                        <p className='text-xs text-gray-500 mt-1'>
                            &#9432; This is automatically detected from the file you selected and cannot be changed.
                        </p>
                    </label>
                    <input
                        type="text"
                        id="filesize"
                        value={(fileData.size / 1024).toFixed(2) + ' KB'}
                        readOnly
                        className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed focus:outline-zinc-400"
                    />
                </div>

                <div className='mb-8'>
                    <label htmlFor="filetype" className="block text-sm font-medium mb-2">
                        Upload Date
                        <p className='text-xs text-gray-500 mt-1'>
                            &#9432; This is automatically set to the current date and cannot be changed.
                        </p>
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