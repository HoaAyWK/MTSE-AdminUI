import React, { useEffect, useState } from 'react';
import { sentenceCase } from 'change-case';
import {
    Avatar,
    Box,
    Stack,
    Table,
    TableRow,
    TableBody,
    TableCell,
    Container,
    CircularProgress,
    Typography,
    TableContainer,
    TablePagination,
    Rating,
    Alert,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';

import Label from '../../components/Label';
import { action_status } from '../../app/constants';
import { MoreMenu } from '../../components/tables';
import MoreMenuItem from '../../components/tables/MoreMenuItem';
import { fDate } from '../../utils/formatTime';
import SimpleTableListHead from '../../components/tables/SimpleTableListHead';
import Iconify from '../../components/Iconify';
import { getCommentsByUser } from '../../app/slices/commentSlice';
import LetterAvatar from '../../components/LetterAvatar';

const TABLE_HEAD = [
    { id: 'user', label: 'User', alignRight: false },
    { id: 'content', label: 'Content', alignRight: false},
    { id: 'stars', label: 'Stars', alignRight: false },
    { id: '', label: '', alignRight: false }
];

const UserCommentsTable = (props) => {
    const [page, setPage] = useState(0);
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('id');
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const { userId } = props;
    const { comments, status } = useSelector((state) => state.comments);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getCommentsByUser(userId));
    }, [userId, dispatch]);

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
    } else if (status === action_status.SUCCEEDED) {
        const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - comments.length) : 0;

        return (
            <Container maxWidth='xl'>
                <Typography variant='h5' color='text.secondary' sx={{ marginBlockStart: 2 }}>
                    Ratings
                </Typography>
                {comments.length === 0 ? (                    
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
                        <Typography variant='body1' color='text.secondary'>This user do not have any ratings</Typography>
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
                                {comments.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                    const { id, creator, content, stars, createdAt } = row;
                
                                    return (
                                    <TableRow
                                        hover
                                        key={id}
                                        tabIndex={-1}
                                    >
                                        <TableCell align="left"> 
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center'
                                                }}
                                            >
                                                {creator?.avatar?.url ? (
                                                    <Avatar src={creator.avatar.url} alt={creator?.name} />
                                                ) : (
                                                    <LetterAvatar name={creator?.name} />
                                                )}
                                                <Stack spacing={0} sx={{ marginInlineStart: 1 }}>
                                                    <Typography variant='body1'>
                                                        {creator?.name}
                                                    </Typography>
                                                    <Typography variant='caption' color='text.secondary'>
                                                        {creator?.email}
                                                    </Typography>
                                                </Stack>
                                            </Box>
                                        </TableCell>
                                        <TableCell width={230} align="left">
                                            {content}
                                        </TableCell>
                                        <TableCell align="left">
                                            <Rating name="read-only" value={stars} readOnly />
                                        </TableCell>
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
                            count={comments.length}
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
}

export default UserCommentsTable;