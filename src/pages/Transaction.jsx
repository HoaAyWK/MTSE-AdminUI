import React, { useState, useEffect } from 'react';
import { filter } from 'lodash';
import {
    Avatar,
    Box,
    Card,
    Table,
    Stack,
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

import SearchNotFound from '../components/SearchNotFound';
import { SimpleTableListHead, SimpleTableListToolbar } from '../components/tables';
import LetterAvatar from '../components/LetterAvatar';
import Page from '../components/Page';
import { getTransactions, selectAllTransactions } from '../app/slices/transactionSlice';
import { action_status } from '../app/constants';
import Label from '../components/Label';
import { fDate } from '../utils/formatTime';
import { clearMessage } from '../app/slices/messageSlice';

const TABLE_HEAD = [
    { id: 'user', label: 'User', alignRight: false },
    { id: 'pkg', label: 'Package', alignRight: false },
    { id: 'price', label: 'Price', alignRight: true},
    { id: 'status', label: 'Status', alignRight: false},
    { id: 'createdAt', label: 'Created At', alignRight: false},
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
        return filter(array, (item) => item.user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
    }
    return stabilizedThis.map((el) => el[0]);
}

const Transaction = () => {
    const [page, setPage] = useState(0);

    const [order, setOrder] = useState('asc');

    const [orderBy, setOrderBy] = useState('createdAt');

    const [filterName, setFilterName] = useState('');

    const [rowsPerPage, setRowsPerPage] = useState(5);

    const dispatch = useDispatch();

    const transactions = useSelector(selectAllTransactions);

    const { status } = useSelector((state) => state.transactions);

    useEffect(() => {
        dispatch(clearMessage());
    }, [dispatch]);

    useEffect(() => {
        if (status === action_status.IDLE) {
            dispatch(getTransactions());
        }
    }, [dispatch, status]);

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
            <Page title='transactions'>
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
            <Page title='transactions'>
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
        const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - transactions.length) : 0;

        const filteredTransactions = applySortFilter(transactions, getComparator(order, orderBy), filterName);

        const isTransactionNotFound = filteredTransactions.length === 0;

        return (
            <Page title="Transactions">
                <Container maxWidth='xl'>
                    <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                        <Typography variant="h4" >
                            Transactions
                        </Typography>
                    </Stack>
                    <Card>
                        <SimpleTableListToolbar filterName={filterName} onFilterName={handleFilterByName} title='transactions'/>
                        <TableContainer sx={{ minWidth: 800 }}>
                            <Table>
                                <SimpleTableListHead
                                    order={order}
                                    orderBy={orderBy}
                                    headLabel={TABLE_HEAD}
                                    rowCount={transactions.length}
                                    onRequestSort={handleRequestSort}
                                />
                                <TableBody>
                                {filteredTransactions.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                    const { id, createdAt, user, price, package: pkg } = row;
                
                                    return (
                                    <TableRow
                                        hover
                                        key={id}
                                        tabIndex={-1}
                                    >
                                        <TableCell align="left" width={300}>
                                            <Box
                                                sx={{ display: 'flex', alignItems: 'center' }}
                                            >
                                                {user?.image ? (
                                                    <Avatar src={user?.image} alt={user?.email} />
                                                ) : (
                                                    <LetterAvatar name={user?.email} />
                                                )}
                                                <Box
                                                    sx={{ ml: 1, display: 'flex', flexDirection: 'column' }}
                                                >
                                                    <Typography
                                                        variant='body1'
                                                    >
                                                        {user?.email}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </TableCell>
                                        <TableCell align="left" width={300}>{pkg?.description}</TableCell>
                                        <TableCell align="right" width={100}>{`$${price}`}</TableCell>
                                        <TableCell align="left" width={80}>
                                            <Label variant="ghost" color={'success'}>
                                                Paid
                                            </Label>
                                        </TableCell>
                                        <TableCell align="left">{fDate(createdAt)}</TableCell>
                                    </TableRow>
                                    );
                                })}
                                {emptyRows > 0 && (
                                    <TableRow style={{ height: 53 * emptyRows }}>
                                        <TableCell colSpan={6} />
                                    </TableRow>
                                )}
                                </TableBody>
                
                                {isTransactionNotFound && (
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
                            count={transactions.length}
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

export default Transaction;