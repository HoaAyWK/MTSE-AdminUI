import React, { useState, useRef } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { alpha } from '@mui/material/styles';
import { Box, Divider, Typography, Stack, MenuItem, Avatar, IconButton } from '@mui/material';
import { useDispatch } from 'react-redux';

import MenuPopover from '../../components/MenuPopover';
import { logout } from '../../features/auth/authSlice';

const MENU_OPTIONS = [
    {
      label: 'Profile',
      icon: 'eva:person-fill',
      linkTo: '/dashboard/users/profile',
    },
    {
      label: 'Settings',
      icon: 'eva:settings-2-fill',
      linkTo: '/dashboard/users/account',
    },
];

const AccountPopover = ({ user }) => {
    const anchorRef = useRef(null);
    const [open, setOpen] = useState(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleOpen = (event) => {
        setOpen(event.currentTarget);
    };

    const handleClose = () => {
        setOpen(null);
    };

    const handleLogout = () => {
        dispatch(logout());
        setOpen(null);
        navigate('/login');
    };

    return (
        <>
            <IconButton
                ref={anchorRef}
                onClick={handleOpen}
                sx={{
                p: 0,
                ...(open && {
                    '&:before': {
                        zIndex: 1,
                        content: "''",
                        width: '100%',
                        height: '100%',
                        borderRadius: '50%',
                        position: 'absolute',
                        bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
                    },
                }),
                }}
            >
                {user?.avatar?.url ? 
                    (<Avatar src={user?.avatar?.url} alt="photoURL" />)
                    :
                    (<Avatar />)}
                
            </IconButton>

            <MenuPopover
                open={Boolean(open)}
                anchorEl={open}
                onClose={handleClose}
                sx={{
                p: 0,
                mt: 1.5,
                ml: 0.75,
                '& .MuiMenuItem-root': {
                    typography: 'body2',
                    borderRadius: 0.75,
                },
                }}
            >
                <Box sx={{ my: 1.5, px: 2.5 }}>
                <Typography variant="subtitle2" noWrap>
                    {user?.name}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                    {user?.email}
                </Typography>
                </Box>

                <Divider sx={{ borderStyle: 'dashed' }} />

                <Stack sx={{ p: 1 }}>
                {MENU_OPTIONS.map((option) => (
                    <MenuItem key={option.label} to={option.linkTo} component={RouterLink} onClick={handleClose}>
                        {option.label}
                    </MenuItem>
                ))}
                </Stack>

                <Divider sx={{ borderStyle: 'dashed' }} />

                <MenuItem onClick={handleLogout} sx={{ m: 1 }}>
                    Logout
                </MenuItem>
            </MenuPopover>
        </>
    );
};

export default AccountPopover;