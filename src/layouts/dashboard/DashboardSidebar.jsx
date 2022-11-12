import React, { useEffect } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Box, Link, Drawer, Typography, Avatar, Stack } from '@mui/material';

import useResponsive from '../../hooks/useResponsive';
import Logo from '../../components/Logo';
import Scrollbar from '../../components/Scrollbar';
import NavSection from '../../components/NavSection';
import navConfig from './NavConfig';
import LetterAvatar from '../../components/LetterAvatar';

const DRAWER_WIDTH = 280;

const RootStyle = styled('div')(({ theme }) => ({
    [theme.breakpoints.up('lg')]: {
        flexShrink: 0,
        width: DRAWER_WIDTH,
    },
}));

const AccountStyle = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(2, 2.5),
    borderRadius: Number(theme.shape.borderRadius) * 1.5,
    backgroundColor: theme.palette.grey[500_12],
}));

const DashboardSidebar = ({ isOpenSidebar, onCloseSidebar, user }) => {
    const { pathname } = useLocation();
    const isDesktop = useResponsive('up', 'lg');

    useEffect(() => {
        if (isOpenSidebar) {
            onCloseSidebar();
        }
    }, [pathname]);

    const renderContent = (
        <Scrollbar
            sx={{
                height: 1,
                '& .simplebar-content': { height: 1, display: 'flex', flexDirection: 'column' },
            }}
        >
            <Box sx={{ px: 2.5, py: 3, display: 'inline-flex' }}>
                <Logo />
            </Box>
        
            <Box sx={{ mb: 5, mx: 2.5 }}>
                <Link underline="none" component={RouterLink} to="/dashboard/users/profile">
                    <AccountStyle>
                        { user?.avatar?.url ? (
                                <Avatar src={`${user?.avatar.url}`} alt={`${user?.name}`} />
                            )
                        :
                            (<LetterAvatar name={user?.name} />)}
                        <Box sx={{ ml: 2 }}>
                            <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
                                {user?.name}
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                {user?.roles.join(' ')}
                            </Typography>
                        </Box>
                    </AccountStyle>
                </Link>
            </Box>
        
            <NavSection navConfig={navConfig} />
        
            <Box sx={{ flexGrow: 1 }} />
        
            <Box sx={{ px: 2.5, pb: 3, mt: 10 }}>
                <Stack alignItems="center" spacing={3} sx={{ pt: 5, borderRadius: 2, position: 'relative' }}>
                    <Box
                        component="img"
                        src="/static/illustrations/illustration_avatar.png"
                        sx={{ width: 100, position: 'absolute', top: -50 }}
                    />
                </Stack>
            </Box>
        </Scrollbar>
    );

    return (
        <RootStyle>
            {!isDesktop && (
                <Drawer
                    open={isOpenSidebar}
                    onClose={onCloseSidebar}
                    PaperProps={{
                        sx: { width: DRAWER_WIDTH },
                    }}
                >
                    {renderContent}
                </Drawer>
            )}
        
            {isDesktop && (
                <Drawer
                    open
                    variant="persistent"
                    PaperProps={{
                        sx: {
                        width: DRAWER_WIDTH,
                        bgcolor: 'background.default',
                        borderRightStyle: 'dashed',
                        },
                    }}
                >
                    {renderContent}
                </Drawer>
            )}
        </RootStyle>
    );
};

export default DashboardSidebar;