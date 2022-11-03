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
import Label from '../components/Label';
import SearchNotFound from '../components/SearchNotFound';
import { action_status } from '../app/constants';
import { TableListHead, TableListToolbar, MoreMenu } from '../components/tables';
import { clearMessage } from '../features/message/messageSlice';
import MoreMenuItem from '../components/tables/MoreMenuItem';
import { selectAllUsers, getAllUsers, banUser, refresh } from '../features/users/userSlice';
import LetterAvatar from '../components/LetterAvatar';

const TABLE_HEAD = [
    { id: 'name', label: 'Name', alignRight: false },
    { id: 'email', label: 'Email', alignRight: false},
    { id: 'gender', label: 'Gender', alignRight: false },
    { id: 'status', label: 'Status', alignRight: false },
    { id: 'roles', label: 'Roles', alignRight: false },
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

const User = () => {
    const [page, setPage] = useState(0);

    const [order, setOrder] = useState('asc');

    const [selected, setSelected] = useState([]);

    const [orderBy, setOrderBy] = useState('name');

    const [filterName, setFilterName] = useState('');

    const [rowsPerPage, setRowsPerPage] = useState(5);

    const dispatch = useDispatch();

    const users = useSelector(selectAllUsers);

    const { banned } = useSelector((state) => state.users);

    const { status } = useSelector((state) => state.users);

    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        if (status === action_status.IDLE) {
            dispatch(getAllUsers());
        }

        dispatch(clearMessage());
        dispatch(refresh());
    }, [dispatch, status]);

    useEffect(() => {
        if (banned) {
            dispatch(getAllUsers());
            enqueueSnackbar("Banned successfully", { variant: 'success' });
            dispatch(refresh());
        }
    }, [banned, dispatch, enqueueSnackbar])

    const handleBanClick = (userId) => {
        dispatch(banUser(userId));
    }

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
            setOrder(isAsc ? 'desc' : 'asc');
            setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = users.map((n) => n.name);
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
            <Page title='Users'>
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
            <Page title='Users'>
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
        const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - users.length) : 0;

        const filteredUsers = applySortFilter(users, getComparator(order, orderBy), filterName);

        const isUserNotFound = filteredUsers.length === 0;

        return (
            <Page title="Users">
                <Container maxWidth='xl'>
                    <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                        <Typography variant="h4" >
                            Users
                        </Typography>
                    </Stack>
            
                    <Card>
                        <TableListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} title='user'/>
                        <TableContainer sx={{ minWidth: 800 }}>
                            <Table>
                                <TableListHead
                                    order={order}
                                    orderBy={orderBy}
                                    headLabel={TABLE_HEAD}
                                    rowCount={users.length}
                                    numSelected={selected.length}
                                    onRequestSort={handleRequestSort}
                                    onSelectAllClick={handleSelectAllClick}
                                />
                                <TableBody>
                                {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                    const { id, name, email, avatar, gender, status, roles } = row;
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
                                        <TableCell align="left" width={300}>
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center'
                                                }}
                                            >
                                                {avatar?.url ? (
                                                    <Avatar src={avatar?.url} alt={name} />
                                                ) : (
                                                    <LetterAvatar name={name} />
                                                )}
                                                <Typography
                                                    component={RouterLink}
                                                    to={`/dashboard/users/${id}`}
                                                    variant='body1'
                                                    color='text.primary'
                                                    sx={{
                                                        textDecoration: 'none',
                                                        '&:hover': {
                                                            textDecoration: 'underline'
                                                        },
                                                        marginInlineStart: 1
                                                    }}
                                                >   
                                                    {name}
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell align="left" width={350}>{email}</TableCell>
                                        <TableCell align="left">{gender}</TableCell>
                                        <TableCell align="left">
                                            <Label variant="ghost" color={(status === 'Banned' && 'error') || 'success'}>
                                                {sentenceCase(status)}
                                            </Label>
                                        </TableCell>
                                        <TableCell align="left">
                                            <Stack spacing={1} maxWidth='80px'>
                                                {roles.map((role) => (
                                                    <Label 
                                                        key={role}
                                                        variant='ghost'
                                                        color={(role === 'freelancer' && 'warning') || (role === 'admin' && 'secondary' ) || 'info'}
                                                    >
                                                        {sentenceCase(role)}
                                                    </Label>
                                                ))}
                                            </Stack>
                                        </TableCell>
                                        <TableCell align="right">
                                            <MoreMenu>
                                                <MoreMenuItem title="Ban" iconName="eva:person-remove-outline" handleClick={handleBanClick} id={id}/>
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
                
                                {isUserNotFound && (
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
                            count={users.length}
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

export default User;