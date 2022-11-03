import React, { useState, useEffect } from 'react';
import { filter } from 'lodash';
import { Link as RouterLink } from 'react-router-dom';
import {
    Box,
    Card,
    Table,
    Stack,
    Button,
    Checkbox,
    TableRow,
    TableBody,
    TableCell,
    Container,
    CircularProgress,
    Typography,
    TableContainer,
    TablePagination,
    Alert,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';

import Page from '../components/Page';
import Iconify from '../components/Iconify';
import SearchNotFound from '../components/SearchNotFound';
import { deleteCategory, getCategories, refresh, selectAllCategories } from '../features/categories/categorySlice';
import { action_status } from '../app/constants';
import { TableListHead, TableListToolbar, MoreMenu } from '../components/tables';
import { fDateTimeSuffix } from '../utils/formatTime';
import { clearMessage } from '../features/message/messageSlice';
import MoreMenuLinkItem from '../components/tables/MoreMenuLinkItem';
import MoreMenuItem from '../components/tables/MoreMenuItem';

const TABLE_HEAD = [
    { id: 'name', label: 'Name', alignRight: false },
    { id: 'createdAt', label: 'Created At', alignRight: false},
    { id: 'parent', label: 'Parent', alignRight: false },
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
        return filter(array, (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
    }
    return stabilizedThis.map((el) => el[0]);
}

const Category = () => {
    const [page, setPage] = useState(0);

    const [order, setOrder] = useState('asc');

    const [selected, setSelected] = useState([]);

    const [orderBy, setOrderBy] = useState('name');

    const [filterName, setFilterName] = useState('');

    const [rowsPerPage, setRowsPerPage] = useState(5);

    const dispatch = useDispatch();
    const categories = useSelector(selectAllCategories);
    const { deleted } = useSelector((state) => state.categories);

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
        if (deleted) {
            enqueueSnackbar("Deleted successfully", { variant: 'success' });
            dispatch(refresh());
        }
    }, [deleted, enqueueSnackbar, dispatch]);


    const handleDeleteClick = (categoryId) => {
        dispatch(deleteCategory(categoryId));
    }

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
            setOrder(isAsc ? 'desc' : 'asc');
            setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = categories.map((n) => n.name);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event, name) => {
        const selectedIndex = selected.indexOf(name);
        let newSelected = [];
        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, name);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
        }
        setSelected(newSelected);
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
                        <Button variant="contained" component={RouterLink} to="new" startIcon={<Iconify icon="eva:plus-fill" />}>
                            New Category
                        </Button>
                    </Stack>
            
                    <Card>
                        <TableListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} title='category'/>
                        <TableContainer sx={{ minWidth: 800 }}>
                            <Table>
                                <TableListHead
                                    order={order}
                                    orderBy={orderBy}
                                    headLabel={TABLE_HEAD}
                                    rowCount={categories.length}
                                    numSelected={selected.length}
                                    onRequestSort={handleRequestSort}
                                    onSelectAllClick={handleSelectAllClick}
                                />
                                <TableBody>
                                {filteredCategories.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                    const { id, name, createdAt, parent } = row;
                                    const isItemSelected = selected.indexOf(name) !== -1;
                
                                    return (
                                    <TableRow
                                        hover
                                        key={id}
                                        tabIndex={-1}
                                        role="checkbox"
                                        selected={isItemSelected}
                                        aria-checked={isItemSelected}
                                    >
                                        <TableCell padding="checkbox">
                                            <Checkbox checked={isItemSelected} onChange={(event) => handleClick(event, name)} />
                                        </TableCell>
                                        <TableCell align="left" width={350}>{name}</TableCell>
                                        <TableCell align="left">{fDateTimeSuffix(createdAt)}</TableCell>
                                        <TableCell align="left" width={350}>{parent?.name}</TableCell>
                                        <TableCell align="right">
                                            <MoreMenu>
                                                <MoreMenuLinkItem to={`update/${id}`} title="Edit" iconName="eva:edit-fill" />
                                                <MoreMenuItem title="Delete" iconName="eva:trash-2-outline" handleClick={handleDeleteClick} id={id} />
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