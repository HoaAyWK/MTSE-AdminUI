import React, { useEffect, useState } from 'react';
import { sentenceCase } from 'change-case';
import {
    Box,
    Table,
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

import Label from '../../components/Label';
import { action_status } from '../../app/constants';
import { MoreMenu } from '../../components/tables';
import MoreMenuItem from '../../components/tables/MoreMenuItem';
import { fDate } from '../../utils/formatTime';
import { getPayments, selectPaymentsByUser } from './paymentSlice'
import SimpleTableListHead from '../../components/tables/SimpleTableListHead';
import Iconify from '../../components/Iconify';

const TABLE_HEAD = [
    { id: 'creditName', label: 'Product Name', alignRight: false },
    { id: 'amount', label: 'Amount', alignRight: false},
    { id: 'status', label: 'Status', alignRight: false },
    { id: 'create', label: 'Create', alignRight: false},
    { id: '', label: '', alignRight: false},
];

const UserPaymentTable = (props) => {
    const { userId } = props;

    const [page, setPage] = useState(0);

    const [order, setOrder] = useState('asc');

    const [orderBy, setOrderBy] = useState('id');

    const [rowsPerPage, setRowsPerPage] = useState(5);

    const dispatch = useDispatch();

    const payments = useSelector((state) => selectPaymentsByUser(state, userId));

    const { status } = useSelector((state) => state.payments);

    useEffect(() => {
        if (status === action_status.IDLE) {
            dispatch(getPayments());
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


    if (status === action_status.LOADING) {
        return (
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
        )
    } else if (status === action_status.FAILED) {
        <Container>
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
    } else if (status === action_status.SUCCEEDED) {
        const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - payments.length) : 0;

        return (
            <Container maxWidth='xl'>
                <Typography variant='h5' color='text.secondary' sx={{ marginBlockStart: 2 }}>
                    User's Payments
                </Typography>
                {payments.length === 0 ? (                    
                    <Box 
                        sx={{
                            height: '200',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexDirection: 'column'
                        }}
                    >
                        <Iconify icon='iconoir:multiple-pages-empty' width={100} height={100} style={{ color: '#c4cdd5' }} />
                        <Typography variant='body1' color='text.secondary'>This user do not have any payments</Typography>
                    </Box>
                ) : (
                    <>
                        <TableContainer sx={{ minWidth: 500, marginBlockStart: 2 }}>
                            <Table>
                                <SimpleTableListHead
                                    order={order}
                                    orderBy={orderBy}
                                    headLabel={TABLE_HEAD}
                                    onRequestSort={handleRequestSort}
                                />
                                <TableBody>
                                {payments.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                    const { id, credit, status, createdAt } = row;
                
                                    return (
                                    <TableRow
                                        hover
                                        key={id}
                                        tabIndex={-1}
                                    >
                                        <TableCell align="left"> 
                                            <Typography
                                                variant='body2'
                                                color='text.primary'
                                            >
                                                {credit?.name}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="right">
                                            {`$${credit?.price}`}
                                        </TableCell>
                                        <TableCell align="left">
                                                <Label variant="ghost" color={(status === 'pending' && 'warning') || 'success'}>
                                                    {sentenceCase(status)}
                                                </Label>
                                            </TableCell>
                                        <TableCell align="left">{fDate(createdAt)}</TableCell>
                                        <TableCell align="right">
                                            <MoreMenu>
                                                <MoreMenuItem title="Ban" iconName="eva:person-remove-outline" id={id}/>
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
                    </>
                )}
            </Container>
        );
    }
};

export default UserPaymentTable;