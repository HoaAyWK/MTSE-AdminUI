import { createSlice, createEntityAdapter, createAsyncThunk } from '@reduxjs/toolkit';

import api from '../api';
import { action_status } from '../constants';

const transactionsAdapter = createEntityAdapter();

const initialState = transactionsAdapter.getInitialState({
    status: action_status.IDLE,
    error: null
});

export const getTransactions = createAsyncThunk(
    'transactions/getTransactions',
    async () => {
        const { data } = await api.get(`/transactions`);
        return data;
    }
);


const transactionSlice = createSlice({
    name: 'transactions',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(getTransactions.pending, (state, action) => {
                state.status = action_status.LOADING;
            })
            .addCase(getTransactions.fulfilled, (state, action) => {
                state.status = action_status.SUCCEEDED;
                transactionsAdapter.setAll(state, action.payload.transactions);
            })
            .addCase(getTransactions.rejected, (state, action) => {
                state.status = action_status.FAILED;
                state.error = action.error;
            });
    }
});

const { reducer } = transactionSlice;

export const {
    selectAll: selectAllTransactions,
    selectById: selectTransactionById,
    selectIds: selectTransactionIds
} = transactionsAdapter.getSelectors((state) => state.transactions);


export default reducer;
