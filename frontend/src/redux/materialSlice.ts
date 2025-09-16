import { createSlice } from '@reduxjs/toolkit';
import type { Material } from '@/interfaces/table.d';

const materialSlice = createSlice({
    name: 'material',
    initialState: {
        materials: [] as Material[],
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
        },
        deleteAllMaterials: (state) => {
            state.materials = [];
        }
    },
});

export const { setMaterial, deleteAllMaterials } = materialSlice.actions;

export default materialSlice.reducer;
