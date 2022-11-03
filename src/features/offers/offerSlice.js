import axios from 'axios';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { action_status, BASE_API_URL } from '../../app/constants';
import { setMessage } from '../message/messageSlice';

const initialState = {
    offers: [],
    status: action_status.IDLE,
    error
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
            .
    }
})