import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import materialReducer from './materialSlice';

export const store = configureStore({
    reducer: {
        user: userReducer,
        materials: materialReducer
    }
});