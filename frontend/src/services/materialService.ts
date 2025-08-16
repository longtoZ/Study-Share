const GET_MATERIAL_ENDPOINT = import.meta.env.VITE_GET_MATERIAL_ENDPOINT;

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

export { getMaterial, updateMaterial };