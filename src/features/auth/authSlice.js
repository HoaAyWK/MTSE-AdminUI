import axios from 'axios';
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { BASE_API_URL, action_status, MESSAGE_VARIANT } from '../../app/constants';
import { setMessage } from '../message/messageSlice';
import { ROLES } from '../../app/constants';

const initialState = {
    user: null,
    status: action_status.IDLE,
    error: null,
    isAuthenticated: false,
    updated: false,
    updateStatus: action_status.IDLE,
    changedPassword: false,
    changedPasswordStatus: action_status.IDLE
};

export const login = createAsyncThunk(
    'auth/login',
    async ({ email, password }, thunkApi) => {
        try {
            const response = await axios.post(`${BASE_API_URL}/login`, { email, password }, { withCredentials: true });
            const { user } = response.data;

            if (!user.roles.includes(ROLES.ADMIN)) {
                throw new Error('You do not have permission to access this page');
            }

            return response.data.user;
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
    async () => {
        const { data } = await axios.get(`${BASE_API_URL}/profile`, { withCredentials: true });
        return data;
    }
);

export const updateAccount = createAsyncThunk(
    'auth/updateAccount',
    async (updateBody, thunkApi) => {
        try {
            const { email, ...dataToUpdate }  = updateBody;
            const { data } = await axios.put(`${BASE_API_URL}/profile`, dataToUpdate, { withCredentials: true});

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

            const { data } = await axios.put(
                `${BASE_API_URL}/password/change`,
                passwords,
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
            state = initialState;
            localStorage.setItem('user', null);
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state, action) => {
                state.status = action_status.LOADING;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.status = action_status.SUCCEEDED;
                state.user = action.payload;
                localStorage.setItem('user', JSON.stringify(action.payload));
                state.isAuthenticated = true;
            })
            .addCase(login.rejected, (state, action) => {
                state.status = action_status.FAILED;
                state.error = action;
            })
            .addCase(getCurrentUser.fulfilled, (state, action) => {
                state.user = action.payload.user;
                state.isAuthenticated = true;
                localStorage.setItem('user', JSON.stringify(action.payload.user));
            })
            .addCase(updateAccount.pending, (state, action) => {
                state.updated = false;  
                state.updateStatus = action_status.LOADING;
            })
            .addCase(updateAccount.fulfilled, (state, action) => {
                state.user = action.payload.user;
                state.updated = true;  
                state.updateStatus = action_status.SUCCEEDED;
                localStorage.setItem('user', JSON.stringify(action.payload.user));
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
                state.isAuthenticated = false;
                state.status = action_status.IDLE;
                state.changedPasswordStatus = action_status.SUCCEEDED;
                localStorage.setItem('user', null);
            })
            .addCase(changePassword.rejected, (state, action) => {
                state.changedPasswordStatus = action_status.FAILED;
            })
    }
});

const { actions, reducer } = authSlice;
export const { refresh, logout } = actions;
export default reducer;