import axios from "axios";
import { createSlice, createAsyncThunk, createEntityAdapter } from "@reduxjs/toolkit";
import { action_status, BASE_API_URL } from "../../app/constants";
import { setMessage } from "../message/messageSlice";
import { MESSAGE_VARIANT } from "../../app/constants";

const pointsAdapter = createEntityAdapter();

const initialState = pointsAdapter.getInitialState({
    error: null,
    status: action_status.IDLE,
    isAdded: false,
    isUpdated: false,
    isDeleted: false
});

export const getPoints = createAsyncThunk(
    'points/getPoints',
    async () => {
        const { data } = await axios.get(`${BASE_API_URL}/credits`);

        return data;
    }
);

export const createPoint = createAsyncThunk(
    'points/create',
    async (point, thunkApi) => {
        try {
            const { data } = await axios.post(
                `${BASE_API_URL}/admin/credits/create`,
                point,
                { withCredentials: true }
            );

            return data;
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message) 
                || error.message || error.toString();

            thunkApi.dispatch(setMessage({ message, variant: MESSAGE_VARIANT.ERROR }));

            return thunkApi.rejectWithValue();
        }
    }
);

export const updatePoint = createAsyncThunk(
    'points/update',
    async (point, thunkApi) => {
        try {
            const { data } = await axios.put(
                `${BASE_API_URL}/admin/points/${point.id}`,
                point,
                { withCredentials: true }
            );

            return data;
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message) 
                || error.message || error.toString();

            thunkApi.dispatch(setMessage({ message, variant: MESSAGE_VARIANT.ERROR }));

            return thunkApi.rejectWithValue();
        }
    }
);

export const deletePoint = createAsyncThunk(
    'points/delete',
    async (id, thunkApi) => {
        try {
            const { data } = await axios.delete(
                `${BASE_API_URL}/admin/credits/${id}`,
                { withCredentials: true }
            );

            data.id = id;

            return data;
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message) 
                || error.message || error.toString();

            thunkApi.dispatch(setMessage({ message, variant: MESSAGE_VARIANT.ERROR }));

            return thunkApi.rejectWithValue();
        }   
    }
)

const pointSlice = createSlice({
    name: 'points',
    initialState,
    reducers: {
        refresh: (state, action) => {
            state.isAdded = false;
            state.isUpdated = false;
            state.isDeleted = false;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getPoints.pending, (state, action) => {
                state.status = action_status.LOADING;
            })
            .addCase(getPoints.fulfilled, (state, action) => {
                state.status = action_status.SUCCEEDED;
                pointsAdapter.setAll(state, action.payload.credits)
            })
            .addCase(getPoints.rejected, (state, action) => {
                state.status = action_status.FAILED;
                state.error = action.error;
            })
            .addCase(createPoint.pending, (state, action) => {
                state.isAdded = false;
            })
            .addCase(createPoint.fulfilled, (state, action) => {
                pointsAdapter.addOne(state, action.payload.credit);
                state.isAdded = true;
            })
            .addCase(deletePoint.pending, (state, action) => {
                state.isDeleted = false;
            })
            .addCase(deletePoint.fulfilled, (state, action) => {
                state.isDeleted = true;
                pointsAdapter.removeOne(state, action.payload.id);
            })
    }
});

export const {
    selectAll: selectAllPoints,
    selectById: selectPointById,
    selectIds: selectPointIds
} = pointsAdapter.getSelectors((state) => state.points);

const { reducer, actions } = pointSlice;
export const { refresh } = actions;
export default reducer;