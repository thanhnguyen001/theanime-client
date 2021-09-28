import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./reducers/userReducer";
import viewModeReducer from "./reducers/viewModeReducer";
import commentReducer from "./reducers/commentReducer";
import watchReducer from "./reducers/watchReducer";

const store = configureStore({
    reducer: {
        viewMode: viewModeReducer,
        user: userReducer,
        comment: commentReducer,
        watch: watchReducer,
    }
});

export default store;