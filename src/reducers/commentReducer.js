import { createSlice } from '@reduxjs/toolkit';

const initialState = JSON.parse(localStorage.getItem('comment')) || [];
const commentReducer = createSlice({
    name: 'comment',
    initialState,
    reducers: {
        addComment: (state, action) => {
            localStorage.setItem('comment', JSON.stringify(action.payload));
            return state = action.payload;
        }
       
    }
})

export const { addComment } = commentReducer.actions;
export default commentReducer.reducer;