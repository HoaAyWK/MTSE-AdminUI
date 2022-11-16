import axios from "axios";
import { createSlice, createAsyncThunk, createEntityAdapter } from "@reduxjs/toolkit";
import { action_status, MESSAGE_VARIANT } from "../constants";
import { setMessage } from "./messageSlice";
import api from '../api';

const packagesAdapter = createEntityAdapter();

const initialState = packagesAdapter.getInitialState({
    error: null,
    status: action_status.IDLE,
    addOrUpdateStatus: action_status.IDLE,
    isAdded: false,
    isUpdated: false,
    isDeleted: false
});

export const getPackages = createAsyncThunk(
    'packages/getPackages',
    async () => {
        const { data } = await api.get(`/packages`);

        return data;
    }
);

export const createPackage = createAsyncThunk(
    'packages/create',
    async (pkg, thunkApi) => {
        try {
            const { data } = await api.post(`/packages/admin/create`, pkg);

            return data;
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message) 
                || error.message || error.toString();

            thunkApi.dispatch(setMessage({ message, variant: MESSAGE_VARIANT.ERROR }));

            return thunkApi.rejectWithValue();
        }
    }
);

export const updatePackage = createAsyncThunk(
    'packages/update',
    async (pkg, thunkApi) => {
        try {
            const { id, ...pkgData } = pkg;
            const { data } = await api.put(`/packages/admin/${id}`, pkgData);

            return data;
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message) 
                || error.message || error.toString();

            thunkApi.dispatch(setMessage({ message, variant: MESSAGE_VARIANT.ERROR }));

            return thunkApi.rejectWithValue();
        }
    }
);

export const deletePackage = createAsyncThunk(
    'packages/delete',
    async (id, thunkApi) => {
        try {
            const { data } = await api.delete(`/packages/admin/${id}`);

            data.id = id;

            return data;
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message) 
                || error.message || error.toString();

            thunkApi.dispatch(setMessage({ message, variant: MESSAGE_VARIANT.ERROR }));

            return thunkApi.rejectWithValue();
        }   
    }
);

const packagesSlice = createSlice({
    name: 'packages',
    initialState,
    reducers: {
        refresh: (state, action) => {
            state.isAdded = false;
            state.isUpdated = false;
            state.isDeleted = false;
            state.addOrUpdateStatus = action_status.IDLE;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getPackages.pending, (state, action) => {
                state.status = action_status.LOADING;
            })
            .addCase(getPackages.fulfilled, (state, action) => {
                state.status = action_status.SUCCEEDED;
                packagesAdapter.setAll(state, action.payload.packages)
            })
            .addCase(getPackages.rejected, (state, action) => {
                state.status = action_status.FAILED;
                state.error = action.error;
            })
            .addCase(createPackage.pending, (state, action) => {
                state.isAdded = false;
                state.addOrUpdateStatus = action_status.LOADING;
            })
            .addCase(createPackage.fulfilled, (state, action) => {
                packagesAdapter.addOne(state, action.payload.package);
                state.addOrUpdateStatus = action_status.SUCCEEDED;
                state.isAdded = true;
            })
            .addCase(updatePackage.pending, (state, action) => {
                state.addOrUpdateStatus = action_status.LOADING;
                state.isUpdated = false;
            })
            .addCase(updatePackage.fulfilled, (state, action) => {
                state.addOrUpdateStatus = action_status.SUCCEEDED;
                state.isUpdated = true;
            })
            .addCase(updatePackage.rejected, (state, action) => {
                state.addOrUpdateStatus = action_status.FAILED;
                state.isUpdated = false;
            })
            .addCase(deletePackage.pending, (state, action) => {
                state.isDeleted = false;
            })
            .addCase(deletePackage.fulfilled, (state, action) => {
                state.isDeleted = true;
                packagesAdapter.removeOne(state, action.payload.id);
            })
    }
});

export const {
    selectAll: selectAllPackages,
    selectById: selectPackageById,
    selectIds: selectPackageIds
} = packagesAdapter.getSelectors((state) => state.packages);

const { reducer, actions } = packagesSlice;
export const { refresh } = actions;
export default reducer;