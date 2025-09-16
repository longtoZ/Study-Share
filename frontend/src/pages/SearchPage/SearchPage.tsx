import React, { useState, useEffect } from 'react';
import MaterialsGrid from '@components/layout/MaterialsGrid';
import LessonsGrid from '@components/layout/LessonsGrid';

import type { Subject } from '@/interfaces/table.d';
import type { LessonExtended, MaterialExtended } from '@/interfaces/userProfile.d';

import { retrieveAllSubjects } from '@/services/userService';
import { retrieveLessons } from '@/services/userService';
import { searchMaterial } from '@/services/materialService';
import { searchLesson } from '@/services/lessonService';

import DropdownList from '@components/common/DropdownList';

import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import TuneOutlinedIcon from '@mui/icons-material/TuneOutlined';

type TabKey = 'materials' | 'lessons';
type MaterialSort = 'upload_date' | 'download_count' | 'view_count' | 'rating_count';
type LessonSort = 'created_date' | 'material_count';
type OrderSort = 'asc' | 'desc';

interface MaterialFilters {
    from?: string;
    to?: string;
    author?: string;
    subject_id?: string;
    lesson_id?: string;
    sort_by: MaterialSort;
    order: OrderSort;
}

interface LessonFilters {
    from?: string;
    to?: string;
    author?: string;
    sort_by: LessonSort;
    order: OrderSort;
}

const SearchPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<TabKey>('materials');
    const [queryInput, setQueryInput] = useState('');
    const [showFilters, setShowFilters] = useState(true);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [lessons, setLessons] = useState<LessonExtended[]>([]);

    const [retrievedMaterials, setRetrievedMaterials] = useState<MaterialExtended[]>([]);
    const [retrievedLessons, setRetrievedLessons] = useState<LessonExtended[]>([]);

    const materialSortOptions = [
        {id: 'upload_date', name: 'Date created'},
        {id: 'download_count', name: 'Downloads count'},
        {id: 'view_count', name: 'Views count'},
        {id: 'rating_count', name: 'Rating'},
    ];

    const lessonSortOptions = [
        {id: 'created_date', name: 'Date created'},
        {id: 'material_count', name: 'Material count'},
    ];

    const orderOptions = [
        {id: 'asc', name: 'Ascending'},
        {id: 'desc', name: 'Descending'},
    ];

    const userId = localStorage.getItem('user_id') || '';

    useEffect(() => {
        const fetchData = async () => {
            const subjects = await retrieveAllSubjects();
            const lessons = await retrieveLessons(userId, 'newest', { from: 0, to: 99 });

            subjects.push({ subject_id: '', name: 'All Subjects', description: '' });
            lessons.push({
                user_id: '',
                lesson_id: '',
                name: 'All Lessons',
                description: '',
                created_date: '',
                material_count: 0,
                is_public: false,
                user_name: '',
                profile_picture_url: '',
                background_image_url: '',
                view_count: 0
            });
            setSubjects(subjects);
            setLessons(lessons);
        }

        fetchData();
    }, []);

    const [materialFilters, setMaterialFilters] = useState<MaterialFilters>({
        from: new Date(0).toISOString().split('T')[0], // Default to epoch start
        to: new Date().toISOString().split('T')[0], // Default to today
        subject_id: '',
        lesson_id: '',
        author: '',
        sort_by: 'upload_date',
        order: 'desc',
    });

    const [lessonFilters, setLessonFilters] = useState<LessonFilters>({
        from: new Date(0).toISOString().split('T')[0], // Default to epoch start
        to: new Date().toISOString().split('T')[0], // Default to today
        author: '',
        sort_by: 'created_date',
        order: 'desc',
    });

    const onSubmitSearch = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();

        if (queryInput === '') {
            alert('Please enter a search query');
            return;
        }

        setRetrievedMaterials([]);
        setRetrievedLessons([]);

        const materials = await searchMaterial(queryInput, materialFilters);
        const lessons = await searchLesson(queryInput, lessonFilters);
        setRetrievedMaterials(materials);
        setRetrievedLessons(lessons);
    };

    return (
        <div className='overflow-y-auto scrollbar-hide h-[100vh] pb-36'>
            <div className="flex flex-col gap-4 p-6 m-12 mb-6 bg-primary rounded-xl">
                <h1 className='font-bold text-2xl'>Search</h1>
                {/* Search bar */}
                <form
                    onSubmit={onSubmitSearch}
                    className="flex items-center gap-2 border border-zinc-300 rounded-xl p-2"
                >
                    <SearchOutlinedIcon />
                    <input
                        aria-label="Search"
                        type="text"
                        value={queryInput}
                        onChange={(e) => setQueryInput(e.target.value.trim())}
                        placeholder="Search materials or lessons..."
                        className="flex-1 bg-transparent border-0 outline-none text-sm py-1.5 px-1"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') onSubmitSearch();
                        }}
                    />
                    <button
                        type="button"
                        aria-label="Toggle filters"
                        onClick={() => setShowFilters((s) => !s)}
                        className="cursor-pointer inline-flex items-center gap-1.5 text-gray-700 hover:text-gray-900 p-1.5 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500"
                        title="Filters"
                    >
                        <TuneOutlinedIcon />
                    </button>
                    <button
                        type="submit"
                        aria-label="Search"
                        className="button-primary px-4 py-2 w-28"
                        title="Search"
                        onClick={onSubmitSearch}
                    >
                        Search
                    </button>
                </form>

                {/* Tabs */}
                <div className="flex gap-2 border-b border-gray-200">
                    <button
                        type="button"
                        onClick={() => setActiveTab('materials')}
                        className={`px-3 py-2 cursor-pointer font-semibold bg-transparent focus:outline-none border-b-[3px] ${
                            activeTab === 'materials'
                                ? 'border-blue-600 text-blue-600'
                                : 'border-transparent text-gray-600'
                        }`}
                    >
                        Material
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('lessons')}
                        className={`px-3 py-2 cursor-pointer font-semibold bg-transparent focus:outline-none border-b-[3px] ${
                            activeTab === 'lessons'
                                ? 'border-blue-600 text-blue-600'
                                : 'border-transparent text-gray-600'
                        }`}
                    >
                        Lesson
                    </button>
                </div>

                {/* Filters */}
                {showFilters && (
                    <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 border border-zinc-300 rounded-lg p-3">
                        {/* Date range */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs text-gray-600 flex items-center gap-1.5">
                                From
                            </label>
                            <input
                                type="date"
                                value={activeTab === 'materials' ? (materialFilters.from || '') : (lessonFilters.from || '')}
                                onChange={(e) =>
                                    activeTab === 'materials'
                                        ? setMaterialFilters((f) => ({ ...f, from: e.target.value }))
                                        : setLessonFilters((f) => ({ ...f, from: e.target.value }))
                                }
                                className="p-2 rounded-md border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs text-gray-600 flex items-center gap-1.5">
                                To
                            </label>
                            <input
                                type="date"
                                value={activeTab === 'materials' ? (materialFilters.to || '') : (lessonFilters.to || '')}
                                onChange={(e) =>
                                    activeTab === 'materials'
                                        ? setMaterialFilters((f) => ({ ...f, to: e.target.value }))
                                        : setLessonFilters((f) => ({ ...f, to: e.target.value }))
                                }
                                className="p-2 rounded-md border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs text-gray-600 flex items-center gap-1.5">
                                Author
                            </label>
                            <input
                                type="text"
                                value={activeTab === 'materials' ? (materialFilters.author || '') : (lessonFilters.author || '')}
                                placeholder='Author id...'
                                onChange={(e) =>
                                    activeTab === 'materials'
                                        ? setMaterialFilters((f) => ({ ...f, author: e.target.value }))
                                        : setLessonFilters((f) => ({ ...f, author: e.target.value }))
                                }
                                className="p-2 rounded-md border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Material-only filters */}
                        {activeTab === 'materials' && (
                            <>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs text-gray-600 flex items-center gap-1.5">
                                        Subject
                                    </label>
                                    <DropdownList options={subjects.map(subject => ({ id: subject.subject_id, name: subject.name }))} onSelect={(value) => {
                                        setMaterialFilters((f) => ({ ...f, subject_id: value }));
                                    }} />
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs text-gray-600 flex items-center gap-1.5">
                                        In lesson
                                    </label>
                                    <DropdownList options={lessons.map(lesson => ({ id: lesson.lesson_id, name: lesson.name }))} onSelect={(value) => {
                                        setMaterialFilters((f) => ({ ...f, lesson_id: value }));
                                    }} />
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs text-gray-600 flex items-center gap-1.5">
                                        Sort by
                                    </label>
                                    <DropdownList options={materialSortOptions} onSelect={(value) => {
                                        setMaterialFilters((f) => ({ ...f, sort_by: value as MaterialSort }));
                                    }} />
                                </div>
                            </>
                        )}

                        {/* Lesson-only filters */}
                        {activeTab === 'lessons' && (
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs text-gray-600 flex items-center gap-1.5">
                                    Sort by
                                </label>
                                <DropdownList options={lessonSortOptions} onSelect={(value) => {
                                    setLessonFilters((f) => ({ ...f, sort_by: value as LessonSort }));
                                }} />
                            </div>
                        )}

                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs text-gray-600 flex items-center gap-1.5">
                                Order
                            </label>
                            <DropdownList options={orderOptions} onSelect={(value) => {
                                if (activeTab === 'materials') {
                                    setMaterialFilters((f) => ({ ...f, order: value as OrderSort }));
                                } else {
                                    setLessonFilters((f) => ({ ...f, order: value as OrderSort }));
                                }
                            }} />
                        </div>
                    </div>
                )}
            </div>

            <div className="flex flex-col gap-4 p-6 m-12 mt-4 rounded-xl bg-primary">
                <h1 className="text-xl font-semibold">{activeTab === 'materials' ? 'Materials' : 'Lessons'}</h1>
                {activeTab === 'materials' ? (
                    <MaterialsGrid materials={retrievedMaterials} />
                ) : (
                    <LessonsGrid lessons={retrievedLessons} />
                )}
            </div>
        </div>
    );
};

export default SearchPage;
