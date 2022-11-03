import React, { useEffect, useState } from 'react';
import { filter } from 'lodash';
import { Link as RouterLink } from 'react-router-dom';
import { sentenceCase } from 'change-case';
import {
    Box,
    Table,
    Tooltip,
    TableRow,
    TableBody,
    TableCell,
    Container,
    CircularProgress,
    Typography,
    TableContainer,
    TablePagination,
    Alert,
    Divider,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';

import Label from '../../components/Label';
import { action_status } from '../../app/constants';
import { MoreMenu } from '../../components/tables';
import MoreMenuItem from '../../components/tables/MoreMenuItem';
import { getJobs } from './jobSlice';
import { fDate } from '../../utils/formatTime';
import { selectJobsByUser } from './jobSlice';
import SimpleTableListHead from '../../components/tables/SimpleTableListHead';

const TABLE_HEAD = [
    { id: 'name', label: 'Name', alignRight: false },
    { id: 'status', label: 'Status', alignRight: false },
    { id: 'createdAt', label: 'Created At', alignRight: false },
    { id: '', label: '', alignRight: false }
];

const UserJobTable = (props) => {
    const { userId } = props;

    const [page, setPage] = useState(0);

    const [order, setOrder] = useState('asc');

    const [orderBy, setOrderBy] = useState('name');

    const [rowsPerPage, setRowsPerPage] = useState(5);

    const dispatch = useDispatch();

    const jobs = useSelector((state) => selectJobsByUser(state, userId));

    const { status } = useSelector((state) => state.jobs);

    useEffect(() => {
        if (status === action_status.IDLE) {
            dispatch(getJobs());
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
        const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - jobs.length) : 0;

        return (
            <Container maxWidth='xl'>
                <Typography variant='h5' color='text.secondary' sx={{ marginBlockStart: 2 }}>
                    User's Jobs
                </Typography>
                <TableContainer sx={{ minWidth: 500, marginBlockStart: 2 }}>
                    <Table>
                        <SimpleTableListHead
                            order={order}
                            orderBy={orderBy}
                            headLabel={TABLE_HEAD}
                            onRequestSort={handleRequestSort}
                        />
                        <TableBody>
                        {jobs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                            const { id, name, status, createdAt } = row;
        
                            return (
                            <TableRow
                                hover
                                key={id}
                                tabIndex={-1}
                            >
                                <TableCell align="left">
                                    {name.length > 20 ? (
                                        <Tooltip title={name}>
                                            <Typography variant='body2'>
                                                {`${name.slice(0, 20)}...`}
                                            </Typography>
                                        </Tooltip>
                                        ) : (
                                            <Typography
                                                component={RouterLink}
                                                to={`/dashboard/jobs/${id}`}
                                                variant='body2'
                                                color='text.primary'
                                                sx={{
                                                    textDecoration: 'none',
                                                    '&:hover': {
                                                        textDecoration: 'underline'
                                                    }
                                                }}
                                            >
                                                {name}
                                            </Typography>
                                        )      
                                    }
                                </TableCell>
                                <TableCell align="left">
                                    <Label
                                        variant="ghost"
                                        color={(status === 'Open' && 'success') ||
                                            (status === 'SelectedFreelancer' && 'warning') ||
                                            (status === 'PendingStart' && 'warning') ||
                                            (status === 'Processing' && 'info') ||
                                            (status === 'Closed' && 'secondary') || 'error'}
                                    >
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
                    count={jobs.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Container>
        );
    }
};

export default UserJobTable;