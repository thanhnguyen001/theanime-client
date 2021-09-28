import { createSlice } from "@reduxjs/toolkit";

const initialState = JSON.parse(localStorage.getItem('user')) || {};

const userReducer = createSlice({
    name: 'user',
    initialState,
    reducers: {
        signedIn: (state, action) => {
            localStorage.setItem('user', JSON.stringify(action.payload));
            localStorage.setItem("TOKEN", JSON.stringify(action.payload.accessToken));
            console.info(action.payload)
            return state = action.payload;
        },
        signOut: (state, action) => {
            localStorage.removeItem('user');
            localStorage.removeItem('TOKEN');
            localStorage.removeItem('watch');
            return state = action.payload;
        },
        updateUser: (state, action) => {
            localStorage.setItem('user', JSON.stringify(action.payload));
            return state = action.payload;
        }
    }

});

export const { signedIn, signOut, updateUser } = userReducer.actions;

export default userReducer.reducer;