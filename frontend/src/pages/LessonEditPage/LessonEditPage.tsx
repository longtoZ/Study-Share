import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getLesson, updateLesson } from '@/services/lessonService';
import type { Lesson } from '@interfaces/userProfile';

const LessonEditPage = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const [lessonData, setLessonData] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchLesson = async () => {
      if (!lessonId) return;
      const data = await getLesson(lessonId);
      setLessonData(data);
      setLoading(false);
    };
    fetchLesson();
  }, [lessonId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setLessonData(prev => (prev ? { ...prev, [name]: value } as Lesson : prev));
  };

  const handleTogglePublic = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target;
    setLessonData(prev => (prev ? { ...prev, is_public: checked } : prev));
  }

  const handleSave = async () => {
    if (!lessonId || !lessonData) return;
    const updated = await updateLesson(lessonId, lessonData.user_id, {
      name: lessonData.name,
      description: lessonData.description,
      is_public: lessonData.is_public,
    });
    if (updated) {
      setLessonData(updated);
    }
  };

  if (loading) {
    return <div className="min-h-screen p-12">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-12 overflow-y-auto scrollbar-hide h-[100vh] pb-36">
      <div className="bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-2xl font-bold">Edit Lesson</h1>
        <div className='border-b border-zinc-300 my-6'></div>

        <div className="space-y-6">
          {/* Read-only Information */}
          <div className="bg-zinc-100 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-4 text-zinc-800">Lesson Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold">Lesson ID</label>
                <p className="text-zinc-800 bg-white px-3 py-2 rounded-lg cursor-not-allowed">{lessonData?.lesson_id}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold">Created Date</label>
                <p className="text-zinc-800 bg-white px-3 py-2 rounded-lg cursor-not-allowed">{lessonData ? new Date(lessonData.created_date).toLocaleString() : ''}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold">Last Update</label>
                <p className="text-zinc-800 bg-white px-3 py-2 rounded-lg cursor-not-allowed">{(lessonData as any)?.last_updated ? new Date((lessonData as any).last_updated).toLocaleString() : '-'}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold">Material Count</label>
                <p className="text-zinc-800 bg-white px-3 py-2 rounded-lg cursor-not-allowed">{lessonData?.material_count}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold">User ID</label>
                <p className="text-zinc-800 bg-white px-3 py-2 rounded-lg cursor-not-allowed">{(lessonData as any)?.user_id}</p>
              </div>
            </div>
          </div>

          <div className='border-b border-zinc-300 my-6'></div>

          {/* Editable Fields */}
          <div>
            <h2 className="text-lg font-semibold mb-4 text-zinc-800">Edit Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={lessonData?.name || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter lesson name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={lessonData?.description || ''}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full h-40 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  style={{ resize: 'none'}}
                  placeholder="Enter lesson description"
                />
              </div>

              <div className="flex items-center space-x-3">
                <input id="public" type="checkbox" checked={!!lessonData?.is_public} onChange={handleTogglePublic} />
                <label htmlFor="public" className="text-sm font-medium text-gray-700">Public</label>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-6 border-t">
            <button
              type="button"
              onClick={() => navigate(-1)}
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

export default LessonEditPage;
