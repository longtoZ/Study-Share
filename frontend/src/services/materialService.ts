const GET_MATERIAL_ENDPOINT = import.meta.env.VITE_GET_MATERIAL_ENDPOINT;
const SEARCH_MATERIAL_ENDPOINT = import.meta.env.VITE_SEARCH_MATERIAL_ENDPOINT;
const DOWNLOAD_MATERIAL_ENDPOINT = import.meta.env.VITE_DOWNLOAD_MATERIAL_ENDPOINT;

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

const updateMaterial = async (materialId: string, updatedData: any) => {
    console.log('Updating material with ID:', materialId);
    const updateMaterialUrl = GET_MATERIAL_ENDPOINT.replace('material-id', materialId);
    const token = localStorage.getItem('user_token') || '';

    try {
        const response = await fetch(updateMaterialUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(updatedData),
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

const deleteMaterial = async (materialId: string) => {
    console.log('Deleting material with ID:', materialId);
    const deleteMaterialUrl = GET_MATERIAL_ENDPOINT.replace('material-id', materialId);
    const token = localStorage.getItem('user_token') || '';

    try {
        const response = await fetch(deleteMaterialUrl, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
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

export { getMaterial, updateMaterial, searchMaterial, getMaterialUrl, deleteMaterial };