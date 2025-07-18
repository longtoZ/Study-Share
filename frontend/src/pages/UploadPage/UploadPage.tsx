import { useState, useEffect, useRef } from "react";
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';

import Upload from "./components/Upload";

const AddPage = () => {
	const [files, setFiles] = useState<File[]>([]);
	const [isDragging, setIsDragging] = useState(false);
	const dropRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	const handleDragOver = (event) => {
		event.preventDefault();
		event.stopPropagation();
		setIsDragging(true);
	}

	const handleDragLeave = (event) => {
		event.preventDefault();
		event.stopPropagation();
		setIsDragging(false);
	}

	const handleDrop = (event) => {
		event.preventDefault();
		event.stopPropagation();
		setIsDragging(false);
		
		if (event.dataTransfer.files) {
			const droppedFiles = Array.from(event.dataTransfer.files) as File[];
			setFiles((prevFiles) => [...prevFiles, ...droppedFiles]);
		}
	}

	const handleFileSelect = (event) => {
		const selectedFiles = Array.from(event.target.files) as File[];
		setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
	}

	return (
		<div className="p-12 min-h-screen w-full">
			<div className="mx-auto rounded-2xl bg-primary overflow-hidden border border-primary p-6">
				<h1 className="text-header-large ml-20 mb-2">Add Document</h1>
				<p className="text-subtitle ml-20 mb-8">
					You can upload multiple files at once. Remember to fill in the details for each file after uploading.
				</p>
				
				{files.length <= 0 ? ( 
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
						{files.map((file, index) => (
							<div key={index} className="p-4 my-2 border border-primary rounded-xl cursor-pointer flex justify-between items-center hover:border-primary transition-all duration-200">
								<div onClick={() => (
									window.open(URL.createObjectURL(file), '_blank')
								)} className="cursor-pointer">
									<p className="font-semibold">{file.name}</p>
									<p className="text-sm text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
								</div>
								<button 
									className="transition-colors duration-200"
									onClick={() => setFiles(files.filter((_, i) => i !== index))}>
									<ClearRoundedIcon />
								</button>
							</div>
						))}
					</div>
				)}
			
				{files.length > 0 && (
					<div className="mx-20 mt-14">
						<div className="border-t border-primary w-full mb-10"></div>
						<h2 className="text-header-medium">Added Files</h2>
						<p className="text-subtitle mt-1">
							You can now edit the details of each file before final submission.
						</p>
						<div className="mt-4">
							{files.map((file, index) => (
								<Upload title={file.name} type={file.type} size={file.size} key={index} />
							))}
						</div>

						<div className="mt-6 text-center">
							<button className="button-primary w-36 text-white px-8 py-3 font-medium transition-colors duration-200" onClick={() => {
								alert('Files submitted successfully!');
								setFiles([]);
								if (inputRef.current) inputRef.current.value = '';
							}}>
								Submit
							</button>
							<button className="button-outline ml-4 w-36 text-gray-700 px-8 py-3 font-medium transition-colors duration-200" onClick={() => {
								setFiles([]);
								if (inputRef.current) inputRef.current.value = '';
							}}>
								Clear
							</button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default AddPage;
