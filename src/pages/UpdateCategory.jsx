import React, { useEffect } from 'react';
import { Container, Stack, Typography} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { useSnackbar } from 'notistack';
import { useParams } from 'react-router-dom';

import BreadcrumbsRouter from '../components/BreadcrumbRouter';
import Page from '../components/Page';
import CategoryForm from '../features/categories/CategoryForm';
import { clearMessage } from '../features/message/messageSlice';
import { selectCategoryById, updateCategory } from '../features/categories/categorySlice';

const breadcrumbNameMap = {
    '': 'Dashboard',
    'user': 'User',
    'categories': 'Categories',
    'categories/update': 'Update Category'
};

const UpdateCategory = () => {
    const { categoryId } = useParams();
    const { message, variant } = useSelector((state) => state.message);
    const { enqueueSnackbar } = useSnackbar();
    const dispatch = useDispatch();
    const category = useSelector((state) => selectCategoryById(state, categoryId));

    useEffect(() => {
        dispatch(clearMessage());
    }, [dispatch])

    useEffect(() => {
        if (message) {
            enqueueSnackbar(message, { variant });
        }
    }, [enqueueSnackbar, message, variant])

    return (
        <Page title="Update Category">
            <Container maxWidth='xl'>
                <Stack direction='column' spacing={1} mb={5} >
                    <Typography variant="h4">
                        Update Category
                    </Typography>
                    <BreadcrumbsRouter exclude={'dashboard'} breadcrumbNameMap={breadcrumbNameMap} id={categoryId}/>
                </Stack>
                <CategoryForm categoryAction={updateCategory} category={category} />
            </Container>
        </Page>
    );
};

export default UpdateCategory;