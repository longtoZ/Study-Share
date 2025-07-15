import { useState } from 'react'
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import DropdownList from '@/components/common/DropdownList';

const subjects = [
    "Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
    "Computer Science",
    "History",
    "Geography",
    "English Literature",
    "Economics",
    "Psychology"
]

const Upload = ({ title, type, size }: { title: string, type: string, size: number }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    }

    return (
        <div className='border border-primary rounded-xl p-6 mb-6'>
            <div className='flex w-full justify-between items-center' onClick={toggleExpand}>
                <h3 className='text-header-small font-semibold'>{title}</h3>
                <button className='hover:text-gray-700 transition-colors cursor-pointer'>
                    <ExpandMoreRoundedIcon className='icon-primary' style={{ fontSize:'2rem', transform:`${isExpanded ? 'rotate(180deg)' : 'rotate(0deg)'}` }} />
                </button>
            </div>
            <form className={`space-y-4 mt-4 ${isExpanded ? 'block' : 'hidden'}`}>
                <div>
                    <label htmlFor="title" className="block text-sm font-medium mb-2">
                        Title
                    </label>
                    <input
                        type="text"
                        id="title"
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-zinc-400"
                        placeholder="Enter document title"
                        value={title.substring(0, title.lastIndexOf('.'))}
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
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">
                        Subject
                    </label>
                    <DropdownList
                        options={subjects}
                        placeholder="Select a subject"
                        className="w-full"
                        onSelect={(option) => console.log(`Selected subject: ${option}`)}
                    />
                </div>

                <div>
                    <label htmlFor="filetype" className="block text-sm font-medium mb-2">
                        File Type
                    </label>
                    <input
                        type="text"
                        id="filetype"
                        value={type}
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
                        value={(size / 1024).toFixed(2) + ' KB'}
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
                        defaultValue={new Date().toISOString().split('T')[0]}
                    />
                </div>
                    
            </form>
        </div>
    )
}

export default Upload