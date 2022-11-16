import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { styled } from '@mui/material/styles';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Paper, Stack } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { RHFTextField, FormProvider } from '../../components/hook-form';
import { changePassword, refresh } from '../../app/slices/authSlice';
import { clearMessage } from '../../app/slices/messageSlice';
import { action_status } from '../../app/constants';

const PaperStyle = styled(Paper)(({theme}) => ({
    backgroundColor: '#fff',
    color: 'rgb(34, 43, 54)',
    transition: 'box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
    overflow: 'hidden',
    position: 'relative',
    boxShadow: theme.shadows[2],
    padding: theme.spacing(3),
    zIndex: 0
}));

const LoadingButtonStyle = styled(LoadingButton)(({ theme }) => ({
    backgroundColor: theme.palette.success.dark,
    '&:hover': {
        backgroundColor: theme.palette.success.main,
    },
    color: '#fff'
}));

const ChangePasswordFrom = (props) => {
    const { user } = props;
    const dispatch = useDispatch();
    const { changedPassword, changedPasswordStatus } = useSelector((state) => state.auth);
    const { enqueueSnackbar } = useSnackbar();
    const { message } = useSelector((state) => state.message);
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(clearMessage());
    }, [dispatch])

    useEffect(() => {
        if (message) {
            enqueueSnackbar(message, { variant: 'error' });
            dispatch(clearMessage());
        }
    }, [message, dispatch, enqueueSnackbar])

    useEffect(() => {
        if (changedPassword) {
            enqueueSnackbar('Changed password successfully. Plaese login agian!', { variant: 'success' });
            dispatch(refresh());
            navigate('/login');
        }
    }, [changedPassword, enqueueSnackbar, dispatch, navigate])

    const UserSchema = Yup.object().shape({
        id: Yup.string().required(),
        oldPassword: Yup.string().required('Old Password is required'),
        newPassword: Yup.string()
            .required('New Passsword is reuquired')
            .test('len', 'New Password must be at least 6 characters', val => val.length > 5),
        confirmNewPassword: Yup.string().oneOf([Yup.ref('newPassword'), null], 'Cofirm New Password must match New Password')
    });

    const defaultValues = {
        id: user?.id,
        oldPassword: '',
        newPassword: '',
        confirmNewPassword: ''
    };

    const methods = useForm({
        resolver: yupResolver(UserSchema),
        defaultValues
    });

    const {
        handleSubmit
    } = methods;

    const onSubmit = async (data) => {
        dispatch(changePassword(data));
    };

    return (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)} >
            <PaperStyle>
                <Stack spacing={2}>
                    <RHFTextField name='oldPassword' label='Old Password *' type='password' />
                    <RHFTextField name='newPassword' label='New Password *' type='password' />
                    <RHFTextField name='confirmNewPassword' label='Cofirm New Password *' type='password' />
                    <Box
                        sx={{ display: 'flex', justifyContent: 'flex-end' }}
                    >
                        <LoadingButtonStyle
                            size="large"
                            type="submit"
                            variant="contained"
                            loading={changedPasswordStatus === action_status.LOADING ? true : false}
                        >
                            Save Changes
                        </LoadingButtonStyle>
                    </Box>
                </Stack>
            </PaperStyle>
        </FormProvider>
    );
};

export default ChangePasswordFrom;