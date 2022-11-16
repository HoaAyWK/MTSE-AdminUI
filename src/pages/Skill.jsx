import React, { useState, useEffect } from 'react';
import { filter } from 'lodash';
import {
    Box,
    Card,
    Table,
    Stack,
    Button,
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
import { styled } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';

import Page from '../components/Page';
import Iconify from '../components/Iconify';
import SearchNotFound from '../components/SearchNotFound';
import { createSkill, deleteSkill, getSkills, refresh, selectAllSkills, updateSkill } from '../app/slices/skillSlice';
import { action_status } from '../app/constants';
import { SimpleTableListHead, SimpleTableListToolbar, MoreMenu } from '../components/tables';
import { fDateTimeSuffix } from '../utils/formatTime';
import { clearMessage } from '../app/slices/messageSlice';
import MoreMenuItem from '../components/tables/MoreMenuItem';
import AlertDialog from '../components/AlertDialog';
import SkillFormDialog from '../features/skill/SkillFormDialog';

const ButtonStyle = styled(Button)(({ theme }) => ({
    backgroundColor: theme.palette.success.dark,
    '&:hover': {
        backgroundColor: theme.palette.success.main,
    },
    color: '#fff'
}));

const TABLE_HEAD = [
    { id: 'name', label: 'Name', alignRight: false },
    { id: 'createdAt', label: 'Created At', alignRight: false },
    { id: 'updatedAt', label: 'Updated At', alignRight: false },
    { id: '', label: '', alignRight: false },
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
        return filter(array, (item) => item.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
    }
    return stabilizedThis.map((el) => el[0]);
}

const Skill = () => {
    const [page, setPage] = useState(0);

    const [order, setOrder] = useState('asc');

    const [orderBy, setOrderBy] = useState('name');

    const [filterName, setFilterName] = useState('');

    const [rowsPerPage, setRowsPerPage] = useState(5);

    const [open, setOpen] = useState(false);

    const [openCreateFormDialog, setOpenCreateFormDialog] = useState(false);

    const [openUpdateFormDialog, setOpenUpdateFormDialog] = useState(false);

    const dispatch = useDispatch();

    const skills = useSelector(selectAllSkills);

    const { isAdded, isDeleted, isUpdated } = useSelector((state) => state.skills);

    const { message } = useSelector((state) => state.message);

    const { enqueueSnackbar } = useSnackbar();

    const { status } = useSelector((state) => state.skills);

    useEffect(() => {
        if (isAdded) {
            enqueueSnackbar('Created successfully', { variant: 'success' });
            dispatch(refresh());
        }
    }, [isAdded, enqueueSnackbar, dispatch]);

    useEffect(() => {
        if (status === action_status.IDLE) {
            dispatch(getSkills());
        }
        dispatch(clearMessage());
        dispatch(refresh());
    }, [dispatch, status]);

    useEffect(() => {
        if (isUpdated) {
            enqueueSnackbar("Updated successfully", { variant: 'success' });
            dispatch(getSkills());
            dispatch(refresh());
        }
    }, [isUpdated, enqueueSnackbar, dispatch]);

    useEffect(() => {
        if (isDeleted) {
            enqueueSnackbar("Deleted successfully", { variant: 'success' });
            dispatch(refresh());
        }
    }, [isDeleted, enqueueSnackbar, dispatch]);

    useEffect(() => {
        if (message) {
            enqueueSnackbar(message, { variant: 'error' });
            dispatch(clearMessage());
        }
    }, [message, dispatch, enqueueSnackbar]);

    const handleClickOpenCreateFormDialog = () => {
        setOpenCreateFormDialog(true);
    };

    const handleClickCloseCreateFormDialog = () => {
        setOpenCreateFormDialog(false);
    };

    const handleClickOpenUpdateFormDialog = () => {
        setOpenUpdateFormDialog(true);
    };

    const handleClickCloseUpdateFormDialog = () => {
        setOpenUpdateFormDialog(false);
    };

    const handleDeleteClick = () => {
        setOpen(true);
    };

    const handleDelete = (SkillId) => {
        dispatch(deleteSkill(SkillId));
    };

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

    const handleClose = () => {
        setOpen(false);
    };

    if (status === action_status.LOADING) {
        return (
            <Page title='Skill'>
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
            <Page title='Skill'>
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
        const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - skills.length) : 0;

        const filteredSkills = applySortFilter(skills, getComparator(order, orderBy), filterName);

        const isSkillNotFound = filteredSkills.length === 0;

        return (
            <Page title="Skill">
                <Container maxWidth='xl'>
                    <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                        <Typography variant="h4" >
                            Skill
                        </Typography>
                        <ButtonStyle variant="contained" onClick={handleClickOpenCreateFormDialog} startIcon={<Iconify icon="eva:plus-fill" style={{ color: 'white' }}/>} >
                            New Skill
                        </ButtonStyle>
                    </Stack>
                    <SkillFormDialog
                        open={openCreateFormDialog}
                        handleClose={handleClickCloseCreateFormDialog}
                        dialogTitle='Create Skill'
                        dialogContent='Create a new skill'
                        skillAction={createSkill}
                    />
                    <Card>
                        <SimpleTableListToolbar filterName={filterName} onFilterName={handleFilterByName} title='skill'/>
                        <TableContainer sx={{ minWidth: 800 }}>
                            <Table>
                                <SimpleTableListHead
                                    order={order}
                                    orderBy={orderBy}
                                    headLabel={TABLE_HEAD}
                                    rowCount={skills.length}
                                    onRequestSort={handleRequestSort}
                                />
                                <TableBody>
                                {filteredSkills.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                    const { id, name, createdAt, updatedAt } = row;
                
                                    return (
                                    <TableRow
                                        hover
                                        key={id}
                                        tabIndex={-1}
                                    >
                                        <TableCell align="left" width={450}>{name}</TableCell>
                                        <TableCell align="left">{fDateTimeSuffix(createdAt)}</TableCell>
                                        <TableCell align="left" width={350}>{fDateTimeSuffix(updatedAt)}</TableCell>
                                        <TableCell align="right">
                                            <MoreMenu>
                                                <MoreMenuItem title="Edit" iconName="eva:edit-fill" handleClick={handleClickOpenUpdateFormDialog} />
                                                <MoreMenuItem title="Delete" iconName="eva:trash-2-outline" handleClick={handleDeleteClick} id={id} />
                                                <AlertDialog
                                                    itemId={id}
                                                    open={open}
                                                    handleClose={handleClose}
                                                    title='Delete Skill'
                                                    content='Are you sure to delete this skill'
                                                    handleConfirm={handleDelete}
                                                    color='error'
                                                />
                                                <SkillFormDialog
                                                    open={openUpdateFormDialog}
                                                    handleClose={handleClickCloseUpdateFormDialog}
                                                    dialogTitle='Edit Skill'
                                                    dialogContent='Update skill'
                                                    skill={row}
                                                    skillAction={updateSkill}
                                                />
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
                
                                {isSkillNotFound && (
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
                            count={skills.length}
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

export default Skill;