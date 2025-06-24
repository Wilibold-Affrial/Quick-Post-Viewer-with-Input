import {configureStore} from '@reduxjs/toolkit';
import postReducer from './store/slices/postSlice';

export const store = configureStore({
    reducer:{
        posts: postReducer,
    },
});