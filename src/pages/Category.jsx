import React, { useState, useEffect } from 'react';
import { filter } from 'lodash';
import { Link as RouterLink } from 'react-router-dom';
import {
    Box,
    Card,
    Table,
    Stack,
    Button,
    TableRow,
    TableBody,
    TableCell,
    Container,
    CircularProgress,
    Typography,
    TableContainer,
    TablePagination,
    Alert,
    Avatar,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';

import Page from '../components/Page';
import Iconify from '../components/Iconify';
import SearchNotFound from '../components/SearchNotFound';
import { createCategory, deleteCategory, getCategories, refresh, selectAllCategories, updateCategory } from '../app/slices/categorySlice';
import { action_status } from '../app/constants';
import { SimpleTableListHead, SimpleTableListToolbar, MoreMenu } from '../components/tables';
import { fDateTimeSuffix } from '../utils/formatTime';
import { clearMessage } from '../app/slices/messageSlice';
import MoreMenuItem from '../components/tables/MoreMenuItem';
import AlertDialog from '../components/AlertDialog';
import CategoryFormDialog from '../features/categories/CategoryFormDialog';

const ButtonStyle = styled(Button)(({ theme }) => ({
    backgroundColor: theme.palette.success.dark,
    '&:hover': {
        backgroundColor: theme.palette.success.main,
    },
    color: '#fff'
}));

const TABLE_HEAD = [
    { id: 'name', label: 'Category', alignRight: false },
    { id: 'createdAt', label: 'Created At', alignRight: false },
    { id: 'updatedAt', label: 'Updated At', alignRight: false },
    { id: '', label: '', alignRight: false },
];

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    if (query) {
        return filter(array, (item) => item.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
    }
    return stabilizedThis.map((el) => el[0]);
}

const Category = () => {
    const [page, setPage] = useState(0);

    const [order, setOrder] = useState('asc');

    const [orderBy, setOrderBy] = useState('name');

    const [filterName, setFilterName] = useState('');

    const [rowsPerPage, setRowsPerPage] = useState(5);

    const [open, setOpen] = useState(false);

    const [openCreateCategoryDialog, setOpenCreateFormDialog] = useState(false);

    const [openUpdateCategoryDialog, setOpenUpdateCategoryDialog] = useState(false);

    const dispatch = useDispatch();

    const categories = useSelector(selectAllCategories);

    const { isAdded, isDeleted, isUpdated } = useSelector((state) => state.categories);

    const { message } = useSelector((state) => state.message);

    const { enqueueSnackbar } = useSnackbar();

    const { status } = useSelector((state) => state.categories);

    useEffect(() => {
        if (status === action_status.IDLE) {
            dispatch(getCategories());
        }
        dispatch(clearMessage());
        dispatch(refresh());
    }, [dispatch, status]);

    useEffect(() => {
        if (isUpdated) {
            enqueueSnackbar('Updated successfully', { variant: 'success' });
            dispatch(refresh());
            dispatch(getCategories());
        }
    }, [isUpdated, dispatch, enqueueSnackbar])

    useEffect(() => {
        if (isDeleted) {
            enqueueSnackbar("Deleted successfully", { variant: 'success' });
            dispatch(refresh());
        }
    }, [isDeleted, enqueueSnackbar, dispatch]);

    useEffect(() => {
        if (message) {
            enqueueSnackbar(message, { variant: 'error' });
            dispatch(clearMessage());
        }
    }, [message, dispatch, enqueueSnackbar]);

    useEffect(() => {
        if (isAdded) {
            enqueueSnackbar("Created successfully", { variant: 'success' });
            dispatch(refresh());
        }
    }, [isAdded, enqueueSnackbar, dispatch]);

    const handleOpenCreateCategoryDialog = () => {
        setOpenCreateFormDialog(true);
    };

    const handleCloseCreateCategoryDialog = () => {
        setOpenCreateFormDialog(false);
    };

    const handleOpenUpdateCategoryDialog = () => {
        setOpenUpdateCategoryDialog(true);
    };

    const handleCloseUpdateCategoryDialog = () => {
        setOpenUpdateCategoryDialog(false);
    };

    const handleDeleteClick = () => {
        setOpen(true);
    };

    const handleDelete = (categoryId) => {
        dispatch(deleteCategory(categoryId));
    };

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
            setOrder(isAsc ? 'desc' : 'asc');
            setOrderBy(property);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleFilterByName = (event) => {
        setFilterName(event.target.value);
    };

    const handleClose = () => {
        setOpen(false);
    };

    if (status === action_status.LOADING) {
        return (
            <Page title='Category'>
                <Container maxWidth='xl'>
                    <Box 
                        sx={{
                            width: '100%',
                            height: '60vh',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                    >
                        <CircularProgress />
                    </Box>
                </Container>
            </Page>
        )
    } else if (status === action_status.FAILED) {
        return (
            <Page title='Category'>
                <Container maxWidth='xl'>
                    <Box 
                        sx={{
                            width: '100%',
                            height: '60vh',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                    >
                            <Alert severity='error'>Error when fecth data</Alert>
                    </Box>
                </Container>
            </Page>
        )
    } else if (status === action_status.SUCCEEDED) {
        const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - categories.length) : 0;

        const filteredCategories = applySortFilter(categories, getComparator(order, orderBy), filterName);

        const isCategoryNotFound = filteredCategories.length === 0;

        return (
            <Page title="Category">
                <Container maxWidth='xl'>
                    <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                        <Typography variant="h4" >
                            Category
                        </Typography>
                        <ButtonStyle
                            variant="contained"
                            startIcon={<Iconify icon="eva:plus-fill" style={{ color: 'white' }}/>}
                            onClick={handleOpenCreateCategoryDialog}
                        >
                            New Category
                        </ButtonStyle>
                    </Stack>
                    <CategoryFormDialog
                        open={openCreateCategoryDialog}
                        handleClose={handleCloseCreateCategoryDialog}
                        dialogTitle='Create category'
                        dialogContent='Create a new category'
                        categoryAction={createCategory}
                    />
                    <Card>
                        <SimpleTableListToolbar filterName={filterName} onFilterName={handleFilterByName} title='category'/>
                        <TableContainer sx={{ minWidth: 800 }}>
                            <Table>
                                <SimpleTableListHead
                                    order={order}
                                    orderBy={orderBy}
                                    headLabel={TABLE_HEAD}
                                    rowCount={categories.length}
                                    onRequestSort={handleRequestSort}
                                />
                                <TableBody>
                                {filteredCategories.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                    const { id, name, createdAt, updatedAt, image } = row;
                
                                    return (
                                    <TableRow
                                        hover
                                        key={id}
                                        tabIndex={-1}
                                    >
                                        <TableCell align="left" width={350}>
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center'
                                                }}
                                            >
                                                {image ? (
                                                    <Avatar variant='rounded' src={image} alt={name} />
                                                ) : (
                                                    <Avatar variant='rounded'>
                                                        <Iconify icon='bx:category-alt' width={24} height={24} />
                                                    </Avatar>
                                                )}
                                                <Typography variant='body1' sx={{ marginInlineStart: 1 }}>
                                                    {name}
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell align="left">{fDateTimeSuffix(createdAt)}</TableCell>
                                        <TableCell align="left" width={350}>{fDateTimeSuffix(updatedAt)}</TableCell>
                                        <TableCell align="right">
                                            <MoreMenu>
                                                <MoreMenuItem title="Edit" iconName="eva:edit-fill" handleClick={handleOpenUpdateCategoryDialog}/>
                                                <MoreMenuItem title="Delete" iconName="eva:trash-2-outline" handleClick={handleDeleteClick} id={id} />
                                                <AlertDialog
                                                    itemId={id}
                                                    open={open}
                                                    handleClose={handleClose}
                                                    title='Delete Category'
                                                    content='Are you sure to delete this category'
                                                    handleConfirm={handleDelete}
                                                    color='error'
                                                />
                                                <CategoryFormDialog
                                                    open={openUpdateCategoryDialog}
                                                    handleClose={handleCloseUpdateCategoryDialog}
                                                    dialogTitle='Update category'
                                                    dialogContent='Update category name and category image'
                                                    categoryAction={updateCategory}
                                                    category={row}
                                                />
                                            </ MoreMenu>
                                        </TableCell>
                                    </TableRow>
                                    );
                                })}
                                {emptyRows > 0 && (
                                    <TableRow style={{ height: 53 * emptyRows }}>
                                        <TableCell colSpan={6} />
                                    </TableRow>
                                )}
                                </TableBody>
                
                                {isCategoryNotFound && (
                                <TableBody>
                                    <TableRow>
                                        <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                                            <SearchNotFound searchQuery={filterName} />
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                                )}
                            </Table>
                        </TableContainer>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25]}
                            component="div"
                            count={categories.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </Card>
                </Container>
            </Page>
        );
    }
};

export default Category;