import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user_id: localStorage.getItem('user_id') || '',
    token: localStorage.getItem('jwt_token') || '',
    loggedIn: !!(localStorage.getItem('jwt_token'))
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        login: (state, action) => {
            state.loggedIn = true;
            state.user_id = action.payload.user_id;
            state.token = action.payload.token;

            localStorage.setItem('user_id', action.payload.user_id);
            localStorage.setItem('jwt_token', action.payload.token);
        },
        logout: (state) => {
            state.loggedIn = false;
            state.user_id = '';
            state.token = '';

            localStorage.clear();
        }
    }
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;