import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user_id: localStorage.getItem('user_id') || '',
    auth_provider: localStorage.getItem('auth_provider') || '',
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
            state.auth_provider = action.payload.auth_provider;

            localStorage.setItem('user_id', action.payload.user_id);
            localStorage.setItem('jwt_token', action.payload.token);
            localStorage.setItem('auth_provider', action.payload.auth_provider);
        },
        logout: (state) => {
            state.loggedIn = false;
            state.user_id = '';
            state.token = '';
            state.auth_provider = '';

            localStorage.clear();
        }
    }
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;