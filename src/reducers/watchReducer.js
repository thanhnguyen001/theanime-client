import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../api/axiosClient";

const initialState = JSON.parse(localStorage.getItem('watch')) || {
    following: [],
    viewed: [],
    liked: []
};

export const getWatch = createAsyncThunk('watch/getWatch', async (params, thunkApi) => {
    const { watch } = await axiosClient.get('/user/action');
    if (watch) return watch;
})

const watchReducer = createSlice({
    name: 'watch',
    initialState,
    reducers: {
        addWatch: (state, action) => {
            localStorage.setItem('watch', JSON.stringify(action.payload))
            return state = action.payload
        },
        addViewed: (state, action) => {
            let oldState = JSON.parse(localStorage.getItem('watch')) || initialState;
            if (Object.keys(oldState).length !== 3) {
                oldState = initialState;
            }
            const oldViewed = [...oldState.viewed];

            const index = oldViewed.findIndex((item, index) => item.animeId === action.payload.animeId);

            

            if (index >= 0) {
                if (action.payload.isAdd) oldViewed.splice(index, 1, action.payload);
                else oldViewed.splice(index, 1);
            }
            else oldViewed.push(action.payload);
            state = { ...oldState, viewed: oldViewed }
            localStorage.setItem('watch', JSON.stringify(state));

            axiosClient.put('/user/action', { watch: state })

            return state;
        },
        addLiked: (state, action) => {
            let oldState = JSON.parse(localStorage.getItem('watch')) || initialState;
            if (Object.keys(oldState).length !== 3) {
                oldState = initialState;
            }
            const oldLiked = [...oldState.liked];

            const index = oldLiked.findIndex((item, index) => item.id === action.payload.anime.id);

            delete action.payload.anime.episodes;
            delete action.payload.anime.collection;
            delete action.payload.anime.description;

            if (index < 0) oldLiked.push({...action.payload.anime, });
            else oldLiked.splice(index, 1);

            state = { ...oldState, liked: oldLiked }
            localStorage.setItem('watch', JSON.stringify(state));

            axiosClient.put('/user/action', { watch: state })

            return state;
        },
        addFollowing: (state, action) => {
            let oldState = JSON.parse(localStorage.getItem('watch')) || initialState;
            if (Object.keys(oldState).length !== 3) {
                oldState = initialState;
            }

            const oldFollowing = [...oldState.following];

            const index = oldFollowing.findIndex((item, index) => item.id === action.payload.anime.id);

            delete action.payload.anime.episodes;
            delete action.payload.anime.collection;
            delete action.payload.anime.description;

            if (index < 0) oldFollowing.push(action.payload.anime);
            else oldFollowing.splice(index, 1);

            state = { ...oldState, following: oldFollowing }
            localStorage.setItem('watch', JSON.stringify(state));

            axiosClient.put('/user/action', { watch: state })

            return state;
        }
    }
})

export const { addWatch, addViewed, addFollowing, addLiked } = watchReducer.actions;
export default watchReducer.reducer;