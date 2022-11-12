import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
    Avatar,
    Grid,
    Container,
    Typography,
    Button,
    Stack,
    Box,
    List,
    ListItemAvatar,
    ListItemButton,
    ListItemSecondaryAction,
    ListItemText,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { styled } from '@mui/material/styles';

import Page from '../components/Page';
import LetterAvatar from '../components/LetterAvatar';
import { EarningCard, TotalUserCard } from '../features/dashboard';
import EarningChart from '../components/chart/EarningChart';
import { action_status } from '../app/constants';
import { getStatistic } from '../app/slices/statisticSlice';
import MainCard from '../components/MainCard';
import { getFeedbacks, selectFeedbackByNumber } from '../app/slices/feedbackSlice';
import { fToNow } from '../utils/formatTime';
import RecentPaymentsTable from '../features/payments/RecentPaymentsTable';

const ButtonStyle = styled(Button)(({ theme }) => ({
    backgroundColor: theme.palette.success.dark,
    '&:hover': {
        backgroundColor: theme.palette.success.main,
    },
    color: '#fff'
}));

const ButtonOutlinedStyle = styled(Button)(({ theme }) => ({
    borderColor: theme.palette.success.dark,
    '&:hover': {
        backgroundColor: theme.palette.success.dark,
        color: '#fff'
    },
    color: theme.palette.success.dark,
}));

const avatarSX = {
    width: 36,
    height: 36,
    fontSize: '1rem'
};

const actionSX = {
    mt: 0.75,
    ml: 1,
    top: 'auto',
    right: 'auto',
    alignSelf: 'flex-start',
    transform: 'none'
};


const DashboardApp = () => {
    const [slot, setSlot] = useState('week');
    const dispatch = useDispatch();
    const { status, statistic } = useSelector((state) => state.statistic);
    const { status: feedbackStatus } = useSelector((state) => state.feedbacks);
    const feedbacks = useSelector((state) => selectFeedbackByNumber(state, 5));
    const [totalEarning, setTotalEarning] = useState(0);
    const [totalUsers, setTotalUsers] = useState(0);

    useEffect(() => {
        if (status === action_status.IDLE) {
            dispatch(getStatistic());
        }

        if (status === action_status.SUCCEEDED) {
            setTotalEarning(statistic[2]);
            setTotalUsers(statistic[3]);
        }
    }, [status, dispatch, statistic]);

    useEffect(() => {
        if (feedbackStatus === action_status.IDLE) {
            dispatch(getFeedbacks());
        }
    }, [feedbackStatus, dispatch])

    return (
        <Page title="Dashboard">
            <Container maxWidth="xl">
                <Typography variant="h4" sx={{ mb: 5 }}>
                    Hi, Welcome back
                </Typography>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <EarningCard isLoading={status === action_status.LOADING ? true : false} total={totalEarning} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TotalUserCard isLoading={status === action_status.LOADING ? true : false} total={totalUsers} />
                    </Grid>
                </Grid>
                {status === action_status.LOADING ? (
                    <div>Loading</div>
                ) : (
                    <Grid container spacing={3} sx={{ marginBlockStart: 2 }}>
                        <Grid item xs={12} md={7} lg={8}>
                            <Grid container alignItems="center" justifyContent="space-between">
                                <Grid item>
                                    <Typography variant="h5" color='text.primary' fontWeight={400}>Earning</Typography>
                                </Grid>
                                <Grid item>
                                    <Stack direction="row" alignItems="center" spacing={0} sx={{ color: '$fff' }}>
                                        {slot === 'month' ? (
                                            <ButtonStyle
                                                size="small"
                                                onClick={() => setSlot('month')}
                                                variant='contained'
                                            >
                                                Month
                                            </ButtonStyle>
                                        ) : (
                                            <Button
                                                size='small'
                                                onClick={() => setSlot('month')}
                                                color='success'
                                                variant='text'
                                            >
                                                Month
                                            </Button>
                                        )}
                                        {slot === 'week' ? (
                                            <ButtonStyle
                                                size="small"
                                                onClick={() => setSlot('week')}
                                                variant='contained'
                                            >                                           
                                                Week
                                            </ButtonStyle>
                                        ) : (
                                            <Button
                                                size='small'
                                                onClick={() => setSlot('week')}
                                                color='success'
                                                variant='text'
                                            >
                                                Week
                                            </Button>
                                        )}
                                    </Stack>
                                </Grid>
                            </Grid>
                            <MainCard content={false} sx={{ mt: 1.5 }}>
                                <Box sx={{ pt: 1, pr: 2 }}>
                                    <EarningChart slot={slot} />
                                </Box>
                            </MainCard>
                        </Grid>
                        <Grid item xs={12} md={5} lg={4}>
                            <Grid container alignItems="center" justifyContent="space-between">
                                <Grid item>
                                    <Typography variant="h5" color='text.primary' fontWeight={400}>Latest Feedbacks</Typography>
                                </Grid>
                                <Grid item />
                            </Grid>
                            <MainCard sx={{  mt: 1.5, boxShadows: 'none' }} content={false}>
                                <List
                                    component="nav"
                                    sx={{
                                        px: 0,
                                        py: 0,
                                        '& .MuiListItemButton-root': {
                                            py: 1.5,
                                            '& .MuiAvatar-root': avatarSX,
                                            '& .MuiListItemSecondaryAction-root': { ...actionSX, position: 'relative' }
                                        }
                                    }}
                                >
                                    {feedbacks?.map((feedback, index) => (
                                        <ListItemButton divider={index === feedbacks.length - 1 ? false : true} key={feedback.id}>
                                            <ListItemAvatar>
                                                {feedback.user?.avatar ? (
                                                    <Avatar src={feedback.user.avatar.url} alt={feedback.user.name} />
                                                ) : (
                                                    <LetterAvatar name={feedback.user.name} />
                                                )}
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={<Typography variant="body1">{feedback.user.name}</Typography>}
                                                secondary={<Typography variant="body2" noWrap>
                                                        
                                                    </Typography>
                                                }
                                            />
                                            <ListItemSecondaryAction>
                                                <Stack alignItems="flex-end">
                                                    <Typography variant="body1" noWrap>
                                                        {feedback.name}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary" noWrap>
                                                        {fToNow(feedback.createdAt)}
                                                    </Typography>
                                                </Stack>         
                                            </ListItemSecondaryAction>
                                        </ListItemButton>
                                    ))}
                                </List>
                                <Box sx={{ display: 'flex', justifyContent: 'center', 'alignItems': 'center', marginBlock: 2 }}>
                                    <ButtonOutlinedStyle component={RouterLink} to='/dashboard/feedbacks' variant='outlined' size='small'>
                                        View all
                                    </ButtonOutlinedStyle>
                                </Box>
                            </MainCard>
                        </Grid>
                        <Grid item xs={12}>
                            <RecentPaymentsTable />
                        </Grid>
                    </Grid>   
                )}
            </Container>
        </Page>
    );
};

export default DashboardApp;