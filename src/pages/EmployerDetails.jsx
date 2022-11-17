import React, { useEffect } from 'react';
import {
    Avatar, Container, Box, Stack, Paper, Grid, Typography, Rating, Divider
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { getEmployers, selectEmployerById } from '../app/slices/employerSlice';
import { selectJobsByUser, getJobs } from '../app/slices/jobSlice';
import Page from '../components/Page';
import { action_status } from '../app/constants';
import Iconify from '../components/Iconify';
import ShowMoreParagraph from '../components/ShowMoreParagraph';
import { fDate } from '../utils/formatTime';
import UserJobTable from '../features/jobs/UserJobTable';

const PaperStyle = styled(Paper)(({ theme }) => ({
    color: theme.palette.main,
    overflow: 'hidden',
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    zIndex: 0,
    padding: theme.spacing(1),
    boxShadow: theme.shadows[2]
}));

const InfoLineStyle = styled('div')(({theme}) => ({
    display: 'flex',
    alignItems: 'center',
    marginBlockStart: theme.spacing(2)
}));

const InfoHighlightStyle = styled(Typography)(({theme}) => ({
    margin: 0,
    fontWeight: 550
}));

const EmployerDetails = () => {
    const { employerId } = useParams();
    const employer = useSelector((state) => selectEmployerById(state, employerId));
    const { status } = useSelector((state) => state.employers);
    const jobs = useSelector((state) => selectJobsByUser(state, employerId));
    const { status: jobStatus } = useSelector((state) => state.jobs);
    const dispatch = useDispatch();

    useEffect(() => {
        if (jobStatus === action_status.IDLE) {
            dispatch(getJobs());
        }

    }, [dispatch, jobStatus]);

    useEffect(() => {
        if (status === action_status.IDLE) {
            dispatch(getEmployers());
        }
    }, [status, dispatch])

    return (
        <Page title={`Employer ${employer?.companyName}`}>
            <Container maxWidth='xl'>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h4" >
                        {`Employer ${employer?.companyName}`}
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
                                }}
                            >
                                {employer?.user?.image ? (
                                    <Avatar
                                        src={employer?.user?.image}
                                        alt={`${employer?.companyName}`}
                                        sx={{ width: 120, height: 120 }}
                                    />
                                ) : (
                                    <Avatar
                                        sx={{ width: 120, height: 120, fontSize: '64px' }}
                                    >
                                        {employer?.companyName[0]}
                                    </Avatar>
                                )}
                                <Typography display={'block'} variant='h4' textAlign={'center'} sx={{ marginBlockStart: 2 }}>
                                    {`${employer?.companyName}`}
                                </Typography>
                                <Stack direction='row' spacing={1} sx={{ marginBlock: 1 }}>
                                    <Rating name="employer-rating" value={employer?.rating?.stars} precision={0.5} readOnly />
                                </Stack>
                                {employer?.user?.createdAt && (
                                    <InfoLineStyle>
                                        <Iconify icon='material-symbols:calendar-today' width={25} height={25} sx={{ marginInlineEnd: 1 }} />
                                        <Typography variant='body2'>
                                            {`Joined ${fDate(employer?.user?.createdAt)}`}
                                        </Typography>
                                    </InfoLineStyle>
                                )}
                            </Box>
                            <Divider sx={{ marginBlock: 2 }} />
                            <Typography variant='h5' sx={{ marginBlockEnd: 2 }}>
                                Details
                            </Typography>
                            <Stack spacing={2}>
                                {employer?.companySize && ((
                                    <Typography variant='body2'>
                                        {'Company Size: '}
                                        <Typography component='span' variant='body2' color='text.secondary'>
                                            {employer?.companySize}
                                        </Typography>
                                    </Typography>
                                ))}
                                {employer?.companyType && (
                                    <Typography variant='body2'>
                                        {'Company Type: '}
                                        <Typography component='span' variant='body2' color='text.secondary'>
                                            {employer?.companyType}
                                        </Typography>
                                    </Typography>
                                )}
                                {employer?.foundingDate && (
                                    <Typography variant='body2'>
                                        {'Founding Date: '}
                                        <Typography component='span' variant='body2' color='text.secondary'>
                                            {fDate(employer?.foundingDate)}
                                        </Typography>
                                    </Typography>
                                )}
                            </Stack>
                        </PaperStyle>
                    </Grid>
                    <Grid item xs={12} md={8}>
                        <PaperStyle
                             sx={{
                                paddingInline: 3,
                                paddingBlockStart: 1,
                                paddingBlockEnd: 2
                            }}
                        >
                            <Typography variant='h5' sx={{ marginBlockEnd: 2 }}>
                                About
                            </Typography>
                            <Stack spacing={2}>
                                {employer?.user?.introduction && (
                                    <ShowMoreParagraph text={employer?.user?.introduction} line={2} />
                                )}
                                <Grid container>
                                    <Grid item xs={12} md={6}>
                                        <InfoLineStyle>
                                            <Iconify icon='eva:email-fill' width={25} height={25} sx={{ marginInlineEnd: 2 }} />
                                            <Typography variant='body2'>
                                                {employer?.user?.email}
                                            </Typography>
                                        </InfoLineStyle>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <InfoLineStyle>
                                            <Iconify icon='eva:phone-fill' width={25} height={25} sx={{ marginInlineEnd: 2 }} />
                                            <Typography variant='body2'>
                                                {employer?.user?.phone}
                                            </Typography>
                                        </InfoLineStyle>
                                    </Grid>
                                </Grid>
                                <InfoLineStyle>
                                    <Iconify icon='eva:pin-fill' width={25} height={25} sx={{ marginInlineEnd: 2 }} />
                                    <Typography variant='body2'>
                                        {'Live at '}
                                        <InfoHighlightStyle variant='body2' color='text.secondary' component={'span'}>
                                            {`${employer?.user?.address}`}
                                        </InfoHighlightStyle>
                                    </Typography>
                                </InfoLineStyle>
                            </Stack>
                        </PaperStyle>
                        {jobs?.length > 0 && (
                            <PaperStyle sx={{ marginBlock: 2 }}>
                                <UserJobTable jobs={jobs} />
                            </PaperStyle>
                        )}
                    </Grid>
                </Grid>
            </Container>
        </Page>
    )
}

export default EmployerDetails;