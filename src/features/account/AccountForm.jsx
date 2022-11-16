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

const LoadingButtonStyle = styled(LoadingButton)(({ theme }) => ({
    backgroundColor: theme.palette.success.dark,
    '&:hover': {
        backgroundColor: theme.palette.success.main,
    },
    color: '#fff'
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
        email: Yup.string(),
        phone: Yup.string().required('Phone is required'),
        introduction: Yup.string().required('Address is required'),
        address: Yup.string().required('Address is required'),
        city: Yup.string().required('City is required'),
        country: Yup.string().required('Country is required'),
        image: Yup.mixed()
    });

    const address = user?.address?.split(', ');

    const defaultValues = {
        id: user?.id,
        email: user?.email,
        phone: user?.phone,
        introduction: user?.introduction,
        address: address?.length === 3 ? address[0] : '',
        city: address?.length === 3 ? address[1] : '',
        country: address?.length === 3 ? address[2] : '',
        image: '',
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
                        <AvatarUploader avatarUrl={user?.image} name='image' setFocus={setFocus} />
                    </PaperStyle>
                </Grid>
                <Grid item xs={12} md={7}>
                    <PaperStyle>
                        <BoxFieldStyle>
                            <RHFTextField name='email' label='Email *' disabled={true} />
                            <RHFTextField name='phone' label='Phone *' />
                            <RHFTextField name='address' label='Address *' />
                            <RHFTextField name='city' label='City *' />
                            <RHFTextField name='country' label='Country *' />
                        </BoxFieldStyle>
                        <Box sx={{
                            marginBlock: 2
                        }}>
                            <RHFTextField name="introduction" label="Introduction *" multiline minRows={5} />
                        </Box>
                        <Box
                            sx={{ display: 'flex', justifyContent: 'flex-end' }}
                        >
                            <LoadingButtonStyle size="large" type="submit" variant="contained" loading={updateStatus === action_status.LOADING ? true : false}>
                                Save Changes
                            </LoadingButtonStyle>
                        </Box>
                    </PaperStyle>
                </Grid>
            </Grid>
        </FormProvider>
    );
};

export default AccountForm;