import React, { useEffect } from 'react';
import { styled } from '@mui/material/styles';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Grid, Stack, Paper, Box } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';

import { FormProvider, RHFTextField } from '../../components/hook-form';
import { refresh } from '../../app/slices/pointSlice';

const PaperStyle = styled(Paper)(({ theme }) => ({
    color: theme.palette.main,
    overflow: 'hidden',
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    zIndex: 0,
    padding: theme.spacing(3),
    boxShadow: theme.shadows[2]
}));

const ButtonStyle = styled(Button)(({ theme }) => ({
    backgroundColor: theme.palette.grey[500_56],
    '&:hover': { 
        backgroundColor: theme.palette.grey[500]
    }
}));

const LoadingButtonSuccessStyle = styled(LoadingButton)(({ theme }) => ({
    backgroundColor: theme.palette.success.dark,
    '&:hover': {
        backgroundColor: theme.palette.success.main,
    },
    color: '#fff'
}));

const PointForm = (props) => {
    const { pointAction, point } = props;
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isUpdated, isAdded } = useSelector((state) => state.points);
    const { enqueueSnackbar } = useSnackbar();

    const PointSchema = Yup.object().shape({
        name: Yup.string().required('Name is required'),
        points: Yup.string().required('Points is required'),
        price: Yup.string().required('Price is required')
    });

    const defaultValues = {
        name: '',
        points: '',
        price: ''
    };

    if (point) {
        defaultValues.name = point.name;
        defaultValues.points = point.points;
        defaultValues.price = point.price;
    }

    const methods = useForm({
        resolver: yupResolver(PointSchema),
        defaultValues,
    });
    
    const {
        handleSubmit,
        formState: { isSubmitting },
    } = methods;
    
    const onSubmit = async (data) => {
        dispatch(pointAction(data));
    };

    useEffect(() => {
        if (isAdded) {
            enqueueSnackbar('Created Point', { variant: 'success' });
            dispatch(refresh());
            navigate('/dashboard/points');
        }

        if (isUpdated) {
            enqueueSnackbar('Updated Point', { variant: 'success' });
            dispatch(refresh());
            navigate('/dashboard/points');
        }

    }, [dispatch, navigate, enqueueSnackbar, isUpdated, isAdded]);

    return (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
                <Grid item xs={12} md={5}>
                    
                </Grid>
                <Grid item xs={12} md={7}>
                    <PaperStyle>
                        <Stack spacing={3}>
                            <RHFTextField name="name" label="Point Name *" />
                            <RHFTextField name="points" label="Points *" />
                            <RHFTextField name="price" label="Price *" />
                            <Box
                                sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}
                            >
                                <ButtonStyle component={RouterLink} to="/dashboard/points" variant='contained' sx={{ mr: 1 }}>
                                    Cancel
                                </ButtonStyle>
                                <LoadingButtonSuccessStyle type='submit' variant='contained' loading={isSubmitting}>
                                    Save
                                </LoadingButtonSuccessStyle>
                            </Box>
                        </Stack>
                    </PaperStyle>
                </Grid>
            </Grid>
        </FormProvider>
    );
};

export default PointForm;