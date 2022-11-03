import { createSlice } from '@reduxjs/toolkit';

import { MESSAGE_VARIANT } from '../../app/constants';

const initialState = { 
    message: '',
    variant: MESSAGE_VARIANT.ERROR
};

const messageSlice = createSlice({
    name: 'message',
    initialState,
    reducers: {
        setMessage: (state, action) => {
            return { message: action.payload.message, variant: action.payload.variant };
        },
        clearMessage: () => {
            return { message: '' };
        },
    },
});

const { reducer, actions } = messageSlice;
export const { setMessage, clearMessage } = actions;
export default reducer;