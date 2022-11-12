import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';

import DashboardNavbar from './DashboardNavbar';
import DashboardSidebar from './DashboardSidebar';
import { getCurrentUser } from '../../app/slices/authSlice';
import useLocalStorage from '../../hooks/useLocalStorage.js';

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
    const [user, setUser] = useLocalStorage('user', null);
    const { user: currentUser } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    useEffect(() => {
        if (!user) {
            dispatch(getCurrentUser());
        }
    }, [user])

    useEffect(() => {
        if (!currentUser) {
            dispatch(getCurrentUser());
        }
    }, [currentUser])

    return (
        <RootStyle>
            <DashboardNavbar user={currentUser} onOpenSidebar={() => setOpen(true)} />
            <DashboardSidebar user={currentUser} isOpenSidebar={open} onCloseSidebar={() => setOpen(false)} />
            <MainStyle>
                <Outlet />
            </MainStyle>
        </RootStyle>
    );
}