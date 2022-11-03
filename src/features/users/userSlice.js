import { createAsyncThunk, createSlice, createEntityAdapter } from "@reduxjs/toolkit";
import axios from 'axios';

import { action_status, BASE_API_URL, MESSAGE_VARIANT } from '../../app/constants';
import { setMessage } from '../message/messageSlice';

const usersAdapter = createEntityAdapter();

const initialState = usersAdapter.getInitialState({
    status: action_status.IDLE,
    error: null,
    banned: false
});

export const getAllUsers = createAsyncThunk(
    'users/getAllUsers',
    async () => {
        const { data } = await axios.get(`${BASE_API_URL}/admin/users/all`, { withCredentials: true });

        return data;
    } 
);

export const banUser = createAsyncThunk(
    'users/banUser',
    async (userId, thunkApi) => {
        try {
            const { data } = await axios.delete(`${BASE_API_URL}/admin/users/${userId}/ban`, { withCredentials: true });

            return data;
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message) 
                || error.message || error.toString();

            thunkApi.dispatch(setMessage({ message, variant: MESSAGE_VARIANT.ERROR }));

            return thunkApi.rejectWithValue();
        }
    }
);

const userSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        refresh: (state, action) => {
            state.banned = false;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllUsers.pending, (state, action) => {
                state.status = action_status.LOADING;
            })
            .addCase(getAllUsers.fulfilled, (state, action) => {
                state.status = action_status.SUCCEEDED;
                usersAdapter.setAll(state, action.payload.users);
            })
            .addCase(getAllUsers.rejected, (state, action) => {
                state.status = action_status.FAILED;
                state.error = action.error;
            })
            .addCase(banUser.pending, (state, action) => {
                state.banned = false;
            })
            .addCase(banUser.fulfilled, (state, action) => {
                const { user } = action.payload;
                
                usersAdapter.updateOne(state, user);
                state.banned = true;
            })
    }
});

export const {
    selectAll: selectAllUsers,
    selectById: selectUserById,
    selectIds: selectUserIds
} = usersAdapter.getSelectors((state) => state.users);

const { reducer, actions } = userSlice;
export const { refresh } = actions;

export default reducer;