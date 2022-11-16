import React, { useState } from 'react';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle, 
    Typography
} from '@mui/material';
import * as Yup from 'yup';
import { styled } from '@mui/material/styles';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch, useSelector } from 'react-redux';
import { LoadingButton } from '@mui/lab';

import { RHFTextField, FormProvider } from '../../components/hook-form';
import CategoryImageUploader from './CategoryImageUploader';
import { useEffect } from 'react';
import { action_status } from '../../app/constants';

const ButtonStyle = styled(Button)(({ theme }) => ({
    backgroundColor: theme.palette.grey[500_24],
    color: theme.palette.grey[600],
    '&:hover': { 
        backgroundColor: theme.palette.grey[500],
        color: theme.palette.grey[200]
    }
}));

const LoadingButtonSuccessStyle = styled(LoadingButton)(({ theme }) => ({
    backgroundColor: theme.palette.success.dark,
    '&:hover': {
        backgroundColor: theme.palette.success.main,
    },
    color: '#fff'
}));

const CategoryFormDialog = (props) => {
    const { category, categoryAction, dialogTitle, dialogContent, open, handleClose } = props;
    const [clickedSubmit, setClickedSubmit] = useState(false);
    const dispatch = useDispatch();
    const { addOrUpdateStatus } = useSelector((state) => state.categories);

    useEffect(() => {
        if (addOrUpdateStatus === action_status.SUCCEEDED) {
            handleClose();
        }
    }, [addOrUpdateStatus, handleClose])

    const categorySchema = Yup.object().shape({
        name: Yup.string().required('Name is required'),
        image: Yup.mixed().required('Image is required'),
        id: Yup.string()
    });

    const defaultValues = {
        name: '',
        image: null,
        id: '',
    };

    if (category) {
        defaultValues.name = category.name;
        defaultValues.id = category.id;
    }

    const methods = useForm({
        resolver: yupResolver(categorySchema),
        defaultValues,
    });

    const { handleSubmit, formState: { isSubmitting } } = methods;

    const onSubmit = async (data) => {
        dispatch(categoryAction(data));
    };

    const handleClickSubmit = () => {
        setClickedSubmit(true);
    };

    return (
        <Dialog open={open} onClose={handleClose} fullWidth={true}>
            <DialogTitle>{dialogTitle}</DialogTitle>
            <DialogContent>{dialogContent}</DialogContent>
            <Box sx={{ padding: 2 }}>
                <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                    <RHFTextField name="name" label="Name *" fullWidth />
                    <Typography variant='body1' color='text.secondary' sx={{ marginBlockStart: 2, marginInlineStart: 1 }}>
                        Image *
                    </Typography>
                    <Box 
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginBlock: 2
                        }}
                    >
                        <CategoryImageUploader name="image" imageUrl={category?.image} isSubmitting={clickedSubmit} />
                        </Box>
                    <DialogActions>
                        <ButtonStyle onClick={handleClose}>Cancel</ButtonStyle>
                        <LoadingButtonSuccessStyle
                            type='submit'
                            variant='contained'
                            onClick={handleClickSubmit}
                            loading={addOrUpdateStatus === action_status.LOADING ? true : false}
                        >
                            Save
                        </LoadingButtonSuccessStyle>
                    </DialogActions>
                </FormProvider>
            </Box>
        </Dialog>
    );
};

export default CategoryFormDialog;