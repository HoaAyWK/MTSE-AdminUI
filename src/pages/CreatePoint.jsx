import React, { useEffect } from 'react';
import { Container, Stack, Typography} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { useSnackbar } from 'notistack';

import BreadcrumbsRouter from '../components/BreadcrumbRouter';
import Page from '../components/Page';
import { clearMessage } from '../features/message/messageSlice';
import { createPoint } from '../features/points/pointSlice';
import PointForm from '../features/points/PointForm';

const breadcrumbNameMap = {
    '': 'Dashboard',
    'user': 'User',
    'points': 'Points',
    'points/new': 'New Point'
};

const CreatePoint = () => {
    const { message } = useSelector((state) => state.message);
    const { enqueueSnackbar } = useSnackbar();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(clearMessage());
    }, [dispatch]);

    useEffect(() => {
        if (message) {
            enqueueSnackbar(message, { variant: 'error' });
            dispatch(clearMessage());
        }
    }, [message, enqueueSnackbar, dispatch]);

    return (
        <Page title="Create Point">
        <Container maxWidth='xl'>
            <Stack direction='column' spacing={1} mb={5} >
                <Typography variant="h4">
                    Create Point
                </Typography>
                <BreadcrumbsRouter exclude={'dashboard'} breadcrumbNameMap={breadcrumbNameMap}/>
            </Stack>
            <PointForm pointAction={createPoint} />
        </Container>
    </Page>
    );
};

export default CreatePoint;