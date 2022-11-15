import React, { useEffect } from 'react';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Grid, Stack, Paper, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import { LoadingButton } from '@mui/lab';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';

import { FormProvider, RHFTextField, RHFSelect } from '../../components/hook-form';
import { getCategories, refresh } from '../../app/slices/categorySlice';
import { action_status, MESSAGE_VARIANT } from '../../app/constants';

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

const CategoryForm = (props) => {
    const { categoryAction, category } = props;
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { status, isUpdated, isAdded } = useSelector((state) => state.categories);
    const { enqueueSnackbar } = useSnackbar();


    const CategorySchema = Yup.object().shape({
        id: Yup.string(),
        name: Yup.string().required('Name is required'),
    });

    const defaultValues = {
        id: '',
        name: '',
        description: '',
        parent: ''
    };

    if (category) {
        defaultValues.id = category.id;
        defaultValues.name = category.name;
        defaultValues.description = category.description;

        if (category.parent) {
            defaultValues.parent = category.parent.id;
        }
    }

    const methods = useForm({
        resolver: yupResolver(CategorySchema),
        defaultValues,
    });
    
    const {
        handleSubmit,
        formState: { isSubmitting },
    } = methods;
    
    const onSubmit = async (data) => {
        dispatch(categoryAction(data));
    };

    useEffect(() => {
        dispatch(refresh());
    }, [dispatch])

    useEffect(() => {
        if (isAdded) {
            enqueueSnackbar('Created successfully', { variant: 'success' });
            navigate('/dashboard/categories');
        }

        if (isUpdated) {
            enqueueSnackbar('Updated successfully', { variant: 'success' });
            navigate('/dashboard/categories');
        }

        if (status === action_status.IDLE) {
            dispatch(getCategories());
        }

    }, [dispatch, navigate, enqueueSnackbar, status, isUpdated, isAdded]);

    if (status === action_status.LOADING) {
        return (
            <div>Loading</div>
        );
    } 

    if (status === action_status.SUCCEEDED) {

        return (
            <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={8}>
                        <PaperStyle>
                            <Stack spacing={3}>
                                <RHFTextField name="name" label="Category Name *" />
                                <Box
                                    sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}
                                >
                                    <ButtonStyle component={RouterLink} to="/dashboard/categories" variant='contained' sx={{ mr: 1 }}>
                                        Cancel
                                    </ButtonStyle>
                                    <LoadingButtonSuccessStyle type='submit' variant='contained' loading={isSubmitting}>
                                        Save
                                    </LoadingButtonSuccessStyle>
                                </Box>
                            </Stack>
                        </PaperStyle>
                    </Grid>
                    <Grid item xs={12} md={4}>

                    </Grid>
                </Grid>
            </FormProvider>
        );
    }
};

export default CategoryForm;