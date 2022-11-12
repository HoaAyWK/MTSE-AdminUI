import React, { useEffect } from 'react';
import { styled } from '@mui/material/styles';
import {
    Avatar,
    Box,
    Container,
    Grid,
    Paper,
    Tooltip,
    Typography,
    Stack,
    Divider,
    Card,
    CardContent,
    Button
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, Link as RouterLink } from 'react-router-dom';

import Page from '../components/Page';
import { getJobs, selectJobById } from '../app/slices/jobSlice';
import { action_status } from '../app/constants';
import LetterAvatar from '../components/LetterAvatar';
import Label from '../components/Label';
import { fDate } from '../utils/formatTime';
import JobInfoLine from '../features/jobs/JobInfoLine';
import { getOffersByJob } from '../app/slices/offerSlice';
import Offer from '../features/offers/Offer';

const PaperStyle = styled(Paper)(({ theme }) => ({
    color: theme.palette.main,
    overflow: 'hidden',
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    zIndex: 0,
    padding: theme.spacing(1),
    boxShadow: theme.shadows[2],
    padding: theme.spacing(2)
}));

const CardStyle = styled(Card)(({ theme }) => ({
    backgroundColor: theme.palette.grey[500_12],
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[0]
}));

const JobDetails = () => {
    const { jobId } = useParams();
    console.log(jobId);
    const job = useSelector((state) => selectJobById(state, jobId));
    const { status } = useSelector((state) => state.jobs);
    const { offers } = useSelector((state) => state.offers);
    const dispatch = useDispatch();

    useEffect(() => {
        if (status === action_status.IDLE) {
            dispatch(getJobs());
        }
    }, [status, dispatch]);

    useEffect(() => {
        dispatch(getOffersByJob(jobId))
    }, [jobId, dispatch]);

    return (
        <Page title={`Job ${job?.name}`}>
            <Container maxWidth='xl'>
                {job && (
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={8}>
                            <PaperStyle>
                                <Stack spacing={1}>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between'
                                        }}
                                    >  
                                        <Typography variant='h4' sx={{ fontWeight: 700, lineHeight: 1.5 }}>
                                            {job?.name}
                                        </Typography>
                                        <Box>
                                            <Label variant='ghost' color='info'>
                                                {fDate(job?.createdAt)}
                                            </Label>
                                        </Box>
                                    </Box>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center'
                                        }}
                                    >
                                        {job?.owner?.avatar?.url ? (
                                            <Avatar src={job.owner.avatar.url} alt={job?.name} />
                                        ) : (
                                            <LetterAvatar name={job?.owner?.name} />
                                        )}
                                        <Stack spacing={0} sx={{ marginInlineStart: 1 }}>
                                            <Tooltip title={job?.owner?.name}>
                                                <Typography
                                                    component={RouterLink}
                                                    to={`/dashboard/users/${job?.owner?.id}`}
                                                    color='text.primary'
                                                    sx={{
                                                        textDecoration: 'none',
                                                        fontWeight: 600
                                                    }}
                                                    variant='body2'
                                                >
                                                        {job?.owner?.name}
                                                </Typography>
                                            </Tooltip>
                                            <Typography variant='caption' color='text.secondary'>{job?.owner?.email}</Typography>
                                        </Stack>
                                    </Box>
                                </Stack>
                                <Divider sx={{ marginBlock: 2 }} />
                                <CardStyle>
                                    <CardContent>
                                        <Typography variant='body1'>
                                            {job?.description}
                                        </Typography>
                                    </CardContent>
                                </CardStyle>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'flex-end',
                                        marginBlockStart: 2
                                    }}
                                >
                                    <Label variant='outlined' >
                                        <Tooltip title={job?.category?.name} >
                                            <Typography
                                                component={RouterLink}
                                                to={`/dashboard/categories`}
                                                sx={{
                                                    textDecoration: 'none',
                                                }}
                                                color='text.primary'
                                                variant='body1'>
                                                {job?.category?.name}
                                            </Typography>
                                        </Tooltip>
                                    </Label>
                                </Box>
                            </PaperStyle>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <PaperStyle>
                                <Stack spacing={2}>
                                    <JobInfoLine
                                        icon='fluent-mdl2:status-circle-inner'
                                        iconStyle={{
                                            color: (job?.status === 'Open' && '#00b074') ||
                                                (job?.status === 'Processing' && '#ffcd38') ||
                                                (job?.status === 'SelectedFreelancer' && '#3d5afe') ||
                                                (job?.status === 'PendingStart' && '#1de9b6') ||
                                                '#ff1744' 
                                        }}
                                        title='Status'
                                        content={job?.status}
                                    />
                                    <JobInfoLine
                                        icon='bxs:dollar-circle'
                                        iconStyle={{ color: '#00b074' }}
                                        title='Budget'
                                        content={`${job?.minPrice} - ${job?.maxPrice}$`}
                                    />
                                    <JobInfoLine
                                        icon='ant-design:calendar-twotone'
                                        iconStyle={{ color: '#651fff' }}
                                        title='Start Date'
                                        content={fDate(job?.startDate)}
                                    />
                                    <JobInfoLine
                                        icon='ant-design:calendar-twotone'
                                        iconStyle={{ color: '#b22a00' }}
                                        title='End Date'
                                        content={fDate(job?.endDate)}
                                    />
                                    {job?.status === 'Open' && (
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'flex-end'
                                                
                                            }}
                                        >
                                            <Button variant='contained' color='error'>
                                                Delete
                                            </Button>
                                        </Box>
                                    )}
                                </Stack>
                            </PaperStyle>
                        </Grid>
                        {offers?.length > 0 && (
                            <Grid item xs={12} md={8}>
                                <Box
                                    sx={{
                                        marginBlockStart: 2,
                                        marginBlockEnd: 1
                                    }}
                                >                              
                                    <Typography variant='body1' color='text.secondary' sx={{ fontWeight: 600, fontSize: '1.2rem', marginBlockStart: 2 }} >
                                        {offers?.length} {offers?.length > 1 ? 'Offers' : 'Offer' }
                                    </Typography>
                                    <Divider />
                                </Box>
                                <Stack spacing={2} sx={{ marginBlockStart: 2 }}>
                                    {offers?.map((offer) => (
                                        <Offer offer={offer} key={offer?.id} />
                                    ))}
                                </Stack>
                            </Grid>
                        )}
                    </Grid>
                )}
            </Container>
        </Page>
    );
};

export default JobDetails;