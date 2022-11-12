import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

import { action_status, BASE_API_URL, MESSAGE_VARIANT } from '../constants';
import { setMessage } from './messageSlice';

const initialState = {
    comments: [],
    status: action_status.IDLE,
    error: null
};

export const getCommentsByUser = createAsyncThunk(
    'comments/getCommentsByUser',
    async (userId, thunkApi) => {
        try {
            const { data } = await axios.get(`${BASE_API_URL}/comments?user=${userId}&populate=creator&isCommented=true`);
            return data;
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message) 
                || error.message || error.toString();

            thunkApi.dispatch(setMessage({ message, variant: MESSAGE_VARIANT.ERROR }));

            return thunkApi.rejectWithValue();
        }
    }
);

const commentSlice = createSlice({
    name: 'comments',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(getCommentsByUser.pending, (state, action) => {
                state.status = action_status.LOADING;
            })
            .addCase(getCommentsByUser.fulfilled, (state, action) => {
                state.status = action_status.SUCCEEDED;
                state.comments = action.payload.results;
            })
            .addCase(getCommentsByUser.rejected, (state, action) => {
                state.status = action_status.FAILED;
                state.error = action.error;
            })
    }
});


const { reducer } = commentSlice;

export default reducer;
