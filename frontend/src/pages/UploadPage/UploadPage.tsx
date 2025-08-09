import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { deleteAllMaterials } from "@/redux/materialSlice";
import { v4 as uuidv4 } from 'uuid';

import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';

import Upload from "./components/Upload";
import type { Subject } from '@/interfaces/table';
import type { Material } from '@/interfaces/table';

const SUBJECTS_ENDPOINT = import.meta.env.VITE_GET_ALL_SUBJECTS_ENDPOINT;
const UPLOAD_ENDPOINT = import.meta.env.VITE_UPLOAD_ENDPOINT;

interface FileData {
	material_id: string;
	file: File;
};

const UploadPage = () => {
	const [filesData, setFilesData] = useState<FileData[]>([]);
	const [isDragging, setIsDragging] = useState(false);
	const [subjects, setSubjects] = useState<Subject[]>([]);

	const dropRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	const navigate = useNavigate();

	const user = useSelector((state: any) => state.user);
	const materials = useSelector((state: any) => state.materials);
	const dispatch = useDispatch();

	const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
		event.preventDefault();
		event.stopPropagation();
		setIsDragging(true);
	}

	const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
		event.preventDefault();
		event.stopPropagation();
		setIsDragging(false);
	}

	const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
		event.preventDefault();
		event.stopPropagation();
		setIsDragging(false);
		
		if (event.dataTransfer.files) {
			const droppedFiles = Array.from(event.dataTransfer.files) as File[];
			const fileDataArray = droppedFiles.map(file => ({
				material_id: `${localStorage.getItem('user_id') || ''}-${uuidv4()}`,
				file: file
			}));
			setFilesData((prevFiles) => [...prevFiles, ...fileDataArray]);
		}
	}

	const handleFileSelect = (event: any) => {
		const selectedFiles = Array.from(event.target.files) as File[];
		const fileDataArray = selectedFiles.map(file => ({
			material_id: `${localStorage.getItem('user_id') || ''}-${uuidv4()}`,
			file: file
		}));
		setFilesData((prevFiles) => [...prevFiles, ...fileDataArray]);
	}

	const handleSubmit = async () => {
		if (materials.materials.length === 0) {
			alert('Please add at least one material before submitting.');
			return;
		}

		materials.materials.forEach(async (material: Material) => {
			const formData = new FormData();
			formData.append('file', filesData.find(f => f.material_id === material.material_id)?.file as File);
			formData.append('metadata', JSON.stringify(material));
			console.log('Submitting material:', formData);

			try {
				const response = await fetch(UPLOAD_ENDPOINT, {
					method: 'POST',
					body: formData
				});

				if (!response.ok) throw new Error('Failed to upload file');

				const data = await response.json();
				console.log('File uploaded successfully:', data);
			} catch (error) {
				console.error('Error uploading file:', error);
			}
		});

		setFilesData([]);
		dispatch(deleteAllMaterials());
		if (inputRef.current) inputRef.current.value = '';
	}
	useEffect(() => {
		console.log(user);
		if (!user.loggedIn) {
			console.log('You havent logged in yet!');
			navigate('/login');
		}
	}, []);

	// Fetch subjects from backend
	useEffect(() => {
		const fetchSubjects = async () => {
			try {
				const response = await fetch(SUBJECTS_ENDPOINT);
				if (!response.ok) throw new Error('Failed to fetch subjects');
				const data = await response.json();
				console.log(data);
				setSubjects(data.subjects || []);
			} catch (error) {
				console.error('Error fetching subjects:', error);
			}
		};

		console.log(user);
		if (!user.loggedIn) {
			console.log('You havent logged in yet!');
			navigate('/login');
			return;
		}

		fetchSubjects();
	}, []);

	return (
		<div className="p-12 min-h-screen w-full">
			<div className="mx-auto rounded-2xl bg-primary overflow-hidden border border-primary p-6">
				<h1 className="text-header-large ml-20 mb-2">Add Document</h1>
				<p className="text-subtitle ml-20 mb-8">
					You can upload multiple files at once. Remember to fill in the details for each file after uploading.
				</p>
				
				{filesData.length <= 0 ? ( 
					<div 
						ref={dropRef}
						onDragOver={handleDragOver}
						onDragLeave={handleDragLeave}
						onDrop={handleDrop}
						onClick={() => inputRef.current?.click()}
						className="border-2 border-dashed border-gray-300 rounded-xl p-12 mx-20 max-h-[20rem] text-center hover:border-zinc-400 hover:bg-zinc-50 transition-all duration-300 cursor-pointer group">
						<div className="flex flex-col items-center space-y-4">
							<div className="p-4 bg-zinc-100 rounded-full group-hover:bg-zinc-200 transition-colors duration-300">
								<CloudUploadOutlinedIcon className="text-zinc-600 text-4xl" />
							</div>
							
							<div className="space-y-2">
								<h3 className="text-xl font-semibold text-gray-700">Drop your files here</h3>
								<p className="text-gray-500">or click to browse</p>
							</div>
							
							<div className="text-sm text-gray-400">
								Supported formats: PDF, DOC, DOCX, PPT, PPTX
							</div>

							<input 
								ref={inputRef}
								type="file"
								multiple
								accept=".pdf,.doc,.docx,.ppt,.pptx"
								onChange={handleFileSelect}
								className="hidden" 
							/>
						</div>
					</div>
				) : (
					<div className="border-2 border-dashed border-gray-300 rounded-lg p-12 mx-20 max-h-[20rem] overflow-y-scroll">
						{filesData.map((f, index) => (
							<div key={index} className="p-4 my-2 border border-primary rounded-xl cursor-pointer flex justify-between items-center hover:border-primary transition-all duration-200">
								<div onClick={() => (
									window.open(URL.createObjectURL(f.file), '_blank')
								)} className="cursor-pointer">
									<p className="font-semibold">{f.file.name}</p>
									<p className="text-sm text-gray-500">{(f.file.size / 1024).toFixed(2)} KB</p>
								</div>
								<button 
									className="transition-colors duration-200"
									onClick={() => setFilesData(filesData.filter((_, i) => i !== index))}>
									<ClearRoundedIcon />
								</button>
							</div>
						))}
					</div>
				)}
			
				{filesData.length > 0 && (
					<div className="mx-20 mt-14">
						<div className="border-t border-primary w-full mb-10"></div>
						<h2 className="text-header-medium">Added Files</h2>
						<p className="text-subtitle mt-1">
							You can now edit the details of each file before final submission.
						</p>
						<div className="mt-4">
							{filesData.map((f, index) => (
								<Upload file={f.file} material_id={f.material_id} key={index} subjects={subjects} />
							))}
						</div>

						<div className="mt-6 text-center">
							<button className="button-outline mr-4 w-36 text-gray-700 px-8 py-3 font-medium transition-colors duration-200" onClick={() => {
								setFilesData([]);
								if (inputRef.current) inputRef.current.value = '';
							}}>
								Clear
							</button>
							<button className="button-primary w-36 text-white px-8 py-3 font-medium transition-colors duration-200" onClick={handleSubmit}>
								Submit
							</button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default UploadPage;
