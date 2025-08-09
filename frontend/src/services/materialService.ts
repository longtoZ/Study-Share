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
        console.log('Material data:', data);
        return data.material;
    } catch (error) {
        console.error('Error fetching material:', error);
    }

    return null;
};

export { getMaterial };