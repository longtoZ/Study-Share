import { createSlice } from '@reduxjs/toolkit';
import type { Material } from '@/interfaces/table';

const materialSlice = createSlice({
    name: 'material',
    initialState: {
        materials: [] as Material[] // Initialize with an empty array or fetch initial data
    },
    reducers: {
        setMaterial: (state, action) => {
            if (state.materials.some(material => material.material_id === action.payload.material_id)) {
                // Update existing material
                state.materials = state.materials.map(material =>
                    material.material_id === action.payload.material_id ? action.payload : material
                );
            } else {
                // Add new material
                state.materials.push(action.payload);
            }
        }
    },
});

export const { setMaterial } = materialSlice.actions;

export default materialSlice.reducer;
