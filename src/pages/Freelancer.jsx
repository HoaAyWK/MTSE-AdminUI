import React, { useState, useEffect } from 'react';
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { Link as RouterLink } from 'react-router-dom';
import {
    Box,
    Card,
    Table,
    Stack,
    Avatar,
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
import SearchNotFound from '../components/SearchNotFound';
import { action_status } from '../app/constants';
import { SimpleTableListHead, SimpleTableListToolbar, MoreMenu } from '../components/tables';
import { clearMessage } from '../app/slices/messageSlice';
import MoreMenuItem from '../components/tables/MoreMenuItem';
import MoreMenuLinkItem from '../components/tables/MoreMenuLinkItem';
import { selectAllFreelancers, getFreelancers } from '../app/slices/freelancerSlice';
import LetterAvatar from '../components/LetterAvatar';

const TABLE_HEAD = [
    { id: 'name', label: 'Name', alignRight: false },
    { id: 'email', label: 'Email', alignRight: false},
    { id: 'phone', label: 'Phone', alignRight: false},
    { id: 'gender', label: 'Gender', alignRight: false },
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
        return filter(array, (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
    }
    return stabilizedThis.map((el) => el[0]);
}

const Freelancer = () => {
    const [page, setPage] = useState(0);

    const [order, setOrder] = useState('asc');

    const [orderBy, setOrderBy] = useState('name');

    const [filterName, setFilterName] = useState('');

    const [rowsPerPage, setRowsPerPage] = useState(5);

    const dispatch = useDispatch();

    const freelancers = useSelector(selectAllFreelancers);

    const { status } = useSelector((state) => state.freelancers);

    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        if (status === action_status.IDLE) {
            dispatch(getFreelancers());
        }

        dispatch(clearMessage());
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
            <Page title='freelancers'>
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
            <Page title='freelancers'>
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
        const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - freelancers.length) : 0;

        const filteredFreelancers = applySortFilter(freelancers, getComparator(order, orderBy), filterName);

        const isFreelancerNotFound = filteredFreelancers.length === 0;

        return (
            <Page title="freelancers">
                <Container maxWidth='xl'>
                    <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                        <Typography variant="h4" >
                            Freelancers
                        </Typography>
                    </Stack>
            
                    <Card>
                        <SimpleTableListToolbar filterName={filterName} onFilterName={handleFilterByName} title='freelancer'/>
                        <TableContainer sx={{ minWidth: 800 }}>
                            <Table>
                                <SimpleTableListHead
                                    order={order}
                                    orderBy={orderBy}
                                    headLabel={TABLE_HEAD}
                                    rowCount={freelancers.length}
                                    onRequestSort={handleRequestSort}
                                />
                                <TableBody>
                                {filteredFreelancers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                    const { id, firstName, lastName, user, gender } = row;
                
                                    return (
                                    <TableRow
                                        hover
                                        key={id}
                                        tabIndex={-1}
                                    >
                                        <TableCell align="left" width={300}>
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center'
                                                }}
                                            >
                                                {user?.image ? (
                                                    <Avatar src={user?.image} alt={`${firstName} ${lastName}`} />
                                                ) : (
                                                    <LetterAvatar name={`${firstName} ${lastName}`} />
                                                )}
                                                <Typography
                                                    variant='body1'
                                                    sx={{
                                                        marginInlineStart: 1
                                                    }}
                                                >   
                                                    {`${firstName} ${lastName}`}
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell align="left" width={350}>{user?.email}</TableCell>
                                        <TableCell align="left">{user?.phone}</TableCell>
                                        <TableCell align="left">
                                            {gender}
                                        </TableCell>
                                        <TableCell align="right">
                                            <MoreMenu>
                                                <MoreMenuLinkItem to={`/dashboard/freelancers/${id}`} iconName='eva:eye-outline' title='Details' />
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
                
                                {isFreelancerNotFound && (
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
                            count={freelancers.length}
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

export default Freelancer;