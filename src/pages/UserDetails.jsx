import React, { useState } from 'react';
import {
    Avatar, Container, Box, Stack, Paper, Grid, Typography, Divider, Rating
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { sentenceCase } from 'change-case';

import { getAllUsers, selectUserById } from '../features/users/userSlice';
import Page from '../components/Page';
import { useEffect } from 'react';
import { action_status } from '../app/constants';
import Label from '../components/Label';
import UserJobTable from '../features/jobs/UserJobTable';
import UserPaymentTable from '../features/payments/UserPaymentTable';
import UserCommentsTable from '../features/comments/UserCommentsTable';

const PaperStyle = styled(Paper)(({ theme }) => ({
    color: theme.palette.main,
    overflow: 'hidden',
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    zIndex: 0,
    padding: theme.spacing(1),
    boxShadow: theme.shadows[2]
}));

const UserDetails = () => {
    const { userId } = useParams();
    const user = useSelector((state) => selectUserById(state, userId));
    const { status } = useSelector((state) => state.users);

    const dispatch = useDispatch();

    useEffect(() => {
        if (status === action_status.IDLE) {
            dispatch(getAllUsers());
        }
    }, [status, dispatch])

    return (
        <Page title={`User ${user?.name}`}>
            <Container maxWidth='xl'>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h4" >
                        {`User ${user?.name}`}
                    </Typography>
                </Stack>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                        <PaperStyle
                            sx={{
                                padding: 3
                            }}
                        >
                            <Box 
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    flexDirection: 'column',
                                    marginBlockEnd: 2
                                }}
                            >
                                {user?.avatar?.url ? (
                                    <Avatar src={user.avatar.url} alt={user?.name} sx={{ width: 120, height: 120 }} />
                                ) : (
                                    <Avatar sx={{ width: 120, height: 120, fontSize: '64px' }}>{user?.name[0]}</Avatar>
                                )}
                                <Typography display={'block'} variant='h4' textAlign={'center'} sx={{ marginBlockStart: 2 }}>
                                    {user?.name}
                                </Typography>
                                <Stack direction={'row'} spacing={1}>
                                    {user?.roles.map((role) => (
                                        <Label
                                            key={role}
                                            variant='ghost'
                                            color={(role === 'freelancer' && 'warning') || (role === 'employer' && 'info') || 'secondary'}
                                        >
                                            {sentenceCase(role)}
                                        </Label>
                                    ))}
                                </Stack>
                                <Stack direction='row' spacing={1} sx={{ marginBlock: 2 }}>
                                    <Rating name="user-rating" value={user?.rating?.stars} precision={0.5} readOnly />
                                    <Typography variant='body1'>
                                        {`(${user?.rating?.numOfRating})`}
                                    </Typography>
                                </Stack>
                            </Box>
                            <Typography variant='h5'>
                                Details
                            </Typography>
                            <Divider sx={{ marginBlockStart: 1, marginBlockEnd: 2 }}/>
                            <Stack spacing={2}>
                                <Typography variant='body2'>
                                    {'Email: '}
                                    <Typography component='span' variant='body2' color='text.secondary'>
                                        {user?.email}
                                    </Typography>
                                </Typography>
                                <Typography variant='body2'>
                                    {'Phone: '}
                                    <Typography component='span' variant='body2' color='text.secondary'>
                                        {user?.phone}
                                    </Typography>
                                </Typography>
                                <Typography variant='body2'>
                                    {'Status: '}
                                    <Label variant='ghost' color={(user?.status === 'Active' && 'success') || 'error'}>
                                        {user?.status}
                                    </Label>
                                </Typography>
                                <Typography variant='body2'>
                                    {'Gender: '}
                                    <Typography component='span' variant='body2' color='text.secondary'>
                                        {user?.gender === 'None' ? 'Male' : user?.gender}
                                    </Typography>
                                </Typography>
                                <Typography variant='body2'>
                                    {'Address: '}
                                    <Typography component='span' variant='body2' color='text.secondary'>
                                        {user?.address}
                                    </Typography>
                                </Typography>
                                <Typography variant='body2'>
                                    {'City: '}
                                    <Typography component='span' variant='body2' color='text.secondary'>
                                        {user?.city}
                                    </Typography>
                                </Typography>
                                <Typography variant='body2'>
                                    {'Country: '}
                                    <Typography component='span' variant='body2' color='text.secondary'>
                                        {user?.country}
                                    </Typography>
                                </Typography>
                            </Stack>
                        </PaperStyle>
                    </Grid>
                    <Grid item xs={12} md={8}>
                        <Stack spacing={2}>
                            <PaperStyle>
                                <UserCommentsTable userId={userId} />
                            </PaperStyle>
                            {user?.roles?.includes('employer') && (
                                <PaperStyle>
                                    <UserJobTable userId={userId} />
                                </PaperStyle>
                            )}
                            <PaperStyle>
                                <UserPaymentTable userId={userId} />
                            </PaperStyle>
                        </Stack>
                    </Grid>
                </Grid>
            </Container>
        </Page>
    );
};

export default UserDetails;