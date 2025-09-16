import type { Rating } from "@/interfaces/table.d";
import { ENDPOINTS } from "@/constants/endpoints";

const RATE_MATERIAL_ENDPOINT = ENDPOINTS.RATE_MATERIAL;
const GET_MATERIAL_RATING_ENDPOINT = ENDPOINTS.GET_MATERIAL_RATING;
const CHECK_USER_RATING_ENDPOINT = ENDPOINTS.CHECK_USER_RATING;

const rateMaterial = async (ratingData: Rating) => {
    try {
        const response = await fetch(RATE_MATERIAL_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ratingData }),
        });

        if (!response.ok) {
            throw new Error('Failed to rate material');
        }

        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
};

const getMaterialRating = async (materialId: string) => {
    try {
        const response = await fetch(GET_MATERIAL_RATING_ENDPOINT.replace('material-id', materialId), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to retrieve material rating');
        }

        const data = await response.json();
        return data.rating;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

const checkUserRating = async (materialId: string, userId: string) => {
    try {
        const response = await fetch(`${CHECK_USER_RATING_ENDPOINT.replace('material-id', materialId)}?user-id=${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to check user rating');
        }

        const data = await response.json();
        return data.hasRated;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export { rateMaterial, getMaterialRating, checkUserRating };
