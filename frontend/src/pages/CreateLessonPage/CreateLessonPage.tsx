import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid';
import { createLesson } from '@/services/lessonService';
import { useNavigate } from 'react-router-dom';

const CreateLessonPage = () => {
	const [lessonData, setLessonData] = useState({
		lesson_id: `${localStorage.getItem('user_id') || ''}-${uuidv4()}`,
		name: '',
		description: '',
		created_date: new Date().toISOString(),
		last_update: null,
		material_count: 0,
		user_id: `${localStorage.getItem('user_id') || ''}`,
		is_public: false
	});
	const [lessonNameError, setLessonNameError] = useState('');
	const [descriptionError, setDescriptionError] = useState('');
	const [lessonCreationError, setLessonCreationError] = useState('');
	const navigate = useNavigate();

	const handleSubmit = async () => {
		if (!lessonData.name) {
			setLessonNameError('Lesson name is required');
			return;
		}

		if (!lessonData.description) {
			setDescriptionError('Description is required');
			return;
		}

		try {
			await createLesson(lessonData);
			navigate(`/lessons/${lessonData.lesson_id}`);
		} catch (error) {
			console.error('Error creating lesson:', error);
			setLessonCreationError('Failed to create lesson. Please try again.');
		}
	}

	return (
		<div className='p-12 min-h-screen overflow-y-auto scrollbar-hide h-[100vh] pb-36'>
			<div className='rounded-2xl bg-primary overflow-hidden border border-primary px-10 py-6 mt-4'>
				<h1 className='text-header-medium'>Create a new lesson</h1>
				<p className='text-subtitle'>Add your materials or public resources to the lesson. Your contributions will help enrich the learning experience for everyone.</p>
				<div className='border border-t border-zinc-300 w-full my-6'></div>

				<form className='space-y-4 mt-4'>
					<div>
						<label htmlFor="name" className="block text-sm font-medium mb-2">
							Name
						</label>
						<input
							type="text"
							id="name"
							className="w-full p-2 border border-gray-300 rounded-lg focus:outline-zinc-400"
							placeholder="Enter lesson name"
							value={lessonData.name}
							onChange={(e) => setLessonData({...lessonData, name: e.target.value})}
						/>
						{lessonNameError && <p className="text-red-500 text-sm mt-1">{lessonNameError}</p>}
					</div>

					<div>
						<label htmlFor="description" className="block text-sm font-medium mb-2">
							Description
						</label>
						<textarea
							id="description"
							rows={4}
							className="w-full p-2 border border-gray-300 rounded-lg focus:outline-zinc-400"
							placeholder="Enter lesson description"
							value={lessonData.description}
							onChange={(e) => setLessonData({...lessonData, description: e.target.value})}
						/>
						{descriptionError && <p className="text-red-500 text-sm mt-1">{descriptionError}</p>}
					</div>

					<div>
						<label htmlFor="is-public" className="block text-sm font-medium mb-2">
							Public
						</label>
						<div>
							<input 
								type='radio' 
								id='option-yes' 
								name='is-public' 
								value='Yes'
								checked={lessonData.is_public === true}
								onChange={() => setLessonData({...lessonData, is_public: true})}
							/>
							<label htmlFor='option-yes' className='ml-2'>Yes</label>
							<br/>
							<input 
								type='radio' 
								id='option-no' 
								name='is-public' 
								value='No'
								checked={lessonData.is_public === false}
								onChange={() => setLessonData({...lessonData, is_public: false})}
							/>
							<label htmlFor='option-no' className='ml-2'>No</label>
						</div>
					</div>

					<div>
						<label htmlFor="filetype" className="block text-sm font-medium mb-2">
							Created date
						</label>
						<input
							type="date"
							id="uploaddate"
							className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed focus:outline-zinc-400"
							readOnly
							defaultValue={lessonData.created_date.split('T')[0]}
						/>
					</div>
				</form>

				<div className='flex justify-center mt-8'>
					<button className='button-outline mr-4 px-4 py-3 w-40' onClick={() => {
						setLessonData({
							lesson_id: `${localStorage.getItem('user_id') || ''}-${uuidv4()}`,
							name: '',
							description: '',
							created_date: new Date().toISOString(),
							last_update: null,
							material_count: 0,
							user_id: `${localStorage.getItem('user_id') || ''}`,
							is_public: false
						});
					}}>
						Clear
					</button>
					<button className='button-primary px-4 py-3 w-40' onClick={handleSubmit}>
						Create lesson
					</button>
				</div>

				{lessonCreationError && 
					<div className="mx-20 mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
						{lessonCreationError}
					</div>
				}

			</div>
		</div>
	)
}

export default CreateLessonPage