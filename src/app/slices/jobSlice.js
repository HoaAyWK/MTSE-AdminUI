import axios from 'axios';
import { createSlice, createAsyncThunk, createEntityAdapter, createSelector } from "@reduxjs/toolkit";

import api from '../api';
import { action_status } from '../constants';

const jobsAdapter = createEntityAdapter();

const initialState = jobsAdapter.getInitialState({
    status: action_status.IDLE,
    error: null
});

export const getJobs = createAsyncThunk(
    'jobs/getJobs',
    async () => {
        const { data } = await api.get(`/job/show`);

        return data;
    }
)

const jobSlice = createSlice({
    name: 'jobs',
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            .addCase(getJobs.pending, (state, action) => {
                state.status = action_status.LOADING;
            })
            .addCase(getJobs.fulfilled, (state, action) => {
                jobsAdapter.setAll(state, action.payload.jobs);
                state.status = action_status.SUCCEEDED;
            })
            .addCase(getJobs.rejected, (state, action) => {
                state.status = action_status.FAILED;
                state.error = action.error;
            })
    }
});

export const {
    selectAll: selectAllJobs,
    selectById: selectJobById,
    selectIds: selectJobIds
} = jobsAdapter.getSelectors((state) => state.jobs);

export const selectJobsByUser = createSelector(
    [selectAllJobs, (state, userId) => userId],
    (jobs, userId) => jobs.filter(job => job.employer.id === userId)
);

const { reducer } = jobSlice;
export default reducer;