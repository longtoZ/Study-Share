import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid';

const CREATE_LESSON_ENDPOINT = import.meta.env.VITE_CREATE_LESSON_ENDPOINT;

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

	const handleSubmit = async () => {
		try {
			const response = await fetch(CREATE_LESSON_ENDPOINT, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(lessonData),
			});
			if (!response.ok) {
				throw new Error('Failed to create new lesson');
			}

			const data = await response.json();
			console.log('New lesson created successfully!', data);
		} catch (error) {
			console.error('Error creating new lesson!');
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
							placeholder="Enter document name"
							onChange={(e) => setLessonData({...lessonData, name: e.target.value})}
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
							onChange={(e) => setLessonData({...lessonData, description: e.target.value})}
						/>
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
					<button className='button-outline mr-4 px-4 py-3 w-40'>
						Clear
					</button>
					<button className='button-primary px-4 py-3 w-40' onClick={handleSubmit}>
						Create lesson
					</button>
				</div>

			</div>
		</div>
	)
}

export default CreateLessonPage