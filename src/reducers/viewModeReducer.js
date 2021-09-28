import { createSlice } from '@reduxjs/toolkit';

const initialState = JSON.parse(localStorage.getItem('viewMode')) || {
    bgColor: 'var(--bg-header-light)',
    textColor: "var(--black-color)"
}

const viewMode = createSlice({
    name: 'viewMode',
    initialState,
    reducers: {
        changeColor: (state, action) => {
            localStorage.setItem('viewMode', JSON.stringify(action.payload));
            return state = action.payload;
        }
    }
});

export const { changeColor } = viewMode.actions;
export default viewMode.reducer;


