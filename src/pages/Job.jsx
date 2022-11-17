import React, { useState, useEffect } from 'react';
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { Link as RouterLink } from 'react-router-dom';
import {
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
    Avatar,
    Tooltip,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';

import Page from '../components/Page';
import Label from '../components/Label';
import SearchNotFound from '../components/SearchNotFound';
import { action_status } from '../app/constants';
import { SimpleTableListHead, SimpleTableListToolbar, MoreMenu } from '../components/tables';
import MoreMenuItem from '../components/tables/MoreMenuItem';
import { getJobs, selectAllJobs } from '../app/slices/jobSlice';
import { fDate } from '../utils/formatTime';
import LetterAvatar from '../components/LetterAvatar';
import MoreMenuLinkItem from '../components/tables/MoreMenuLinkItem';

const TABLE_HEAD = [
    { id: 'name', label: 'Name', alignRight: false },
    { id: 'price', label: 'Price', alignRight: false },
    { id: 'status', label: 'Status', alignRight: false },
    { id: 'startDate', label: 'Start Date', alignRight: false},
    { id: 'expireDate', label: 'Expire Date', alignRight: false },
    { id: 'createdAt', label: 'Created At', alignRight: false },
    { id: '', label: '', alignRight: false }
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
        return filter(array, (_job) => _job.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
    }
    return stabilizedThis.map((el) => el[0]);
}

const Job = () => {
    const [page, setPage] = useState(0);

    const [order, setOrder] = useState('asc');

    const [orderBy, setOrderBy] = useState('name');

    const [filterName, setFilterName] = useState('');

    const [rowsPerPage, setRowsPerPage] = useState(5);

    const dispatch = useDispatch();

    const jobs = useSelector(selectAllJobs);

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

    const handleFilterByName = (event) => {
        setFilterName(event.target.value);
    };

    if (status === action_status.LOADING) {
        return (
            <Page title='jobs'>
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
            <Page title='jobs'>
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
            </Page>
        )
    } else if (status === action_status.SUCCEEDED) {
        const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - jobs.length) : 0;

        const filteredJobs = applySortFilter(jobs, getComparator(order, orderBy), filterName);

        const isJobNotFound = filteredJobs.length === 0;

        return (
            <Page title="Jobs">
                <Container maxWidth='xl'>
                    <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                        <Typography variant="h4" >
                            Jobs
                        </Typography>
                    </Stack>
            
                    <Card>
                        <SimpleTableListToolbar filterName={filterName} onFilterName={handleFilterByName} title='job'/>
                        <TableContainer sx={{ minWidth: 800 }}>
                            <Table>
                                <SimpleTableListHead
                                    order={order}
                                    orderBy={orderBy}
                                    headLabel={TABLE_HEAD}
                                    rowCount={jobs.length}
                                    onRequestSort={handleRequestSort}
                                />
                                <TableBody>
                                {filteredJobs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                    const { id, name, price, status, startDate, expireDate, createdAt } = row;
                
                                    return (
                                    <TableRow
                                        hover
                                        key={id}
                                        tabIndex={-1}
                                    >
                                        <TableCell align="left" width={400}>
                                            {name.length > 50 ? (
                                                <Tooltip title={name}>
                                                    <Typography variant='body2'>
                                                        {`${name.slice(0, 50)}...`}
                                                    </Typography>
                                                </Tooltip>
                                                ) : (name)      
                                            }
                                        </TableCell>
                                        <TableCell align="left" width={100}>{`$${price}`}</TableCell>
                                        <TableCell align="left">
                                            <Label
                                                variant="ghost"
                                                color={status ? 'success' : 'error'}
                                            >
                                                {status ? 'Open' : 'Closed'}
                                            </Label>
                                        </TableCell>
                                        <TableCell align="left">{fDate(startDate)}</TableCell>
                                        <TableCell align="left">{fDate(expireDate)}</TableCell>
                                        <TableCell align="left">{fDate(createdAt)}</TableCell>
                                        <TableCell align="right">
                                            <MoreMenu>
                                                <MoreMenuLinkItem to={`/dashboard/jobs/${id}`} iconName='eva:eye-outline' title='Details' />
                                            </MoreMenu>
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
                
                                {isJobNotFound && (
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
                            count={jobs.length}
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

export default Job;