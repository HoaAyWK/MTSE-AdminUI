import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
    Table,
    Tooltip,
    TableRow,
    TableBody,
    TableCell,
    Container,
    Typography,
    TableContainer,
    TablePagination,
} from '@mui/material';

import Label from '../../components/Label';
import { MoreMenu } from '../../components/tables';
import MoreMenuLinkItem from '../../components/tables/MoreMenuLinkItem';
import { fDate } from '../../utils/formatTime';
import SimpleTableListHead from '../../components/tables/SimpleTableListHead';

const TABLE_HEAD = [
    { id: 'name', label: 'Name', alignRight: false },
    { id: 'status', label: 'Status', alignRight: false },
    { id: 'createdAt', label: 'Created At', alignRight: false },
    { id: '', label: '', alignRight: false }
];

const UserJobTable = (props) => {
    const { jobs } = props;

    const [page, setPage] = useState(0);

    const [order, setOrder] = useState('asc');

    const [orderBy, setOrderBy] = useState('name');

    const [rowsPerPage, setRowsPerPage] = useState(5);

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

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - jobs.length) : 0;

    return (
        <Container maxWidth='xl'>
            <Typography variant='h5' color='text.primary' sx={{ marginBlockStart: 2 }}>
                Job Posts
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
                            <TableCell align="left" width={350}>
                                {name.length > 40 ? (
                                    <Tooltip title={name}>
                                        <Typography variant='body2'>
                                            {`${name.slice(0, 40)}...`}
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
                                    color={status ? 'success' : 'error'}
                                >
                                    {status ? 'Open' : 'Closed'}
                                </Label>
                            </TableCell>
                            <TableCell align="left">{fDate(createdAt)}</TableCell>
                            <TableCell align="right">
                                <MoreMenu>
                                    <MoreMenuLinkItem to={`/dashboard/jobs/${id}`} iconName='eva:eye-outline' title='Details' />  
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
    
};

export default UserJobTable;