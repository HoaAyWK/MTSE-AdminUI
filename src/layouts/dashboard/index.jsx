import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import { Box, CircularProgress } from '@mui/material';

import DashboardNavbar from './DashboardNavbar';
import DashboardSidebar from './DashboardSidebar';
import { getCurrentUser, logout } from '../../app/slices/authSlice';
import { action_status, MESSAGE_ERRORS, ROLES } from '../../app/constants';
import { useSnackbar } from 'notistack';
import useLocalStorage from '../../hooks/useLocalStorage';

// ----------------------------------------------------------------------

const APP_BAR_MOBILE = 64;
const APP_BAR_DESKTOP = 92;

const RootStyle = styled('div')({
    display: 'flex',
    minHeight: '100%',
    overflow: 'hidden'
});

const MainStyle = styled('div')(({ theme }) => ({
    flexGrow: 1,
    overflow: 'auto',
    minHeight: '100%',
    paddingTop: APP_BAR_MOBILE + 24,
    paddingBottom: theme.spacing(10),
    [theme.breakpoints.up('lg')]: {
        paddingTop: APP_BAR_DESKTOP + 24,
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2)
    }
}));

// ----------------------------------------------------------------------

export default function DashboardLayout() {
    const [open, setOpen] = useState(false);
    const { user: currentUser, getUserStatus, loginStatus } = useSelector((state) => state.auth);
    const [token,] = useLocalStorage('token', null);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        if (!token) {
            dispatch(logout());
            navigate('/login');
        }
    }, [token, dispatch, navigate]);

    useEffect(() => {
        if (loginStatus === action_status.SUCCEEDED) {
            if (!currentUser) {
                dispatch(getCurrentUser());
            } else {
                if (currentUser.role !== ROLES.ADMIN) {
                    enqueueSnackbar(MESSAGE_ERRORS.UNAUTHORIZE, { variant: 'error' });
                    navigate('/login');
                }
            }
        }
    }, [loginStatus, currentUser, navigate, dispatch, enqueueSnackbar]);

    return (
        getUserStatus === action_status.LOADING ? (
            <Box sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CircularProgress />
            </Box>
        )
        : (
            <RootStyle>
                <DashboardNavbar user={currentUser} onOpenSidebar={() => setOpen(true)} />
                <DashboardSidebar user={currentUser} isOpenSidebar={open} onCloseSidebar={() => setOpen(false)} />
                <MainStyle>
                    <Outlet />
                </MainStyle>
            </RootStyle>
        )
    );
}