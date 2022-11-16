import { createAsyncThunk, createSlice, createEntityAdapter } from "@reduxjs/toolkit";

import { action_status } from '../constants';
import api from '../api';

const freelancersAdaper = createEntityAdapter();

const initialState = freelancersAdaper.getInitialState({
    status: action_status.IDLE,
    error: null
});

export const getFreelancers = createAsyncThunk(
    'freelancers/getFreelancers',
    async () => {
        const { data } = await api.get(`/freelancer`);

        return data;
    } 
);

const freelancerslice = createSlice({
    name: 'freelancers',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(getFreelancers.pending, (state, action) => {
                state.status = action_status.LOADING;
            })
            .addCase(getFreelancers.fulfilled, (state, action) => {
                state.status = action_status.SUCCEEDED;
                freelancersAdaper.setAll(state, action.payload.freelancers);
            })
            .addCase(getFreelancers.rejected, (state, action) => {
                state.status = action_status.FAILED;
                state.error = action.error;
            })
    }
});

export const {
    selectAll: selectAllFreelancers,
    selectById: selectFreelancerById,
    selectIds: selectFreelancerIds
} = freelancersAdaper.getSelectors((state) => state.freelancers);

const { reducer } = freelancerslice;

export default reducer;
