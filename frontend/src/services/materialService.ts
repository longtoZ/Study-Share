import { ENDPOINTS } from "@/constants/endpoints";

const GET_MATERIAL_ENDPOINT = ENDPOINTS.GET_MATERIAL;
const UPLOAD_ENDPOINT = ENDPOINTS.UPLOAD;
const GET_MATERIAL_PAGE_ENDPOINT = ENDPOINTS.GET_MATERIAL_PAGE;
const SEARCH_MATERIAL_ENDPOINT = ENDPOINTS.SEARCH_MATERIAL;
const DOWNLOAD_MATERIAL_ENDPOINT = ENDPOINTS.DOWNLOAD_MATERIAL;

const getMaterial = async (materialId: string) => {
    console.log('Fetching material with ID:', materialId);
    const getMaterialUrl = GET_MATERIAL_ENDPOINT.replace('material-id', materialId);

    try {
        const response = await fetch(getMaterialUrl);
        if (!response.ok) {
            throw new Error('Failed to fetch material');
        }

        const data = await response.json();
        return data.material;
    } catch (error) {
        console.error('Error fetching material:', error);
    }

    return null;
};

const getMaterialPage = async (materialId: string, page: number, isPaid: boolean) => {
    console.log('Fetching material page:', page, 'for material ID:', materialId);
    const getMaterialPageUrl = GET_MATERIAL_PAGE_ENDPOINT
        .replace('material-id', materialId)
        .replace('page-number', page.toString());

    try {
        const response = await fetch(getMaterialPageUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ isPaid })
        });
        if (!response.ok) {
            throw new Error('Failed to fetch material page');
        }

        const data = await response.blob();
        return URL.createObjectURL(data);
    } catch (error) {
        console.error('Error fetching material page:', error);
    }

    return null;
};

const updateMaterial = async (materialId: string, authorId: string, updatedData: any) => {
    console.log('Updating material with ID:', materialId);
    const updateMaterialUrl = GET_MATERIAL_ENDPOINT.replace('material-id', materialId);
    const token = localStorage.getItem('jwt_token') || '';

    try {
        const response = await fetch(updateMaterialUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ authorId, updatedData }),
        });
        if (!response.ok) {
            throw new Error('Failed to update material');
        }

        const data = await response.json();
        return data.material;
    } catch (error) {
        console.error('Error updating material:', error);
    }

    return null;
};

const searchMaterial = async (query: string, filters: any) => {
    console.log('Searching materials with query:', query, 'and filters:', filters);

    try {
        const response = await fetch(`${SEARCH_MATERIAL_ENDPOINT}?query=${encodeURIComponent(query)}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ filters })
        });
        if (!response.ok) {
            throw new Error('Failed to search materials');
        }

        const data = await response.json();
        return data.materials;
    } catch (error) {
        console.error('Error searching materials:', error);
    }

    return [];
}

const getMaterialUrl = async (materialId: string) => {
    console.log('Fetching material URL with ID:', materialId);
    const getMaterialUrl = DOWNLOAD_MATERIAL_ENDPOINT.replace('material-id', materialId);

    try {
        const response = await fetch(getMaterialUrl);
        if (!response.ok) {
            throw new Error('Failed to fetch material URL');
        }

        const data = await response.json();
        return data.fileUrl;
    } catch (error) {
        console.error('Error fetching material URL:', error);
    }

    return null;
}

const uploadMaterial = async (formData: FormData) => {
    try {
        const response = await fetch(UPLOAD_ENDPOINT, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) throw new Error('Failed to upload file');

        const data = await response.json();
        console.log('File uploaded successfully:', data);
        return data;
    } catch (error) {
        console.error('Error uploading file:', error);
        throw error;
    }
}

const deleteMaterial = async (materialId: string, authorId: string) => {
    console.log('Deleting material with ID:', materialId);
    const deleteMaterialUrl = GET_MATERIAL_ENDPOINT.replace('material-id', materialId);
    const token = localStorage.getItem('jwt_token') || '';

    try {
        const response = await fetch(deleteMaterialUrl, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ authorId })
        });
        if (!response.ok) {
            throw new Error('Failed to delete material');
        }

        const data = await response.json();
        return data.material;
    } catch (error) {
        console.error('Error deleting material:', error);
    }

    return null;
};

export { getMaterial, uploadMaterial, getMaterialPage, updateMaterial, searchMaterial, getMaterialUrl, deleteMaterial };