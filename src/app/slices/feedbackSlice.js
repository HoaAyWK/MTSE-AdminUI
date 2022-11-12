import { createAsyncThunk, createSlice, createEntityAdapter, createSelector } from '@reduxjs/toolkit';
import axios from 'axios';

import { action_status, BASE_API_URL } from '../constants';

const feedbacksAdapter = createEntityAdapter();

const initialState = feedbacksAdapter.getInitialState({
    status: action_status.IDLE,
    error: null
});

export const getFeedbacks = createAsyncThunk(
    'feedbacks/getFeedbacks',
    async () => {
        const { data } = await axios.get(
            `${BASE_API_URL}/admin/feedbacks/all`,
            { withCredentials: true }
        );

        return data;
    }
);

const feedbackSlice = createSlice({
    name: 'feedbacks',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(getFeedbacks.pending, (state, action) => {
                state.status = action_status.LOADING;
            })
            .addCase(getFeedbacks.fulfilled, (state, action) => {
                state.status = action_status.SUCCEEDED;
                feedbacksAdapter.setAll(state, action.payload.feedbacks);
            })
            .addCase(getFeedbacks.rejected, (state, action) => {
                state.status = action_status.FAILED;
                state.error = action.error;
            })
    }
});

const { reducer } = feedbackSlice;

export const {
    selectAll: selectAllFeedbacks,
    selectById: selectFeedbackById,
    selectIds: selectFeedbackIds
} = feedbacksAdapter.getSelectors((state) => state.feedbacks);

export const selectFeedbackByNumber = createSelector(
    [selectAllFeedbacks, (state, number) => number],
    (feedbacks, number) => feedbacks.slice(0, number)
);

export default reducer;
