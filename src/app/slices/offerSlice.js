import axios from 'axios';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { action_status, BASE_API_URL, MESSAGE_VARIANT } from '../constants';
import { setMessage } from './messageSlice';

const initialState = {
    offers: [],
    status: action_status.IDLE,
    error: null
};

export const getOffersByJob = createAsyncThunk(
    'offers/getOffersByJob',
    async (jobId, thunkApi) => {
        try {
            const { data } = await axios.get(`${BASE_API_URL}/jobs/${jobId}/offers`);

            return data;
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message) 
                || error.message || error.toString();

            thunkApi.dispatch(setMessage({ message, variant: MESSAGE_VARIANT.ERROR }));

            return thunkApi.rejectWithValue();
        }
    }
);

const offerSlice = createSlice({
    name: 'offers',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(getOffersByJob.pending, (state, action) => {
                state.status = action_status.LOADING;
            })
            .addCase(getOffersByJob.fulfilled, (state, action) => {
                state.status = action_status.SUCCEEDED;
                state.offers = action.payload.offers;
            })
            .addCase(getOffersByJob.rejected, (state, action) => {
                state.status = action_status.FAILED;
                state.error = action.error;  
            })
    }
});

const { reducer } = offerSlice;

export default reducer;
