import React, { useState, useEffect } from 'react';
import { getMaterial } from '@services/materialService';
import { useParams } from 'react-router-dom';
import { retrieveLessons, retrieveAllSubjects } from '@/services/userService';
import { updateMaterial } from '@services/materialService';

import type { Subject } from '@interfaces/table';
import type { Lesson } from '@interfaces/userProfile';
import type { Material } from '@interfaces/table';

import DropdownList from '@components/common/DropdownList';

const MaterialEditPage: React.FC = () => {
    const [materialData, setMaterialData] = useState<Material | null>(null);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [lessons, setLessons] = useState<Lesson[]>([]);

    const { materialId } = useParams();
    const userId = localStorage.getItem('user_id') || '';

    useEffect(() => {
        const fetchData = async () => {
            if (!materialId) return;

            const material = await getMaterial(materialId);
            const subjects = await retrieveAllSubjects();
            const lessons = await retrieveLessons(userId, "newest");
            console.log(lessons)

            setMaterialData(material);
            setSubjects(subjects);
            setLessons(lessons);
        };
        fetchData();
    }, [materialId]);

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
            const updatedMaterial = await updateMaterial(materialId, {
                name: materialData.name,
                description: materialData.description,
                subject_id: materialData.subject_id,
                lesson_id: materialData.lesson_id
            });
            console.log('Updated material:', updatedMaterial);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-12">
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
                                <p className="text-zinc-800 bg-white px-3 py-2 rounded-lg cursor-not-allowed">{materialData?.material_id}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold">File Size</label>
                                <p className="text-zinc-800 bg-white px-3 py-2 rounded-lg cursor-not-allowed">{materialData?.size}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold">File Type</label>
                                <p className="text-zinc-800 bg-white px-3 py-2 rounded-lg cursor-not-allowed">{materialData?.file_type}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold">Pages</label>
                                <p className="text-zinc-800 bg-white px-3 py-2 rounded-lg cursor-not-allowed">{materialData?.num_page}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold">Upload Date</label>
                                <p className="text-zinc-800 bg-white px-3 py-2 rounded-lg cursor-not-allowed">{materialData ? new Date(materialData?.upload_date).toLocaleDateString() : ''}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold">Downloads</label>
                                <p className="text-zinc-800 bg-white px-3 py-2 rounded-lg cursor-not-allowed">{materialData?.download_count}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold">Rating</label>
                                <p className="text-zinc-800 bg-white px-3 py-2 rounded-lg cursor-not-allowed">{materialData? materialData.total_rating / (materialData.rating_count || 1) : 0}/5</p>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold">Price</label>
                                <p className="text-zinc-800 bg-white px-3 py-2 rounded-lg cursor-not-allowed">${materialData?.price}</p>
                            </div>
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
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                                    className="w-full h-40 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    style={{ resize: 'none'}}
                                    placeholder="Enter material description"
                                />
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                                    <DropdownList
                                        options={subjects.map((subject: Subject) => subject.name)}
                                        onSelect={onSubjectSelect}
                                        placeholder={subjects.find((subject: Subject) => subject.subject_id === materialData?.subject_id)?.name}
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Lesson</label>
                                    <DropdownList
                                        options={lessons.map((lesson: Lesson) => lesson.name)}
                                        onSelect={onLessonSelect}
                                        placeholder={lessons.find((lesson: Lesson) => lesson.lesson_id === materialData?.lesson_id)?.name}
                                    />
                                </div>
                            </div>
                        </div>
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
                </div>
            </div>
        </div>
    );
};

export default MaterialEditPage;