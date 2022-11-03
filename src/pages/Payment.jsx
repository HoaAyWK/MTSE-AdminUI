import React, { useState, useEffect } from 'react';
import { filter } from 'lodash';
import { Link as RouterLink } from 'react-router-dom';
import {
    Box,
    Card,
    Table,
    Stack,
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
    Avatar,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { sentenceCase } from 'change-case';

import Page from '../components/Page';
import Label from '../components/Label';
import SearchNotFound from '../components/SearchNotFound';
import { action_status } from '../app/constants';
import { TableListHead, TableListToolbar, MoreMenu } from '../components/tables';
import { clearMessage } from '../features/message/messageSlice';
import MoreMenuItem from '../components/tables/MoreMenuItem';
import { getPayments, selectAllPayments } from '../features/payments/paymentSlice';
import { fDateTimeSuffix } from '../utils/formatTime';
import LetterAvatar from '../components/LetterAvatar';

const TABLE_HEAD = [
    { id: 'user', label: 'User', alignRight: false },
    { id: 'amount', label: 'Amount', alignRight: true},
    { id: 'status', label: 'Status', alignRight: false },
    { id: 'paymentIntent', label: 'Payment Intent', alignRight: false },
    { id: 'create', label: 'Create', alignRight: false},
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
        return filter(array, (_payment) => _payment.user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
    }
    return stabilizedThis.map((el) => el[0]);
}

const Payment = () => {
    const [page, setPage] = useState(0);

    const [order, setOrder] = useState('asc');

    const [selected, setSelected] = useState([]);

    const [orderBy, setOrderBy] = useState('create');

    const [filterName, setFilterName] = useState('');

    const [rowsPerPage, setRowsPerPage] = useState(5);

    const dispatch = useDispatch();

    const payments = useSelector(selectAllPayments);

    const { status } = useSelector((state) => state.payments);

    useEffect(() => {
        if (status === action_status.IDLE) {
            dispatch(getPayments());
        }
    }, [status, dispatch]);

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
            setOrder(isAsc ? 'desc' : 'asc');
            setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = payments.map((n) => n.user.name);
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
            <Page title='Payments'>
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
            <Page title='Payments'>
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
        const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - payments.length) : 0;

        const filteredPayments = applySortFilter(payments, getComparator(order, orderBy), filterName);

        const isPaymentNotFound = filteredPayments.length === 0;

        return (
            <Page title="Payments">
                <Container maxWidth='xl'>
                    <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                        <Typography variant="h4" >
                            Payments
                        </Typography>
                    </Stack>
                    <Card>
                        <TableListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} title='payments'/>
                        <TableContainer sx={{ minWidth: 800 }}>
                            <Table>
                                <TableListHead
                                    order={order}
                                    orderBy={orderBy}
                                    headLabel={TABLE_HEAD}
                                    rowCount={payments.length}
                                    numSelected={selected.length}
                                    onRequestSort={handleRequestSort}
                                    onSelectAllClick={handleSelectAllClick}
                                />
                                <TableBody>
                                {filteredPayments.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                    const { id, createdAt, user, status, credit, paymentIntent } = row;
                                    const isItemSelected = selected.indexOf(user.name) !== -1;
                
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
                                            <Checkbox checked={isItemSelected} onChange={(event) => handleClick(event, user.name)} />
                                        </TableCell>
                                        <TableCell align="left" width={350}>
                                            <Box
                                                sx={{ display: 'flex', alignItems: 'center' }}
                                            >
                                                {user?.avatar?.url ? (
                                                    <Avatar src={user.avatar.url} alt={user?.name} />
                                                ) : (
                                                    <LetterAvatar name={user?.name} />
                                                )}
                                                <Box
                                                    sx={{ ml: 1, display: 'flex', flexDirection: 'column' }}
                                                >
                                                    <Typography
                                                        component={RouterLink}
                                                        to={`/dashboard/users/${user?.id}`} 
                                                        color='text.primary'
                                                        sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' }}}
                                                        variant='body1'
                                                    >
                                                        {user?.name}
                                                    </Typography>
                                                    <Typography
                                                        color='text.secondary'
                                                        variant='caption'
                                                    >
                                                        {user?.email}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </TableCell>
                                        <TableCell align="right" width={100}>{`$${credit?.price}`}</TableCell>
                                        <TableCell align="left" width={80}>
                                            <Label variant="ghost" color={(status === 'pending' && 'warning') || 'success'}>
                                                {sentenceCase(status)}
                                            </Label>
                                        </TableCell>
                                        <TableCell align="left" width={230}>{paymentIntent}</TableCell>
                                        <TableCell align="left">{fDateTimeSuffix(createdAt)}</TableCell>
                                        <TableCell align="right">
                                            <MoreMenu>
                                                <MoreMenuItem title="Delete" iconName="eva:trash-2-outline" id={id} />
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
                
                                {isPaymentNotFound && (
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
                            count={payments.length}
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

export default Payment;