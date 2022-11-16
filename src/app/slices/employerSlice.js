import { createAsyncThunk, createSlice, createEntityAdapter } from "@reduxjs/toolkit";

import { action_status } from '../constants';
import api from '../api';

const employersAdaper = createEntityAdapter();

const initialState = employersAdaper.getInitialState({
    status: action_status.IDLE,
    error: null
});

export const getEmployers = createAsyncThunk(
    'employers/getEmployers',
    async () => {
        const { data } = await api.get(`/employer`);

        return data;
    } 
);

const employerslice = createSlice({
    name: 'employers',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(getEmployers.pending, (state, action) => {
                state.status = action_status.LOADING;
            })
            .addCase(getEmployers.fulfilled, (state, action) => {
                state.status = action_status.SUCCEEDED;
                employersAdaper.setAll(state, action.payload.employers);
            })
            .addCase(getEmployers.rejected, (state, action) => {
                state.status = action_status.FAILED;
                state.error = action.error;
            })
    }
});

export const {
    selectAll: selectAllEmployers,
    selectById: selectEmpployerById,
    selectIds: selectEmpployerIds
} = employersAdaper.getSelectors((state) => state.employers);

const { reducer } = employerslice;

export default reducer;
