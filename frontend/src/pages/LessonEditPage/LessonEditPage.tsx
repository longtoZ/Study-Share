import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getLesson, updateLesson, deleteLesson } from '@/services/lessonService';
import type { Lesson } from '@interfaces/userProfile.d';

import CircularProgress from '@mui/material/CircularProgress';

const LessonEditPage = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const [lessonData, setLessonData] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmationText, setConfirmationText] = useState('');
  const defaultConfirmationText = "delete this lesson";
  const containerRef = useRef<HTMLDivElement>(null);
  const [overlaySize, setOverlaySize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const fetchLesson = async () => {
      if (!lessonId) return;
      try {
        const data = await getLesson(lessonId);
        setLessonData(data);
      } catch (error) {
        console.error("Error fetching lesson:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLesson();
  }, [lessonId]);

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

  const handleDeleteConfirm = async () => {
    if (confirmationText === defaultConfirmationText) {
        // Delete logic here
        console.log('Lesson deleted');
        if (lessonId && lessonData) {
            setIsDeleting(true);
            await deleteLesson(lessonId, lessonData.user_id);
            setIsDeleting(false);
        }

        setIsDialogOpen(false);
        navigate('/');
    } else {
        setConfirmationText('');
        alert('Confirmation text does not match. Please try again.');
    }
}

  if (loading) {
    return <div className="min-h-screen p-12">Loading...</div>;
  }

  return (
    <div className="relative min-h-screen bg-gray-50 p-12 overflow-y-auto scrollbar-hide h-[100vh] pb-36" ref={containerRef}>
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
                <p className="text-zinc-400 bg-white px-3 py-2 rounded-lg cursor-not-allowed">{lessonData?.lesson_id}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold">Created Date</label>
                <p className="text-zinc-400 bg-white px-3 py-2 rounded-lg cursor-not-allowed">{lessonData ? new Date(lessonData.created_date).toLocaleString() : ''}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold">Last Update</label>
                <p className="text-zinc-400 bg-white px-3 py-2 rounded-lg cursor-not-allowed">{(lessonData as any)?.last_updated ? new Date((lessonData as any).last_updated).toLocaleString() : '-'}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold">Material Count</label>
                <p className="text-zinc-400 bg-white px-3 py-2 rounded-lg cursor-not-allowed">{lessonData?.material_count}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold">User ID</label>
                <p className="text-zinc-400 bg-white px-3 py-2 rounded-lg cursor-not-allowed">{(lessonData as any)?.user_id}</p>
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
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
                  className="w-full h-40 px-3 py-2 border border-gray-300 rounded-md"
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

          {/* Danger zone */}
          <div>
              <h2 className="text-lg font-semibold mb-2">Delete lesson</h2>
              <p className="text-sm text-zinc-500 italic mb-4">Once you delete a lesson, there is no going back. Please be certain.</p>
              <button
                  type="button"
                  className="px-6 py-2 border-2 border-red-600 rounded-lg cursor-pointer text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500"
                  onClick={() => setIsDialogOpen(true)}
              >
                  Delete Lesson
              </button>
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

      <div className={`fixed bottom-0 right-0 z-20' ${isDialogOpen ? 'block' : 'hidden'}`} style={{ width: overlaySize.width, height: overlaySize.height }}>
          <div className='absolute rounded-3xl w-full h-full top-0 left-0 bg-[#00000080] backdrop-blur-xs' onClick={() => {
              setIsDialogOpen(false);
          }}></div>

          <div className='absolute -translate-x-1/2 left-1/2 -translate-y-1/2 top-[45%] bg-white w-[40%] rounded-xl py-4 px-6'>
              <h1 className='font-semibold text-xl'>Are you sure?</h1>
              <p className='text-sm text-zinc-500 mt-2'>Once you delete a lesson, there is no going back. Please be certain.</p>
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

export default LessonEditPage;
