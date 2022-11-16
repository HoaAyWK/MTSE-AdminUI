import React from 'react';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle 
} from '@mui/material';
import * as Yup from 'yup';
import { styled } from '@mui/material/styles';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch } from 'react-redux';
import { LoadingButton } from '@mui/lab';

import { RHFTextField, FormProvider } from '../../components/hook-form';

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

const SkillFormDialog = (props) => {
    const { skill, skillAction, dialogTitle, dialogContent, open, handleClose } = props;

    const dispatch = useDispatch();

    const SkillSchema = Yup.object().shape({
        name: Yup.string().required('Name is required'),
        id: Yup.string()
    });

    const defaultValues = {
        name: '',
        id: '',
    };

    if (skill) {
        defaultValues.name = skill.name;
        defaultValues.id = skill.id;
    }

    const methods = useForm({
        resolver: yupResolver(SkillSchema),
        defaultValues,
    });

    const { handleSubmit } = methods;

    const onSubmit = async (data) => {
        dispatch(skillAction(data));
        handleClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} fullWidth={true}>
            <DialogTitle>{dialogTitle}</DialogTitle>
            <DialogContent>{dialogContent}</DialogContent>
            <Box sx={{ padding: 2 }}>
                <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                    <RHFTextField name="name" label="Name *" fullWidth />
                    <DialogActions>
                        <ButtonStyle onClick={handleClose}>Cancel</ButtonStyle>
                        <LoadingButtonSuccessStyle type='submit' variant='contained'>
                            Save
                        </LoadingButtonSuccessStyle>
                    </DialogActions>
                </FormProvider>
            </Box>
        </Dialog>
    );
};

export default SkillFormDialog;