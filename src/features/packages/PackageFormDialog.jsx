import React from 'react';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    InputAdornment ,
    Stack,
    Grid
} from '@mui/material';
import * as Yup from 'yup';
import { styled } from '@mui/material/styles';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch, useSelector } from 'react-redux';
import { LoadingButton } from '@mui/lab';

import { RHFTextField, FormProvider } from '../../components/hook-form';
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

const PackageFormDialog = (props) => {
    const { pkg, packageAction, dialogTitle, dialogContent, open, handleClose } = props;
    const dispatch = useDispatch();
    const { addOrUpdateStatus } = useSelector((state) => state.packages);

    useEffect(() => {
        if (addOrUpdateStatus === action_status.SUCCEEDED) {
            handleClose();
        }
    }, [addOrUpdateStatus, handleClose])

    const pkgSchema = Yup.object().shape({
        description: Yup.string().required('Description is required'),
        canPost: Yup.string().required('Can Post is required').matches(/^[0-9]+$/, "Must be only digits"),
        price: Yup.string().required('Price is required').matches(/^[0-9]+$/, "Must be only digits"),
        point: Yup.string().required('Point is required').matches(/^[0-9]+$/, "Must be only digits"),
        id: Yup.string()
    });

    const defaultValues = {
        description: '',
        canPost: '',
        price: '',
        point: '',
        id: '',
    };

    if (pkg) {
        defaultValues.description = pkg.description;
        defaultValues.price = pkg.price;
        defaultValues.point = pkg.point;
        defaultValues.canPost = pkg.canPost;
        defaultValues.id = pkg.id;
    }

    const methods = useForm({
        resolver: yupResolver(pkgSchema),
        defaultValues,
    });

    const { handleSubmit } = methods;

    const onSubmit = async (data) => {
        dispatch(packageAction(data));
    };

    return (
        <Dialog open={open} onClose={handleClose} fullWidth={true}>
            <DialogTitle>{dialogTitle}</DialogTitle>
            <DialogContent>{dialogContent}</DialogContent>
            <Box sx={{ padding: 2 }}>
                <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                    <Stack spacing={1} sx={{ marginBlockEnd: 2 }}>
                        <RHFTextField name="description" label="Description *" fullWidth multiple row={1} />
                    </Stack>
                    <Grid container spacing={1}>
                        <Grid item xs={12} md={4}>
                            <RHFTextField name="price" label="Price *"   
                                InputProps={{
                                    startAdornment: (
                                    <InputAdornment position="start">
                                        $
                                    </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <RHFTextField name="canPost" label="Can Post *" />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <RHFTextField name="point" label="Point *" />
                        </Grid>
                    </Grid>
                    <DialogActions>
                        <ButtonStyle onClick={handleClose}>Cancel</ButtonStyle>
                        <LoadingButtonSuccessStyle
                            type='submit'
                            variant='contained'
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

export default PackageFormDialog;