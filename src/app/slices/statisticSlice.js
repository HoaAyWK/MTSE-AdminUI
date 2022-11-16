import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import api from '../api';
import { action_status } from "../constants";

const initialState = {
    statistic: [],
    status: action_status.IDLE,
    error: null
};


export const getStatistic = createAsyncThunk(
    'statistic/getStatistic',
    async () => {
        const { data } = await api.get(`/transactions/stats`);
        
        return data;
    }
);


const statisticSlice = createSlice({
    name: 'statistic',
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            .addCase(getStatistic.pending, (state, action) => {
                state.status = action_status.LOADING;
            })
            .addCase(getStatistic.fulfilled, (state, action) => {
                state.status = action_status.SUCCEEDED;
                state.statistic = action.payload.data;
            })
            .addCase(getStatistic, (state, action) => {
                state.status = action_status.FAILED;
                state.error = action.error;
            })
    }
});

const { reducer } = statisticSlice;
export default reducer;