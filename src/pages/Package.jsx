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
import { styled } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';

import Page from '../components/Page';
import Iconify from '../components/Iconify';
import SearchNotFound from '../components/SearchNotFound';
import { action_status } from '../app/constants';
import { SimpleTableListHead, SimpleTableListToolbar, MoreMenu } from '../components/tables';
import { clearMessage } from '../app/slices/messageSlice';
import MoreMenuItem from '../components/tables/MoreMenuItem';
import { selectAllPackages, refresh, getPackages, deletePackage } from '../app/slices/packagesSlice';

const ButtonStyle = styled(Button)(({ theme }) => ({
    backgroundColor: theme.palette.success.dark,
    '&:hover': {
        backgroundColor: theme.palette.success.main,
    },
    color: '#fff'
}));

const TABLE_HEAD = [
    { id: 'description', label: 'Description', alignRight: false },
    { id: 'price', label: 'Price', alignRight: true},
    { id: 'canPost', label: 'Can Post', alignRight: true },
    { id: 'point', label: 'Point', alignRight: true},
    { id: '', label: '', alignRight: false},
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
        return filter(array, (_user) => _user.description.toLowerCase().indexOf(query.toLowerCase()) !== -1);
    }
    return stabilizedThis.map((el) => el[0]);
}

const Package = () => {
    const [page, setPage] = useState(0);

    const [order, setOrder] = useState('asc');

    const [orderBy, setOrderBy] = useState('price');

    const [filterName, setFilterName] = useState('');

    const [rowsPerPage, setRowsPerPage] = useState(5);

    const dispatch = useDispatch();
    
    const packages = useSelector(selectAllPackages);

    const { enqueueSnackbar } = useSnackbar();

    const { status, isDeleted } = useSelector((state) => state.packages);

    useEffect(() => {
        if (status === action_status.IDLE) {
            dispatch(getPackages());
        }
        dispatch(clearMessage());
        dispatch(refresh());
    }, [dispatch, status]);

    useEffect(() => {
        if (isDeleted) {
            enqueueSnackbar('Deleted Package', { variant: 'success' });
            dispatch(refresh());
        }
    }, [isDeleted, enqueueSnackbar, dispatch])

    const handleClickDelete = (id) => {
        dispatch(deletePackage(id));
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

    if (status === action_status.LOADING) {
        return (
            <Page title='Package'>
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
            <Page title='Package'>
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
        const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - packages.length) : 0;

        const filteredPackages = applySortFilter(packages, getComparator(order, orderBy), filterName);

        const isPackageNotFound = filteredPackages.length === 0;

        return (
            <Page title="Package">
                <Container maxWidth='xl'>
                    <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                        <Typography variant="h4" >
                            Packages
                        </Typography>
                        <ButtonStyle variant="contained" component={RouterLink} to="new" startIcon={<Iconify icon="eva:plus-fill" style={{ color: 'white' }}/>}>
                            New Package
                        </ButtonStyle>
                    </Stack>
            
                    <Card>
                        <SimpleTableListToolbar filterName={filterName} onFilterName={handleFilterByName} title='package'/>
                        <TableContainer sx={{ minWidth: 800 }}>
                            <Table>
                                <SimpleTableListHead
                                    order={order}
                                    orderBy={orderBy}
                                    headLabel={TABLE_HEAD}
                                    rowCount={packages.length}
                                    onRequestSort={handleRequestSort}
                                />
                                <TableBody>
                                {filteredPackages.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                    const { id, description, point, price, canPost } = row;
                
                                    return (
                                    <TableRow
                                        hover
                                        key={id}
                                        tabIndex={-1}
                                    >
                                        <TableCell align="left" width={500}>{description}</TableCell>
                                        <TableCell align="right" width={150}>{`$${price}`}</TableCell>
                                        <TableCell align="right" widht={120}>{canPost}</TableCell>
                                        <TableCell align="right" width={120}>{point}</TableCell>
                                        <TableCell align="right">
                                            <MoreMenu>
                                                <MoreMenuItem title="Delete" iconName="eva:trash-2-outline" handleClick={handleClickDelete} id={id} />
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
                
                                {isPackageNotFound && (
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
                            count={packages.length}
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
}

export default Package;