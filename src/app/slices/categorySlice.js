import { createSlice, createAsyncThunk, createEntityAdapter, createSelector } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

import api from '../api';
import { action_status, MESSAGE_VARIANT } from '../constants';
import { setMessage } from './messageSlice';
import { uploadTaskPromise } from '../../utils/uploadTaskPromise';

const categoriesAdapter = createEntityAdapter();

const initialState = categoriesAdapter.getInitialState({
    status: action_status.IDLE,
    error: null,
    addOrUpdateStatus: action_status.IDLE,
    isUpdated: false,
    isAdded: false,
    isDeleted: false
});

export const getCategories = createAsyncThunk(
    'categories/getCategories',
    async () =>  {
        const { data } = await api.get('/categories');
        return data;
    }
);

export const createCategory = createAsyncThunk(
    'categories/create',
    async (category, thunkApi) => {
        try {
            const { name, image } = category;
            const filePath = `files/categories/${uuidv4()}`;
            const imageUrl = await uploadTaskPromise(filePath, image);
            const { data } = await api.post('/categories/admin/create', { name, image: imageUrl });

            return data;
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message) 
                || error.message || error.toString();

            thunkApi.dispatch(setMessage({ message, variant: MESSAGE_VARIANT.ERROR }));

            return thunkApi.rejectWithValue();
        }
    }
);

export const updateCategory = createAsyncThunk(
    'categories/update',
    async (category, thunkApi) => {
        try {
            const { id, image, ...updateData } = category;
            if (image) {
                const filePath = `files/categories/${uuidv4()}`;
                updateData.image = await uploadTaskPromise(filePath, image);
            }

            const { data } = await api.put(`/categories/admin/${id}`, updateData);

            return data;
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message) 
                || error.message || error.toString();

            thunkApi.dispatch(setMessage({ message, variant: MESSAGE_VARIANT.ERROR }));

            return thunkApi.rejectWithValue();
        }
    }
);

export const deleteCategory = createAsyncThunk(
    'categories/delete',
    async (categoryId, thunkApi) => {
        try {
            const { data } = await api.delete(`/categories/admin/${categoryId}`);

            data.categoryId = categoryId;
            return data;
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message) 
                || error.message || error.toString();

            thunkApi.dispatch(setMessage({ message, variant: MESSAGE_VARIANT.ERROR }));

            return thunkApi.rejectWithValue();
        }
    }
)

const categorySlice = createSlice({
    name: 'categories',
    initialState,
    reducers: {
        refresh: (state, action) => {
            state.isUpdated = false;
            state.isAdded = false;
            state.isDeleted = false;
            state.addOrUpdateStatus = action_status.IDLE;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getCategories.pending, (state, action) => {
                state.status = action_status.LOADING;
            })
            .addCase(getCategories.fulfilled, (state, action) => {
                categoriesAdapter.setAll(state, action.payload.categories);
                state.status = action_status.SUCCEEDED;
            })
            .addCase(getCategories.rejected, (state, action) => {
                state.status = action_status.FAILED;
                state.error = action.error;
            })
            .addCase(createCategory.pending, (state, action) => {
                state.addOrUpdateStatus = action_status.LOADING;
            })
            .addCase(createCategory.fulfilled, (state, action) => {
                categoriesAdapter.addOne(state, action.payload.category);
                state.addOrUpdateStatus = action_status.SUCCEEDED;
                state.isAdded = true;
            })
            .addCase(createCategory.rejected, (state, action) => {
                state.error = action.error;
                state.addOrUpdateStatus = action_status.FAILED;
            })
            .addCase(updateCategory.pending, (state, action) => {
                state.addOrUpdateStatus = action_status.LOADING;
            })
            .addCase(updateCategory.fulfilled, (state, action) => {
                state.isUpdated = true;
                state.addOrUpdateStatus = action_status.SUCCEEDED;
            })
            .addCase(updateCategory.rejected, (state, action) => {
                state.error = action.error;
                state.addOrUpdateStatus = action_status.FAILED;
            })
            .addCase(deleteCategory.pending, (state, action) => {
                state.isDeleted = false;
            })
            .addCase(deleteCategory.fulfilled, (state, action) => {
                state.isDeleted = true;
                categoriesAdapter.removeOne(state, action.payload.categoryId);
            })
    }
});

export const {
    selectAll: selectAllCategories,
    selectById: selectCategoryById,
    selectIds: selectCategoryIds
} = categoriesAdapter.getSelectors((state) => state.categories);

const { reducer, actions } = categorySlice;
export const { refresh } = actions;

export default reducer;