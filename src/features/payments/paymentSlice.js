import axios from 'axios';
import { createSlice, createAsyncThunk, createEntityAdapter, createSelector } from "@reduxjs/toolkit";
import { action_status, BASE_API_URL } from "../../app/constants";

const paymentsAdapter = createEntityAdapter();

const initialState = paymentsAdapter.getInitialState({
    error: null,
    status: action_status.IDLE
});


export const getPayments = createAsyncThunk(
    'payments/getPayments',
    async () => {
        const { data } = await axios.get(
            `${BASE_API_URL}/admin/payments/all`,
            { withCredentials: true }
        );

        return data;
    }
);

const paymentSlice = createSlice({
    name: 'payments',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(getPayments.pending, (state, action) => {
                state.status = action_status.LOADING;
            })
            .addCase(getPayments.fulfilled, (state, action) => {
                state.status = action_status.SUCCEEDED;
                paymentsAdapter.setAll(state, action.payload.paymentHistories)
            })
            .addCase(getPayments.rejected, (state, action) => {
                state.status = action_status.FAILED;
                state.error = action.error
            })
    }
});

export const {
    selectAll: selectAllPayments,
    selectById: selectPaymentById,
    selectIds: selectPaymentIds
} = paymentsAdapter.getSelectors((state) => state.payments);

export const selectPaymentsByUser = createSelector(
    [selectAllPayments, (state, userId) => userId],
    (payments, userId) => payments.filter((payment) => payment.user.id === userId)
);

export const selectPaymentsByNumber = createSelector(
    [selectAllPayments, (state, number) => number],
    (payments, number) => payments.slice(0, number)
);

const { reducer } = paymentSlice;

export default reducer;
