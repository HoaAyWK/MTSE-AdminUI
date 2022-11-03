import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Avatar, Box, Button, Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { getPayments, selectPaymentsByNumber } from './paymentSlice';
import { useDispatch, useSelector } from 'react-redux';
import { sentenceCase } from 'change-case';

import { action_status } from '../../app/constants';
import LetterAvatar from '../../components/LetterAvatar';
import Label from '../../components/Label';
import { fDate } from '../../utils/formatTime';
import SimpleTableListHead from '../../components/tables/SimpleTableListHead';
import MainCard from '../../components/MainCard';

const TABLE_HEAD = [
    { id: 'user', label: 'User', alignRight: false },
    { id: 'points', label: 'Point Name', alignRight: false },
    { id: 'status', label: 'Status', alignRight: false },
    { id: 'price', label: 'Price', alignRight: false},
    { id: 'paymentIntent', label: 'Payment Intent', alignRight: false},
    { id: 'createdAt', label: 'Created At', alignRight: false},
];


const RecentPaymentsTable = () => {
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('createdAt');
    const payments = useSelector((state) => selectPaymentsByNumber(state, 5));
    const { status } = useSelector((state) => state.payments);
    const dispatch = useDispatch();

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

    return (
        <>
            {status === action_status.SUCCEEDED ? (
                <MainCard>
                    <TableContainer sx={{ minWidth: 500 }}>
                        <Table>
                            <SimpleTableListHead
                                order={order}
                                orderBy={orderBy}
                                headLabel={TABLE_HEAD}
                                onRequestSort={handleRequestSort}
                            />
                            <TableBody>
                            {payments.map((row) => {
                                const { id, credit, user, status, createdAt, paymentIntent } = row;
            
                                return (
                                <TableRow
                                    hover
                                    key={id}
                                    tabIndex={-1}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell align="left">
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            {user?.avatar?.url ? (
                                                <Avatar src={user.avatar.url} alt={user?.name} />
                                            ) : (
                                                <LetterAvatar name={user?.name} />
                                            )}
                                            <Typography
                                                variant='body1'
                                                sx={{ 
                                                    marginInlineStart: 1,
                                                    textDecoration: 'none',
                                                    '&:hover': {
                                                        textDecoration: 'underline'
                                                    }
                                                }}
                                                component={RouterLink}
                                                to={`/dashboard/users/${user?.id}`}
                                                color='text.primary'

                                            >
                                                {user?.name}
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell align="left"> 
                                        {credit?.name}
                                    </TableCell>
                                    <TableCell align="left">
                                        <Label variant="ghost" color={(status === 'pending' && 'warning') || 'success'}>
                                            {sentenceCase(status)}
                                        </Label>
                                    </TableCell>
                                    <TableCell align="right">
                                        {`$${credit?.price}`}
                                    </TableCell>
                                    <TableCell align="left">
                                        {paymentIntent}
                                    </TableCell>
                                    <TableCell align="left">{fDate(createdAt)}</TableCell>
                                </TableRow>
                                );
                            })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Button component={RouterLink} to='/dashboard/payments' variant='outlined' size='small'>
                            View All
                        </Button>
                    </Box>
                </MainCard>
            ) : (
                <div></div>
            )}
        </>
    );
};

export default RecentPaymentsTable;