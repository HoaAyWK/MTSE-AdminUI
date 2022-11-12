import React, { useEffect } from 'react';
import { Container, Stack, Typography} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { useSnackbar } from 'notistack';

import BreadcrumbsRouter from '../components/BreadcrumbRouter';
import Page from '../components/Page';
import CategoryForm from '../features/categories/CategoryForm';
import { clearMessage } from '../app/slices/messageSlice';
import { createCategory } from '../app/slices/categorySlice';

const breadcrumbNameMap = {
    '': 'Dashboard',
    'user': 'User',
    'categories': 'Categories',
    'categories/new': 'New Category'
};


const CreateCategory = () => {
    const { message, variant } = useSelector((state) => state.message);
    const { enqueueSnackbar } = useSnackbar();
    const dispatch = useDispatch();
    
    useEffect(() => {
        dispatch(clearMessage());
    }, [dispatch])

    useEffect(() => {
        if (message) {
            enqueueSnackbar(message, { variant });
        }
    }, [enqueueSnackbar, message, variant])

    return (
        <Page title="Create Category">
            <Container maxWidth='xl'>
                <Stack direction='column' spacing={1} mb={5} >
                    <Typography variant="h4">
                        Create Category
                    </Typography>
                    <BreadcrumbsRouter exclude={'dashboard'} breadcrumbNameMap={breadcrumbNameMap}/>
                </Stack>
                <CategoryForm categoryAction={createCategory} />
            </Container>
        </Page>
    );
}

export default CreateCategory;