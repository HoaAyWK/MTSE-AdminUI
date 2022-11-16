import axios from 'axios';
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from 'uuid';

import api from '../api';
import { BASE_API_URL, action_status, MESSAGE_VARIANT } from '../constants';
import { setMessage } from './messageSlice';
import { uploadTaskPromise } from '../../utils/uploadTaskPromise';

const initialState = {
    user: null,
    loginStatus: action_status.IDLE,
    getUserStatus: action_status.IDLE,
    error: null,
    updated: false,
    updateStatus: action_status.IDLE,
    changedPassword: false,
    changedPasswordStatus: action_status.IDLE
};

export const login = createAsyncThunk(
    'auth/login',
    async ({ email, password }, thunkApi) => {
        try {
            const { data } = await api.post('/account/login', { email, password });
            
            return data.accessToken;
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message) 
                || error.message || error.toString();
            
            thunkApi.dispatch(setMessage({ message, variant: MESSAGE_VARIANT.ERROR }));

            return thunkApi.rejectWithValue();
        }
    }
);

export const getCurrentUser = createAsyncThunk(
    'auth/getCurrentUser',
    async (_, thunkApi) => {
        try {
            const { data } = await api.get(`/users/profile`);

            return data;
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message) 
                || error.message || error.toString();
            
            thunkApi.dispatch(setMessage({ message, variant: MESSAGE_VARIANT.ERROR }));
        }
    }
);

export const updateAccount = createAsyncThunk(
    'auth/updateAccount',
    async (updateBody, thunkApi) => {
        try {
            const { email, image, address, city, country, ...dataToUpdate }  = updateBody;
            const filePath = `files/avatars/${uuidv4()}`;

            if (image) {
                dataToUpdate.image = await uploadTaskPromise(filePath, image);
            };

            dataToUpdate.address = address + ', ' + city + ', ' + country;
            const { data } = await api.put(`/users/profile`, dataToUpdate);

            return data;
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message) 
                || error.message || error.toString();
            console.log(message);
            thunkApi.dispatch(setMessage({ message, variant: MESSAGE_VARIANT.ERROR }));

            return thunkApi.rejectWithValue();
        }
    }
);

export const changePassword = createAsyncThunk(
    'auth/changePassword',
    async (updateBody, thunkApi) => {
        try {
            const passwords = {
                oldPassword: updateBody.oldPassword,
                newPassword: updateBody.newPassword
            };

            const { data } = await api.put(`/account/changePassword`, passwords);

            return data;
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message) 
                || error.message || error.toString();

            thunkApi.dispatch(setMessage({ message, variant: MESSAGE_VARIANT.ERROR }));

            return thunkApi.rejectWithValue();
        }
    }
)


const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        refresh: (state, action) => {
            state.updated = false;
            state.changedPassword = false;
            state.updateStatus = action_status.IDLE;
            state.changedPasswordStatus = action_status.IDLE;
        },
        logout: (state, action) => {
            state.changedPasswordStatus = action_status.IDLE;
            state.updateStatus = action_status.IDLE;
            state.error = null;
            state.loginStatus = action_status.IDLE;
            state.getUserStatus = action_status.IDLE;
            state.changedPassword = false;
            state.updated = false;
            state.user = null;
            localStorage.setItem('token', null);
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state, action) => {
                state.loginStatus = action_status.LOADING;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loginStatus = action_status.SUCCEEDED;
                localStorage.setItem('token', JSON.stringify(action.payload));
            })
            .addCase(login.rejected, (state, action) => {
                state.loginStatus = action_status.FAILED;
            })
            .addCase(getCurrentUser.pending, (state, action) => {
                state.getUserStatus = action_status.LOADING;      
            })
            .addCase(getCurrentUser.fulfilled, (state, action) => {
                state.loginStatus = false;
                state.getUserStatus = action_status.SUCCEEDED;
                state.user = action.payload.user;
            })
            .addCase(getCurrentUser.rejected, (state, action) => {
                state.getUserStatus = action_status.FAILED;
            })
            .addCase(updateAccount.pending, (state, action) => {
                state.updated = false;  
                state.updateStatus = action_status.LOADING;
            })
            .addCase(updateAccount.fulfilled, (state, action) => {
                state.updated = true;  
                state.updateStatus = action_status.SUCCEEDED;
                state.user = action.payload.user;
            })
            .addCase(updateAccount.rejected, (state, action) => {
                state.updateStatus = action_status.FAILED;
            })
            .addCase(changePassword.pending, (state, action) => {
                state.changedPassword = false;
                state.changedPasswordStatus = action_status.LOADING;
            })
            .addCase(changePassword.fulfilled, (state, action) => {
                state.changedPassword = true;
                state.user = null;
                state.status = action_status.IDLE;
                state.changedPasswordStatus = action_status.SUCCEEDED;
                localStorage.setItem('token', null);
            })
            .addCase(changePassword.rejected, (state, action) => {
                state.changedPasswordStatus = action_status.FAILED;
            })
    }
});

const { actions, reducer } = authSlice;
export const { refresh, logout  } = actions;
export default reducer;