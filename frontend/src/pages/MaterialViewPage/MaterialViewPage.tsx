import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';

const GET_MATERIAL_ENDPOINT = import.meta.env.VITE_GET_MATERIAL_ENDPOINT;
const GET_MATERIAL_PAGE_ENDPOINT = import.meta.env.VITE_GET_MATERIAL_PAGE_ENDPOINT;

interface IImagePage {
	pageNumber: number;
	imageUrl: string;
}

const MaterialViewPage = () => {
	const [material, setMaterial] = useState(null);
	const [imagePages, setImagePages] = useState<IImagePage[]>([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(0);

	const materialViewRef = useRef(null);
	const { materialId } = useParams();

	const getImagePage = async (pageNumber: number) => {
		const imageUrl = GET_MATERIAL_PAGE_ENDPOINT.replace('material-id', materialId).replace('page-number', pageNumber.toString());

		try {
			const response = await fetch(imageUrl);
			if (!response.ok) {
				throw new Error('Failed to fetch material page');
			}

			const blob = await response.blob();
			const imageObjectURL = URL.createObjectURL(blob);
			console.log(imageObjectURL)

			setImagePages(prevImages => {
				const newImagePage: IImagePage = {
					pageNumber: pageNumber,
					imageUrl: imageObjectURL
				};
				
				if (prevImages.some(image => image.pageNumber === pageNumber)) {
					return prevImages.map(image => 
						image.pageNumber === pageNumber ? newImagePage : image
					).sort((a, b) => a.pageNumber - b.pageNumber);
				}

				return [...prevImages, newImagePage].sort((a, b) => a.pageNumber - b.pageNumber);
			});
		} catch (error) {
			console.error('Error fetching material page:', error);
		}
	}

	useEffect(() => {
		const getMaterial = async () => {
			console.log('Fetching material with ID:', materialId);
			const getMaterialUrl = GET_MATERIAL_ENDPOINT.replace('material-id', materialId);

			try {
				const response = await fetch(getMaterialUrl);
				if (!response.ok) {
					throw new Error('Failed to fetch material');
				}

				const data = await response.json();
				console.log('Material data:', data);
				setMaterial(data.material);
				setTotalPages(data.material.num_page);
			} catch (error) {
				console.error('Error fetching material:', error);
			}
		};

		getMaterial();
	}, [materialId]);

	useEffect(() => {
		if (!materialId || !currentPage) return;

		const getImagePageAsync = async (page: number) => {
			await getImagePage(page);
		}
		getImagePageAsync(currentPage);
	}, [materialId, currentPage]);

	const handleOnScroll = async (e: any) => {
		const scrollTop = e.target.scrollTop;
		const scrollHeight = e.target.scrollHeight;
		const clientHeight = e.target.clientHeight;

		// console.log('Scroll Top:', scrollTop);
		// console.log('Scroll Height:', scrollHeight);
		// console.log('Client Height:', clientHeight);
		// console.log('Current Page:', currentPage);
		// console.log('Total Pages:', totalPages);

		if (scrollTop + clientHeight >= scrollHeight - 10 && currentPage < totalPages) {
			console.log('Loading next page:', currentPage + 1);
			
			setCurrentPage(prevPage => prevPage + 1);
		}
	}

	return (
		<div>
			<h1>Material</h1>
			<div ref={materialViewRef} onScroll={handleOnScroll} className='w-[100%] h-[100vh] overflow-y-scroll'>
				{material && imagePages.length !== 0 && (
					imagePages.map((image, index) => (
						<div key={index} className="material-page">
							<img src={image.imageUrl} alt={`Page ${image.pageNumber}`} />
						</div>
					))
				)}
			</div>
		</div>
	)
}

export default MaterialViewPage;