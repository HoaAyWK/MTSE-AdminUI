import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { action_status, MESSAGE_VARIANT } from '../constants';
import { setMessage } from './messageSlice';
import api from '../api';

const initialState = {
    applieds: [],
    status: action_status.IDLE,
    error: null
};

export const getAppliedsByJob = createAsyncThunk(
    'applieds/getAppliedsByJob',
    async (jobId, thunkApi) => {
        try {
            const { data } = await api.get(`/applied/admin/${jobId}`);

            return data;
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message) 
                || error.message || error.toString();

            thunkApi.dispatch(setMessage({ message, variant: MESSAGE_VARIANT.ERROR }));

            return thunkApi.rejectWithValue();
        }
    }
);

const appliedslice = createSlice({
    name: 'applieds',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAppliedsByJob.pending, (state, action) => {
                state.status = action_status.LOADING;
            })
            .addCase(getAppliedsByJob.fulfilled, (state, action) => {
                state.status = action_status.SUCCEEDED;
                state.applieds = action.payload.applieds;
            })
            .addCase(getAppliedsByJob.rejected, (state, action) => {
                state.status = action_status.FAILED;
                state.error = action.error;  
            })
    }
});

const { reducer } = appliedslice;

export default reducer;
