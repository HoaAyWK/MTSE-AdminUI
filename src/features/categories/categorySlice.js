import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import axios from 'axios';

import { action_status, BASE_API_URL, MESSAGE_VARIANT } from '../../app/constants';
import { setMessage } from '../message/messageSlice';

const categoriesAdapter = createEntityAdapter();

const initialState = categoriesAdapter.getInitialState({
    status: action_status.IDLE,
    error: null,
    updated: false,
    added: false,
    deleted: false
});

export const getCategories = createAsyncThunk(
    'categories/getCategories',
    async () =>  {
        const { data } = await axios.get(`${BASE_API_URL}/admin/categories`, { withCredentials: true });
        return data;
    }
);

export const createCategory = createAsyncThunk(
    'categories/create',
    async (category, thunkApi) => {
        try {
            if (!category.parent) {
                category.parent = null;
            }
            const { data } = await axios.post(
                `${BASE_API_URL}/admin/categories/create`,
                category,
                { withCredentials: true });

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
            if (!category.parent) {
                category.parent = null;
            }
            const { data } = await axios.put(
                `${BASE_API_URL}/admin/categories/${category.id}`,
                category,
                { withCredentials: true });

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
            const { data } = await axios.delete(
                `${BASE_API_URL}/admin/categories/${categoryId}`,
                { withCredentials: true }
            );

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
            state.updated = false;
            state.added = false;
            state.deleted = false;
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
                state.added = true;
            })
            .addCase(createCategory.rejected, (state, action) => {
                state.error = action.error;
            })
            .addCase(updateCategory.fulfilled, (state, action) => {
                const { category } = action.payload;
                let existingCategory = state.entities[category.id];
                
                console.log(existingCategory);
                if (existingCategory) {
                    existingCategory = category;
                }

                state.updated = true;
            })
            .addCase(updateCategory.rejected, (state, action) => {
                state.error = action.error;
            })
            .addCase(deleteCategory.pending, (state, action) => {
                state.deleted = false;
            })
            .addCase(deleteCategory.fulfilled, (state, action) => {
                state.deleted = true;
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