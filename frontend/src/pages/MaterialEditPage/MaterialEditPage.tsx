import { useState, useEffect, useRef} from 'react';
import { useNavigate } from 'react-router-dom';
import { getMaterial } from '@services/materialService';
import { useParams } from 'react-router-dom';

import { retrieveLessons, retrieveAllSubjects } from '@/services/userService';
import { updateMaterial, deleteMaterial } from '@services/materialService';

import type { Subject } from '@interfaces/table';
import type { Lesson } from '@interfaces/userProfile';
import type { Material } from '@interfaces/table';

import DropdownList from '@components/common/DropdownList';
import CircularProgress from '@mui/material/CircularProgress';

const MaterialEditPage: React.FC = () => {
    const [materialData, setMaterialData] = useState<Material | null>(null);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [confirmationText, setConfirmationText] = useState('');
    const [successfulMessage, setSuccessfulMessage] = useState('');
    const defaultConfirmationText = "delete this material";
    const containerRef = useRef<HTMLDivElement>(null);

    const navigate = useNavigate();

    const [overlaySize, setOverlaySize] = useState({ width: 0, height: 0 });

    const { materialId } = useParams();
    const userId = localStorage.getItem('user_id') || '';

    useEffect(() => {
        const fetchData = async () => {
            if (!materialId) return;

            const material = await getMaterial(materialId);
            const subjects = await retrieveAllSubjects();
            const lessons = await retrieveLessons(userId, "newest", {from: 0, to: 99});
            console.log(lessons)

            setMaterialData(material);
            setSubjects(subjects);
            setLessons(lessons);
        };
        fetchData();
    }, [materialId]);

    useEffect(() => {
        if (isDialogOpen && containerRef.current) {
            setOverlaySize({
                width: window.innerWidth - containerRef.current!.getBoundingClientRect().left,
                height: window.innerHeight - containerRef.current!.getBoundingClientRect().top,
            })
        }
    }, [isDialogOpen]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setMaterialData(prev => {
            if (prev) {
                return {
                    ...prev,
                    [name]: value
                };
            }
            return null;
        });
    };

    const onSubjectSelect= (subjectName: string) => {
        const selectedSubjectId = subjects.find(subject => subject.name === subjectName)?.subject_id || '';
        setMaterialData(prev => {
            if (prev) {
                return {
                    ...prev,
                    subject_id: selectedSubjectId
                };
            }
            return null;
        });
    }

    const onLessonSelect = (lessonName: string) => {
        const selectedLessonId = lessons.find(lesson => lesson.name === lessonName)?.lesson_id || '';
        setMaterialData(prev => {
            if (prev) {
                return {
                    ...prev,
                    lesson_id: selectedLessonId
                };
            }
            return null;
        });
    }

    const handleSave = async () => {
        // Save logic here
        if (materialId && materialData) {
            const updatedMaterial = await updateMaterial(materialId, materialData.user_id, {
                name: materialData.name,
                description: materialData.description,
                subject_id: materialData.subject_id,
                lesson_id: materialData.lesson_id,
                price: materialData.price,
                is_paid: materialData.price > 0 ? true : false,
            });
            console.log('Updated material:', updatedMaterial);
            setSuccessfulMessage('Material updated successfully!');
        }
    };

    const handleDeleteConfirm = async () => {
        if (confirmationText === defaultConfirmationText) {
            // Delete logic here
            console.log('Material deleted');
            if (materialId && materialData) {
                setIsDeleting(true);
                await deleteMaterial(materialId, materialData.user_id);
                setIsDeleting(false);
            }

            setIsDialogOpen(false);
            navigate('/');
        } else {
            setConfirmationText('');
            alert('Confirmation text does not match. Please try again.');
        }
    }

    return (
        <div className={`relative min-h-screen bg-gray-50 p-12 overflow-y-auto scrollbar-hide h-[100vh] pb-36`} ref={containerRef}>
            <div className="bg-white shadow-lg rounded-2xl p-8">
                <h1 className="text-2xl font-bold">Edit Material</h1>
                <div className='border-b border-zinc-300 my-6'></div>
                
                <div className="space-y-6">
                    {/* Read-only Information */}
                    <div className="bg-zinc-100 p-4 rounded-lg">
                        <h2 className="text-lg font-semibold mb-4 text-zinc-800">Material Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-semibold">Material ID</label>
                                <p className="text-zinc-400 bg-white px-3 py-2 rounded-lg cursor-not-allowed">{materialData?.material_id}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold">File Size</label>
                                <p className="text-zinc-400 bg-white px-3 py-2 rounded-lg cursor-not-allowed">{materialData?.size}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold">File Type</label>
                                <p className="text-zinc-400 bg-white px-3 py-2 rounded-lg cursor-not-allowed">{materialData?.file_type}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold">Pages</label>
                                <p className="text-zinc-400 bg-white px-3 py-2 rounded-lg cursor-not-allowed">{materialData?.num_page}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold">Upload Date</label>
                                <p className="text-zinc-400 bg-white px-3 py-2 rounded-lg cursor-not-allowed">{materialData ? new Date(materialData?.upload_date).toLocaleDateString() : ''}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold">Downloads</label>
                                <p className="text-zinc-400 bg-white px-3 py-2 rounded-lg cursor-not-allowed">{materialData?.download_count}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold">Rating</label>
                                <p className="text-zinc-400 bg-white px-3 py-2 rounded-lg cursor-not-allowed">{materialData? materialData.total_rating / (materialData.rating_count || 1) : 0}/5</p>
                            </div>
                            {/* <div>
                                <label className="block text-sm font-semibold">Price</label>
                                <p className="text-zinc-400 bg-white px-3 py-2 rounded-lg cursor-not-allowed">${materialData?.price}</p>
                            </div> */}
                        </div>
                    </div>
                    <div className='border-b border-zinc-300 my-6'></div>

                    {/* Editable Fields */}
                    <div>
                        <h2 className="text-lg font-semibold mb-4 text-zinc-800">Edit Details</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Material Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={materialData?.name}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    placeholder="Enter material name"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    name="description"
                                    value={materialData?.description}
                                    onChange={handleInputChange}
                                    rows={4}
                                    className="w-full h-40 px-3 py-2 border border-gray-300 rounded-md"
                                    style={{ resize: 'none'}}
                                    placeholder="Enter material description"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={materialData?.price}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    placeholder="Enter material price"
                                />
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                                    <DropdownList
                                        options={subjects.map((subject: Subject) => ({ id: subject.subject_id, name: subject.name }))}
                                        onSelect={onSubjectSelect}
                                        placeholder={subjects.find((subject: Subject) => subject.subject_id === materialData?.subject_id)?.name}
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Lesson</label>
                                    <DropdownList
                                        options={lessons.map((lesson: Lesson) => ({ id: lesson.lesson_id, name: lesson.name }))}
                                        onSelect={onLessonSelect}
                                        placeholder={lessons.find((lesson: Lesson) => lesson.lesson_id === materialData?.lesson_id)?.name}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='border-b border-zinc-300 my-6'></div>

                    {/* Danger zone */}
                    <div>
                        <h2 className="text-lg font-semibold mb-2">Delete material</h2>
                        <p className="text-sm text-zinc-500 italic mb-4">Once you delete a material, there is no going back. Please be certain.</p>
                        <button
                            type="button"
                            className="px-6 py-2 border-2 border-red-600 rounded-lg cursor-pointer text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500"
                            onClick={() => setIsDialogOpen(true)}
                        >
                            Delete Material
                        </button>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-4 pt-6 border-t">
                        <button
                            type="button"
                            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleSave}
                            className="px-6 py-2 button-primary"
                        >
                            Save Changes
                        </button>
                    </div>
                    {successfulMessage && <p className="text-green-600 mt-4">{successfulMessage}</p>}
                </div>
            </div>

            <div className={`fixed bottom-0 right-0 z-20' ${isDialogOpen ? 'block' : 'hidden'}`} style={{ width: overlaySize.width, height: overlaySize.height }}>
                <div className='absolute rounded-3xl w-full h-full top-0 left-0 bg-[#00000080] backdrop-blur-xs' onClick={() => {
                    setIsDialogOpen(false);
                }}></div>

                <div className='absolute -translate-x-1/2 left-1/2 -translate-y-1/2 top-[45%] bg-white w-[40%] rounded-xl py-4 px-6'>
                    <h1 className='font-semibold text-xl'>Are you sure?</h1>
                    <p className='text-sm text-zinc-500 mt-2'>Once you delete a material, there is no going back. Please be certain.</p>
                    <h2 className='mt-6 font-semibold text-sm'>Please type <span className='font-mono text-red-500'>{defaultConfirmationText}</span> to confirm.</h2>
                    <input
                        type="text"
                        className='w-full border border-zinc-300 rounded-lg px-3 py-2 mt-2'
                        placeholder='Type here...'
                        onChange={(e) => setConfirmationText(e.target.value)}
                        value={confirmationText}
                    />
                    <div className='flex justify-end space-x-4 mt-6'>
                        <button
                            type="button"
                            onClick={() => setIsDialogOpen(false)}
                            className="cursor-pointer px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleDeleteConfirm}
                            className="cursor-pointer px-6 py-2 rounded-lg text-white bg-red-600 border-red-600 hover:bg-red-700 flex items-center"
                        >
                            {isDeleting ? <CircularProgress size={20} color="inherit" /> : 'Confirm'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MaterialEditPage;