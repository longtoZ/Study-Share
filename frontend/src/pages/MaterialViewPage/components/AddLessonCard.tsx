import { useState, useEffect, useRef } from 'react'
import type { Lesson } from '@/interfaces/userProfile';
import { retrieveLessons } from '@/services/userService';
import { addMaterialToLesson } from '@/services/lessonService';

import BookmarkBorderOutlined from '@mui/icons-material/BookmarkBorderOutlined';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';

const AddLessonCard = ({ user_id, material_id, className = '', hideSearch = false } : { user_id: string, material_id: string, className?: string, hideSearch?: boolean}) => {
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    const dropdownRef = useRef<HTMLDivElement>(null);

    const filteredLessons = lessons.filter(lesson =>
        lesson.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAddMaterialToLesson = async () => {
        if (selectedLesson && material_id && user_id) {
            const result = await addMaterialToLesson(selectedLesson.lesson_id, material_id);
            console.log('Material added to lesson:', result);
        }
    };

    useEffect(() => {
        const fetchLessons = async () => {
            const data = await retrieveLessons(user_id, 'newest');
            setLessons(data);
        };
        
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setSelectedLesson(null);
            }
        };

        fetchLessons();
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [user_id]);

    return (
        <div ref={dropdownRef} className={`relative ${className}`}>
            <button 
                className="flex items-center gap-2 text-gray-700 bg-gray-100 hover:bg-gray-200 py-3 px-6 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300 shadow-md w-full sm:w-auto justify-center"
                onClick={() => setIsOpen(!isOpen)}>
                <BookmarkBorderOutlined />
                Add to Lesson
            </button>

            {isOpen && (
                <div className="absolute z-10 mt-3 p-2 w-60 bg-white border border-gray-300 rounded-lg shadow-lg">
                    { !hideSearch && <input
                        type="text"
                        className="w-full px-3 py-2 border-b border-gray-200 focus:outline-none"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        autoFocus
                    /> }
                    <div className="mt-2 max-h-60 overflow-y-auto">
                        {filteredLessons.length > 0 ? (
                            filteredLessons.map((lesson, index) => (
                                <div
                                    key={index}
                                    className={`px-3 py-2 hover:bg-gray-100 rounded-lg cursor-pointer flex justify-between items-center ${selectedLesson?.lesson_id === lesson.lesson_id ? 'bg-blue-100' : ''}`}
                                    onClick={() => setSelectedLesson(lesson)}
                                >
                                    <h3>{lesson.name}</h3>
                                    {selectedLesson?.lesson_id === lesson.lesson_id && (
                                        <CheckCircleOutlineOutlinedIcon className="ml-6 text-blue-500" />
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="px-3 py-2 text-gray-500">No lessons found</div>
                        )}
                    </div>
                    <div className='border-b border-zinc-300 my-2'></div>
                    <div className='mt-4 flex justify-end gap-4'>
                        <button className='cursor-pointer text-zinc-500 hover:bg-zinc-100 px-2 py-1 rounded-lg' onClick={() => setSelectedLesson(null)}>
                            Clear
                        </button>
                        <button className='cursor-pointer text-blue-500 hover:bg-blue-100 px-2 py-1 rounded-lg' onClick={handleAddMaterialToLesson}>
                            Save
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AddLessonCard