import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Box, Typography, Stack, Tab } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';

import Page from '../components/Page';
import BreadcrumbRouter from '../components/BreadcrumbRouter';
import useLocalStorage from '../hooks/useLocalStorage';
import { getCurrentUser } from '../app/slices/authSlice';
import { AccountForm, ChangePasswordForm } from '../features/account';


const breadcrumbNameMap = {
    '': 'Dashboard',
    'users': 'Users',
    'users/account': 'Account Settings'
};

const PageStyle = styled(Page)(({theme}) => ({
    backgroundImage: 'none',
    overflow: 'hidden',
    borderRadius: theme.shape.borderRadius,
    transition: 'box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
    zIndex: 0,
    position: 'relative',
    margin: theme.spacing(5, 0)
}));

const AccountSettings = () => {
    const [value, setValue] = useState('1');
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    useEffect(() => {
        if (!user) {
            dispatch(getCurrentUser());
        }
    }, [user, dispatch]);


    const handleChangeValue = (e, newValue) => {
        setValue(newValue);
    };

    return (
        <Container maxWidth='xl'>
            <Box sx={{ marginBlockEnd: '5' }}>
                <Stack spacing={2}>
                    <Typography variant="h4" >
                        Account
                    </Typography>
                    <BreadcrumbRouter exclude='dashboard' breadcrumbNameMap={breadcrumbNameMap} />
                </Stack>
            </Box>
            <PageStyle title="Account Settings">
                <TabContext value={value}>
                    <Box >
                        <TabList onChange={handleChangeValue} aria-label='account-settings-tabs' textColor='primary'>
                            <Tab label='General' value='1' />
                            <Tab label='Change Password' value='2' />
                        </TabList>
                    </Box>
                    <TabPanel value='1'>
                        <AccountForm user={user} />
                    </TabPanel>
                    <TabPanel value='2'>
                        <ChangePasswordForm user={user} />
                    </TabPanel>
                </TabContext>
            </PageStyle>
        </Container>
    );
};

export default AccountSettings;