import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { styled } from '@mui/material/styles';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Paper, Grid } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useSnackbar } from 'notistack';
import { useDispatch, useSelector } from 'react-redux';

import { RHFTextField, RHFRadioGroup, FormProvider } from '../../components/hook-form';
import AvatarUploader from './AvatarUploader';
import { refresh, updateAccount } from '../../app/slices/authSlice';
import { clearMessage } from '../../app/slices/messageSlice';
import { action_status } from '../../app/constants';


const genders = ['Male', 'Female'];

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

const BoxFieldStyle = styled('div')(({theme}) => ({
    gap: '24px 16px',
    display: 'grid',
    [theme.breakpoints.up('xs')]: {
        gridTemplateColumns: 'repeat(1, 1fr)'
    },
    [theme.breakpoints.up('md')]: {
        gridTemplateColumns: 'repeat(2, 1fr)'
    }
}));

const AccountForm = (props) => {
    const { user } = props;
    const dispatch = useDispatch();
    const { updated, updateStatus } = useSelector((state) => state.auth);
    const { message } = useSelector((state) => state.message);
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        dispatch(clearMessage());
    }, [dispatch])

    useEffect(() => {
        if (message) {
            enqueueSnackbar(message, { variant: 'error' });
            dispatch(clearMessage());
        }
    }, [message, enqueueSnackbar, dispatch])

    useEffect(() => {
        if (updated) {
            enqueueSnackbar('Updated Profile', { variant: 'success' });
            dispatch(refresh());
        }
    }, [updated, dispatch, enqueueSnackbar]);

    const UserSchema = Yup.object().shape({
        id: Yup.string(),
        name: Yup.string().required('Name is required'),
        email: Yup.string(),
        phone: Yup.string().required('Phone is required'),
        gender: Yup.mixed().oneOf(['Male', 'Female']),
        address: Yup.string().required('Address is required'),
        city: Yup.string().required('City is required'),
        country: Yup.string().required('Country is required'),
        avatar: Yup.mixed()
    });

    const defaultValues = {
        id: user?.id,
        name: user?.name,
        email: user?.email,
        phone: user?.phone,
        gender: user?.gender === 'None' ? 'Male' : user?.gender,
        address: user?.address,
        city: user?.city,
        country: user?.country,
        avatar: null
    };
    
    const methods = useForm({
        resolver: yupResolver(UserSchema),
        defaultValues
    });

    const {
        handleSubmit,
        setFocus
    } = methods;


    const onSubmit = async (data) => {
        dispatch(updateAccount(data));
    };

    return (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
                <Grid item xs={12} md={5} sx={{ margin: 0 }}>
                    <PaperStyle sx={{ padding: '80px 24px'}}>
                        <AvatarUploader avatarUrl={user?.avatar?.url} name='avatar' setFocus={setFocus} />
                    </PaperStyle>
                </Grid>
                <Grid item xs={12} md={7}>
                    <PaperStyle>
                        <BoxFieldStyle>
                            <RHFTextField name='name' label='Name *' />
                            <RHFTextField name='email' label='Email *' disabled={true} />
                            <RHFTextField name='phone' label='Phone *' />
                            <RHFTextField name='address' label='Address *' />
                            <RHFTextField name='city' label='City *' />
                            <RHFTextField name='country' label='Country *' />
                            <RHFRadioGroup name='gender' id='radios-gender' label='Gender' items={genders} row />
                        </BoxFieldStyle>
                        <Box
                            sx={{ display: 'flex', justifyContent: 'flex-end' }}
                        >
                            <LoadingButton size="large" type="submit" variant="contained" loading={updateStatus === action_status.LOADING ? true : false}>
                                Save Changes
                            </LoadingButton>
                        </Box>
                    </PaperStyle>
                </Grid>
            </Grid>
        </FormProvider>
    );
};

export default AccountForm;