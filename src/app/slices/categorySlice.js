import { createSlice, createAsyncThunk, createEntityAdapter, createSelector } from '@reduxjs/toolkit';

import { action_status, BASE_API_URL, MESSAGE_VARIANT } from '../constants';
import { setMessage } from './messageSlice';
import api from '../api';

const categoriesAdapter = createEntityAdapter();

const initialState = categoriesAdapter.getInitialState({
    status: action_status.IDLE,
    error: null,
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
            const { data } = await api.post('/categories/admin/create', category);

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
            const { data } = await api.put(`/categories/admin/${category.id}`, category);

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
            .addCase(createCategory.fulfilled, (state, action) => {
                categoriesAdapter.addOne(state, action.payload.category);
                state.isAdded = true;
            })
            .addCase(createCategory.rejected, (state, action) => {
                state.error = action.error;
            })
            .addCase(updateCategory.fulfilled, (state, action) => {
                state.isUpdated = true;
            })
            .addCase(updateCategory.rejected, (state, action) => {
                state.error = action.error;
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