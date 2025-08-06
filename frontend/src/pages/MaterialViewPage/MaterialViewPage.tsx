import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';

const GET_MATERIAL_ENDPOINT = import.meta.env.VITE_GET_MATERIAL_ENDPOINT;
const GET_MATERIAL_PAGE_ENDPOINT = import.meta.env.VITE_GET_MATERIAL_PAGE_ENDPOINT;

const MaterialViewPage = () => {
	const [material, setMaterial] = useState(null);
	const [imagePages, setImagePages] = useState<string[]>([]);
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

			setImagePages(prevImages => [...prevImages, imageObjectURL]);
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
		getImagePage(currentPage);
	}, [materialId, currentPage]);

	const handleOnScroll = async (e: any) => {
		const scrollTop = e.target.scrollTop;
		const scrollHeight = e.target.scrollHeight;
		const clientHeight = e.target.clientHeight;

		console.log('Scroll Top:', scrollTop);
		console.log('Scroll Height:', scrollHeight);
		console.log('Client Height:', clientHeight);
		console.log('Current Page:', currentPage);
		console.log('Total Pages:', totalPages);

		if (scrollTop >= scrollHeight * 0.5 && currentPage < totalPages) {
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
							<img src={image} alt={`Page ${index + 1}`} />
						</div>
					))
				)}
			</div>
		</div>
	)
}

export default MaterialViewPage;