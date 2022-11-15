import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';

import { action_status, MESSAGE_VARIANT } from '../constants';
import { setMessage } from './messageSlice';
import api from '../api';

const skillsAdapter = createEntityAdapter();

const initialState = skillsAdapter.getInitialState({
    status: action_status.IDLE,
    error: null,
    isUpdated: false,
    isAdded: false,
    isDeleted: false
});

export const getSkills = createAsyncThunk(
    'skills/getSkills',
    async () =>  {
        const { data } = await api.get('/skills');
        return data;
    }
);

export const createSkill = createAsyncThunk(
    'skills/create',
    async (skill, thunkApi) => {
        try {
            const { data } = await api.post('/skills/admin/create', skill);

            return data;
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message) 
                || error.message || error.toString();

            thunkApi.dispatch(setMessage({ message, variant: MESSAGE_VARIANT.ERROR }));

            return thunkApi.rejectWithValue();
        }
    }
);

export const updateSkill = createAsyncThunk(
    'skills/update',
    async (skill, thunkApi) => {
        try {
            const { data } = await api.put(`/skills/admin/${skill.id}`, skill);

            return data;
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message) 
                || error.message || error.toString();

            thunkApi.dispatch(setMessage({ message, variant: MESSAGE_VARIANT.ERROR }));

            return thunkApi.rejectWithValue();
        }
    }
);

export const deleteSkill = createAsyncThunk(
    'skills/delete',
    async (skillId, thunkApi) => {
        try {
            const { data } = await api.delete(`/skills/admin/${skillId}`);

            data.skillId = skillId;
            return data;
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message) 
                || error.message || error.toString();

            thunkApi.dispatch(setMessage({ message, variant: MESSAGE_VARIANT.ERROR }));

            return thunkApi.rejectWithValue();
        }
    }
)

const skillSlice = createSlice({
    name: 'skills',
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
            .addCase(getSkills.pending, (state, action) => {
                state.status = action_status.LOADING;
            })
            .addCase(getSkills.fulfilled, (state, action) => {
                skillsAdapter.setAll(state, action.payload.skills);
                state.status = action_status.SUCCEEDED;
            })
            .addCase(getSkills.rejected, (state, action) => {
                state.status = action_status.FAILED;
                state.error = action.error;
            })
            .addCase(createSkill.fulfilled, (state, action) => {
                skillsAdapter.addOne(state, action.payload.skill);
                state.isAdded = true;
            })
            .addCase(createSkill.rejected, (state, action) => {
                state.error = action.error;
            })
            .addCase(updateSkill.fulfilled, (state, action) => {
                state.isUpdated = true;
            })
            .addCase(updateSkill.rejected, (state, action) => {
                state.error = action.error;
            })
            .addCase(deleteSkill.pending, (state, action) => {
                state.isDeleted = false;
            })
            .addCase(deleteSkill.fulfilled, (state, action) => {
                state.isDeleted = true;
                skillsAdapter.removeOne(state, action.payload.skillId);
            })
    }
});

export const {
    selectAll: selectAllSkills,
    selectById: selectSkillById,
    selectIds: selectSkillIds
} = skillsAdapter.getSelectors((state) => state.skills);

const { reducer, actions } = skillSlice;
export const { refresh } = actions;

export default reducer;