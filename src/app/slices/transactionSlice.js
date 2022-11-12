import { createSlice, createEntityAdapter, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

import { action_status, BASE_API_URL } from '../constants';
import { setMessage } from './messageSlice';
import { MESSAGE_VARIANT } from '../constants';

const transactionsAdapter = createEntityAdapter();

const initialState = transactionsAdapter.getInitialState({
    status: action_status.IDLE,
    error: null,
    isUpdated: false
});

export const getTransactions = createAsyncThunk(
    'transactions/getTransactions',
    async () => {
        const { data } = await axios.get(`${BASE_API_URL}/admin/transactions/all`, { withCredentials: true });
        return data;
    }
);

export const updateTransaction = createAsyncThunk(
    'transactions/update',
    async (id, thunkApi) => {
        try {
            const { data } = await axios.put(`${BASE_API_URL}/admin/transactions/${id}`, '',{ withCredentials: true });

            return data;
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message)
                || error.message || error.toString();

            thunkApi.dispatch(setMessage({ message, variant: MESSAGE_VARIANT.ERROR }));

            return thunkApi.rejectWithValue();
        }
    }
)

const transactionSlice = createSlice({
    name: 'transactions',
    initialState,
    reducers: {
        refresh: (state, action) => {
            state.isUpdated = false;
        }
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
            })
            .addCase(updateTransaction.pending, (state, action) => {
                state.isUpdated = false;
            })
            .addCase(updateTransaction.fulfilled, (state, action) => {
                state.isUpdated = true;
            })
    }
});

const { reducer, actions } = transactionSlice;

export const {
    selectAll: selectAllTransactions,
    selectById: selectTransactionById,
    selectIds: selectTransactionIds
} = transactionsAdapter.getSelectors((state) => state.transactions);

export const { refresh } = actions;

export default reducer;
